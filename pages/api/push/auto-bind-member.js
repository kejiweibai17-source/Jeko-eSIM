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

async function applyBindUpdate(endpoint, update) {
  const { error } = await supabaseAdmin
    .from("push_subscriptions")
    .update(update)
    .eq("endpoint", endpoint);
  return error;
}

/**
 * POST /api/push/auto-bind-member
 * 會員開啟推播後：自動綁定最新一筆本站 eSIM 訂單
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end("Method Not Allowed");
  }

  const { endpoint, topupId } = req.body ?? {};
  if (!endpoint) {
    return res.status(400).json({ error: "缺少 endpoint" });
  }

  const member = await resolveMemberEmail(req, res);
  if (!member?.email) {
    return res.status(401).json({ error: "請先登入會員", needsManualBind: true });
  }

  const { data: sub } = await supabaseAdmin
    .from("push_subscriptions")
    .select("id")
    .eq("endpoint", endpoint)
    .maybeSingle();

  if (!sub) {
    return res.status(404).json({
      error: "找不到推播訂閱",
      hint: "請先開啟流量提醒通知",
    });
  }

  try {
    const esims = await fetchMemberEsims(member.email);
    if (!esims.length) {
      return res.status(404).json({
        error: "尚無可監控的本站 eSIM 訂單",
        needsManualBind: true,
        hint: "請先購買 eSIM，或改用手動輸入 ICCID",
      });
    }

    let target = null;
    if (topupId) {
      if (!userOwnsTopupId(esims, topupId)) {
        return res.status(403).json({ error: "此 eSIM 不屬於您的帳戶" });
      }
      target = esims.find((e) => e.topupId === String(topupId));
    } else {
      target = esims[0];
    }

    const update = {
      user_id: member.source === "supabase" ? member.userId : undefined,
      guest_email: member.email,
      topup_id: target.topupId,
      product_label: target.productName,
      order_id: target.orderId,
      bind_method: topupId ? "member_order" : "member_auto",
      iccid: target.iccid || undefined,
      iccid_bound_at: new Date().toISOString(),
      monitor_enabled: true,
    };

    const err = await applyBindUpdate(endpoint, update);
    if (err) {
      return res.status(500).json({ error: "綁定失敗", detail: err.message });
    }

    return res.status(200).json({
      success: true,
      bindMethod: update.bind_method,
      topupId: target.topupId,
      productName: target.productName,
      orderId: target.orderId,
      iccid: target.iccid || null,
      message: `已綁定「${target.productName}」，流量偏低時將推播通知您`,
    });
  } catch (e) {
    return res.status(500).json({ error: "自動綁定失敗", detail: e.message });
  }
}
