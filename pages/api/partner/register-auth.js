import { createClient } from "@supabase/supabase-js";

const supabaseAdmin =
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        { auth: { autoRefreshToken: false, persistSession: false } },
      )
    : null;

function normalizeEmail(e) {
  return String(e || "").trim().toLowerCase();
}

function isEmailVerifiedForApplication(email) {
  global.verificationCodes = global.verificationCodes || {};
  const record = global.verificationCodes[email];
  if (!record?.verified) return false;
  const now = Date.now();
  return now <= (record.applicationExpires || record.expires || 0);
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  const { email: rawEmail, password } = req.body || {};
  const email = normalizeEmail(rawEmail);

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "缺少參數" });
  }
  if (password.length < 6) {
    return res.status(400).json({ success: false, message: "密碼至少需 6 位" });
  }
  if (!isEmailVerifiedForApplication(email)) {
    return res
      .status(400)
      .json({ success: false, message: "請先完成 Email 驗證，或驗證已過期請重新驗證" });
  }
  if (!supabaseAdmin) {
    return res.status(500).json({
      success: false,
      message: "伺服器未設定 SUPABASE_SERVICE_ROLE_KEY",
    });
  }

  const { error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { source: "partner_application" },
  });

  if (error) {
    const msg = error.message || "";
    const alreadyExists =
      msg.toLowerCase().includes("already") ||
      msg.toLowerCase().includes("registered") ||
      error.status === 422;

    if (alreadyExists) {
      return res.status(200).json({
        success: true,
        existing: true,
        message: "此 Email 已有會員帳號，審核通過後請用原密碼登入夥伴後台",
      });
    }

    return res.status(400).json({ success: false, message: msg || "建立帳號失敗" });
  }

  return res.status(200).json({
    success: true,
    existing: false,
    message: "登入帳號已建立",
  });
}
