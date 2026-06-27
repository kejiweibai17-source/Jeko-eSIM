/** 商品內容前台編輯器 — 管理者 Email（與 Reviews 區塊一致） */
export const DEFAULT_PRODUCT_ADMIN_EMAILS = ["bob112722761236tom@gmail.com"];

export function getAdminEmailAllowlist() {
  const raw =
    process.env.PRODUCT_ADMIN_EMAILS || process.env.ADMIN_EMAIL || "";
  const fromEnv = raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  const defaults = DEFAULT_PRODUCT_ADMIN_EMAILS.map((e) => e.toLowerCase());
  return [...new Set([...fromEnv, ...defaults])];
}

export function isAdminEmail(email) {
  if (!email) return false;
  return getAdminEmailAllowlist().includes(String(email).trim().toLowerCase());
}
