import nodemailer from "nodemailer";

const GMAIL_USER = process.env.GMAIL_USER?.trim() || "";
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD?.trim() || "";
const MAIL_FROM_NAME =
  process.env.MAIL_FROM_NAME?.trim() || "Jeko eSIM 驗證";

export function getMailConfig() {
  return {
    user: GMAIL_USER,
    fromName: MAIL_FROM_NAME,
    configured: Boolean(GMAIL_USER && GMAIL_APP_PASSWORD),
  };
}

export function createMailTransporter() {
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    const err = new Error("MAIL_NOT_CONFIGURED");
    err.code = "MAIL_NOT_CONFIGURED";
    throw err;
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_APP_PASSWORD,
    },
  });
}

export async function sendMail({ to, subject, html, text = "" }) {
  const transporter = createMailTransporter();
  const { user, fromName } = getMailConfig();

  return transporter.sendMail({
    from: `"${fromName}" <${user}>`,
    to,
    subject,
    html,
    text,
  });
}

export function mailErrorMessage(error) {
  if (error?.code === "MAIL_NOT_CONFIGURED") {
    return "郵件服務尚未設定，請在伺服器設定 GMAIL_USER 與 GMAIL_APP_PASSWORD";
  }
  if (String(error?.message || "").includes("535")) {
    return "郵件帳號驗證失敗，請確認 Gmail 應用程式密碼是否正確";
  }
  return `寄送失敗：${error?.message || "未知錯誤"}`;
}
