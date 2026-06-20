import { sendMail, mailErrorMessage } from "../../lib/mailTransporter";

// 驗證碼配置
const DEFAULT_COOLDOWN = 10; // 10 秒冷卻
const CODE_TTL_MS = 10 * 60 * 1000; // 驗證碼 10 分鐘有效
const MAX_PER_HOUR = 5; // 單一 email 一小時內最多寄送 5 次

function buildVerificationEmailHtml(code) {
  return `
    <div style="font-family:system-ui,-apple-system,'Segoe UI',Arial,sans-serif;line-height:1.6;color:#1e293b;max-width:480px">
      <p style="margin:0 0 8px;font-size:13px;color:#1a56db;font-weight:700">Jeko eSIM</p>
      <h2 style="margin:0 0 16px;font-size:20px">您的 Email 驗證碼</h2>
      <p style="margin:0 0 12px">請在 10 分鐘內輸入以下 6 位數驗證碼：</p>
      <p style="margin:0 0 20px;font-size:32px;font-weight:800;letter-spacing:8px;color:#1a56db">${code}</p>
      <p style="margin:0;font-size:12px;color:#64748b">若您未申請驗證，請忽略此信。</p>
    </div>
  `;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  const { email, action = "new" } = req.body;
  if (!email || !email.includes("@")) {
    return res.status(400).json({ success: false, message: "Email 格式錯誤" });
  }

  // 初始化全域儲存（⚠️ 正式環境請改 Redis / DB）
  global.verificationCodes = global.verificationCodes || {};
  const store = global.verificationCodes;

  const now = Date.now();
  const rec = store[email];

  // 防止重複提交（10 秒內不能再次請求）
  if (rec && now - rec.lastSent < DEFAULT_COOLDOWN * 1000) {
    const wait = Math.ceil(
      (DEFAULT_COOLDOWN * 1000 - (now - rec.lastSent)) / 1000,
    );
    return res.status(429).json({
      success: false,
      message: `請稍候 ${wait} 秒再試`,
      cooldown: wait,
    });
  }

  // 一小時內最多 5 次
  if (rec) {
    if (!rec.windowStart || now - rec.windowStart > 60 * 60 * 1000) {
      rec.windowStart = now;
      rec.sentCount1h = 0;
    }
    if (rec.sentCount1h >= MAX_PER_HOUR) {
      return res
        .status(429)
        .json({ success: false, message: "寄送次數過多，請稍後再試" });
    }
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    await sendMail({
      to: email,
      subject: "Jeko eSIM Email 驗證碼",
      html: buildVerificationEmailHtml(code),
      text: `您的 Jeko eSIM 驗證碼是：${code}（10 分鐘內有效）`,
    });

    store[email] = {
      code,
      expires: now + CODE_TTL_MS,
      lastSent: now,
      sentCount1h: rec ? rec.sentCount1h + 1 : 1,
      windowStart: rec ? rec.windowStart : now,
    };

    return res.status(200).json({
      success: true,
      message: action === "resend" ? "已重新寄送驗證碼" : "驗證碼已發送",
      cooldown: DEFAULT_COOLDOWN,
    });
  } catch (err) {
    console.error("[send-code]", err?.message || err);
    return res.status(500).json({
      success: false,
      message: mailErrorMessage(err),
    });
  }
}
