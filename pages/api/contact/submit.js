import { getSupabaseAdmin } from "../../../lib/refundAuth";

const VALID_TYPES = ["general", "partner", "refund"];

function cleanStr(v, max = 500) {
  if (v == null) return null;
  return String(v).trim().slice(0, max) || null;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return res.status(500).json({ error: "伺服器設定不完整" });
  }

  const {
    type,
    name,
    email,
    phone,
    company,
    order_id,
    partner_type,
    subject,
    message,
    metadata,
    image_urls,
    agreed_privacy,
  } = req.body || {};

  if (!VALID_TYPES.includes(type)) {
    return res.status(400).json({ error: "無效的表單類型" });
  }

  const emailClean = cleanStr(email, 200);
  if (!emailClean || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailClean)) {
    return res.status(400).json({ error: "請填寫有效的 Email" });
  }

  const messageClean = cleanStr(message, 5000);
  if (!messageClean || messageClean.length < 5) {
    return res.status(400).json({ error: "請填寫諮詢內容（至少 5 字）" });
  }

  if (!agreed_privacy) {
    return res.status(400).json({ error: "請同意個人資料處理方式" });
  }

  if (type === "refund" && !cleanStr(order_id, 50)) {
    return res.status(400).json({ error: "退換款聯繫請填寫訂單編號" });
  }

  const row = {
    type,
    name: cleanStr(name, 120),
    email: emailClean.toLowerCase(),
    phone: cleanStr(phone, 30),
    company: cleanStr(company, 200),
    order_id: cleanStr(order_id, 50),
    partner_type: cleanStr(partner_type, 50),
    subject: cleanStr(subject, 200),
    message: messageClean,
    metadata: metadata && typeof metadata === "object" ? metadata : {},
    image_urls: Array.isArray(image_urls)
      ? image_urls.filter((u) => typeof u === "string").slice(0, 5)
      : [],
    status: "pending",
  };

  const { data, error } = await supabase
    .from("contact_submissions")
    .insert([row])
    .select("id, created_at")
    .single();

  if (error) {
    console.error("[contact/submit]", error);
    return res.status(500).json({ error: "提交失敗，請稍後再試" });
  }

  return res.status(200).json({
    success: true,
    id: data.id,
    message: "我們已收到您的訊息，將於 1～3 個工作天內回覆。",
  });
}
