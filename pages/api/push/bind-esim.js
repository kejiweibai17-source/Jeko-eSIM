import { createClient } from "@supabase/supabase-js";
import {
  resolveMemberEmail,
  fetchMemberEsims,
} from "./_memberAuth";
import { userOwnsTopupId } from "../../../lib/esimOrderExtract";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

function normalizeEmail(e) {
  return String(e || "").trim().toLowerCase();
}

function normalizeIccid(value) {
  return String(value || "").replace(/\s+/g, "").trim();
}

function safeEqual(a, b) {
  const sa = String(a || "");
  const sb = String(b || "");
  if (sa.length !== sb.length) return false;
  let out = 0;
  for (let i = 0; i < sa.length; i++) out |= sa.charCodeAt(i) ^ sb.charCodeAt(i);
  return out === 0;
}

function verifyEmailCode(email, code) {
  global.verificationCodes = global.verificationCodes || {};
  const store = global.verificationCodes;
  const record = store[email];
  if (!record) return { ok: false, message: "尚未發送驗證碼" };
  const now = Date.now();
  if (record.lockedUntil && now < record.lockedUntil) {
    return { ok: false, message: "嘗試過多，請稍後再試" };
  }
  if (now > record.expires) {
    delete store[email];
    return { ok: false, message: "驗證碼已過期" };
  }
  if (!safeEqual(record.code, code)) {
    record.failCount = (record.failCount || 0) + 1;
    return { ok: false, message: "驗證碼錯誤" };
  }
  delete store[email];
  return { ok: true };
}

async function findTopupByEmail(email) {
  const esims = await fetchMemberEsims(email);
  return esims[0] || null;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end("Method Not Allowed");
  }

  const {
    endpoint,
    iccid: rawIccid,
    email: rawEmail,
    code,
    topupId,
    bindMethod,
  } = req.body ?? {};

  if (!endpoint) {
    return res.status(400).json({ error: "缺少推播 endpoint，請先開啟推播通知" });
  }

  const { data: existing, error: findErr } = await supabaseAdmin
    .from("push_subscriptions")
    .select("id")
    .eq("endpoint", endpoint)
    .maybeSingle();

  if (findErr) {
    return res.status(500).json({ error: "查詢推播訂閱失敗", detail: findErr.message });
  }
  if (!existing) {
    return res.status(404).json({
      error: "找不到推播訂閱",
      hint: "請先點「開啟流量提醒通知」完成瀏覽器推播授權",
    });
  }

  const member = await resolveMemberEmail(req, res);
  const iccid = normalizeIccid(rawIccid);
  const email = normalizeEmail(rawEmail);
  const update = {
    iccid_bound_at: new Date().toISOString(),
    monitor_enabled: true,
  };
  if (member?.userId && member.source === "supabase") {
    update.user_id = member.userId;
  }

  // 路徑 C：會員選擇本站訂單 eSIM
  if (bindMethod === "member_order" && topupId) {
    if (!member?.email) {
      return res.status(401).json({ error: "請先登入會員" });
    }
    const esims = await fetchMemberEsims(member.email);
    if (!userOwnsTopupId(esims, topupId)) {
      return res.status(403).json({ error: "此 eSIM 不屬於您的帳戶" });
    }
    const target = esims.find((e) => e.topupId === String(topupId));
    update.topup_id = target.topupId;
    update.product_label = target.productName;
    update.order_id = target.orderId;
    update.guest_email = member.email;
    update.bind_method = "member_order";
    if (target.iccid) update.iccid = target.iccid;
  }
  // 路徑 A：手動 ICCID（訪客 / 會員皆可）
  else if (iccid) {
    if (!/^\d{18,22}$/.test(iccid)) {
      return res.status(400).json({
        error: "ICCID 格式錯誤",
        hint: "請輸入 18～22 碼數字",
      });
    }
    update.iccid = iccid;
    update.bind_method = member?.email ? "member_iccid" : "guest_iccid";
    if (email) update.guest_email = email;
    else if (member?.email) update.guest_email = member.email;
  }
  // 路徑 B：訪客 Email 驗證碼
  else if (email && code) {
    const verified = verifyEmailCode(email, code);
    if (!verified.ok) {
      return res.status(400).json({ error: verified.message });
    }
    update.guest_email = email;
    const target = await findTopupByEmail(email);
    if (target) {
      update.topup_id = target.topupId;
      update.product_label = target.productName;
      update.order_id = target.orderId;
      update.bind_method = "guest_email";
      if (target.iccid) update.iccid = target.iccid;
    } else {
      return res.status(400).json({
        error: "此 Email 尚無可監控的 eSIM 訂單",
        needsIccid: true,
        hint: "若 eSIM 非本站購買，請改輸入 ICCID 綁定",
      });
    }
  } else {
    return res.status(400).json({
      error: "請提供 ICCID、Email+驗證碼，或選擇會員訂單",
    });
  }

  const { error: updateErr } = await supabaseAdmin
    .from("push_subscriptions")
    .update(update)
    .eq("endpoint", endpoint);

  if (updateErr) {
    return res.status(500).json({ error: "綁定失敗", detail: updateErr.message });
  }

  return res.status(200).json({
    success: true,
    message: "eSIM 已綁定，流量偏低時將透過推播提醒您",
    bindMethod: update.bind_method,
    iccid: update.iccid || null,
    topupId: update.topup_id || null,
    productName: update.product_label || null,
    guestEmail: update.guest_email || null,
  });
}
