/**
 * 站台網址（正式站：https://www.jeko-esim.com.tw）
 * 優先順序：NEXT_PUBLIC_SITE_URL → 請求 host → NEXTAUTH_URL（非 localhost）→ Vercel → 本機
 */

/** 正式站（程式碼 fallback；部署請設 NEXT_PUBLIC_SITE_URL） */
export const PRODUCTION_SITE_URL = "https://www.jeko-esim.com.tw";
export const PRODUCTION_SITE_HOST = "www.jeko-esim.com.tw";

/**
 * 取得站台根網址（寄信、API 依 request 組連結用）
 */
export function getSiteUrl(req) {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");

  if (req?.headers?.host) {
    const proto = req.headers["x-forwarded-proto"] || "http";
    return `${proto}://${req.headers.host}`.replace(/\/$/, "");
  }

  const nextAuth = process.env.NEXTAUTH_URL?.trim();
  if (nextAuth) return nextAuth.replace(/\/$/, "");

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`.replace(/\/$/, "");
  }

  return "http://localhost:3000";
}

/**
 * 對外連結、SEO、LINE 推播訊息用（避開本機 NEXTAUTH_URL 誤用）
 */
export function getPublicSiteUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");

  const nextAuth = process.env.NEXTAUTH_URL?.trim();
  if (nextAuth && !/localhost/i.test(nextAuth)) {
    return nextAuth.replace(/\/$/, "");
  }

  return PRODUCTION_SITE_URL;
}
