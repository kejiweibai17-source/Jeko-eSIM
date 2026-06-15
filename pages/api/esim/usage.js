import axios from "axios";
import crypto from "crypto";
import FormData from "form-data";
import { createClient } from "@supabase/supabase-js";

const ACCOUNT = (process.env.ESIM_ACCOUNT || "").trim();
const SECRET = (process.env.ESIM_SECRET || "").trim();
const SALT_HEX = (process.env.ESIM_SALT || "").trim();
const BASE_URL = (process.env.ESIM_BASE_URL || "https://microesim.cn").trim();

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

function signHeaders() {
  const timestamp = Date.now().toString();
  const nonce = crypto.randomBytes(6).toString("hex");
  const hexKey = crypto
    .pbkdf2Sync(SECRET, Buffer.from(SALT_HEX, "hex"), 1024, 32, "sha256")
    .toString("hex");
  const signature = crypto
    .createHmac("sha256", Buffer.from(hexKey, "utf8"))
    .update(ACCOUNT + nonce + timestamp)
    .digest("hex");
  return { timestamp, nonce, signature };
}

function normalizeIccid(v) {
  return String(v || "").replace(/\s+/g, "").trim();
}

async function fetchTopupDetail(topupId) {
  if (!ACCOUNT || !SECRET || !SALT_HEX) {
    return { ok: false, error: "eSIM 供應商 API 未設定" };
  }
  const detailSig = signHeaders();
  const detailForm = new FormData();
  detailForm.append("topup_id", topupId);
  const detailRes = await axios.post(
    `${BASE_URL}/allesim/v1/topupDetail`,
    detailForm,
    {
      headers: {
        ...detailForm.getHeaders(),
        "MICROESIM-ACCOUNT": ACCOUNT,
        "MICROESIM-NONCE": detailSig.nonce,
        "MICROESIM-TIMESTAMP": detailSig.timestamp,
        "MICROESIM-SIGN": detailSig.signature,
      },
      timeout: 15000,
    },
  );
  return { ok: true, data: detailRes.data };
}

/**
 * POST /api/esim/usage
 * body: { iccid?, topupId?, endpoint? }
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end("Method Not Allowed");
  }

  let { iccid, topupId, endpoint } = req.body ?? {};
  iccid = normalizeIccid(iccid);

  if (endpoint && !topupId && !iccid) {
    const { data: sub } = await supabaseAdmin
      .from("push_subscriptions")
      .select("iccid, topup_id, product_label")
      .eq("endpoint", endpoint)
      .maybeSingle();
    if (sub) {
      topupId = sub.topup_id || topupId;
      iccid = iccid || sub.iccid;
    }
  }

  if (!topupId && iccid) {
    const { data: sub } = await supabaseAdmin
      .from("push_subscriptions")
      .select("topup_id, product_label")
      .eq("iccid", iccid)
      .order("iccid_bound_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (sub?.topup_id) topupId = sub.topup_id;
  }

  if (!topupId && !iccid) {
    return res.status(400).json({ error: "請提供 ICCID 或 topup_id" });
  }

  if (topupId) {
    try {
      const result = await fetchTopupDetail(topupId);
      if (!result.ok) {
        return res.status(503).json({ error: result.error });
      }
      const detail = result.data;
      if (detail.code !== 1) {
        return res.status(400).json({
          error: detail.msg || "查詢失敗",
          raw: detail,
        });
      }
      const r = detail.result || {};
      return res.status(200).json({
        success: true,
        source: "topup_id",
        topupId,
        iccid: iccid || r.iccid || r.ICCID || null,
        productName: r.product_name || r.plan_name || null,
        status: r.status || r.state || null,
        remainingMb: r.remaining_mb ?? r.remain_mb ?? r.data_balance ?? null,
        totalMb: r.total_mb ?? r.data_total ?? null,
        expiresAt: r.expire_time || r.expired_at || null,
        raw: r,
        note: "數據依供應商更新，可能有 30 分鐘以上延遲",
      });
    } catch (e) {
      return res.status(500).json({
        error: "連線供應商失敗",
        detail: e.response?.data?.msg || e.message,
      });
    }
  }

  return res.status(200).json({
    success: true,
    source: "iccid_only",
    iccid,
    note: "已記錄 ICCID。若為本站購買，建議用 Email 驗證或會員登入以取得完整用量；供應商 ICCID 直查 API 待接入。",
    remainingMb: null,
    totalMb: null,
  });
}
