/**
 * 取得站台根網址（寄信、連結用）
 */
export function getSiteUrl(req) {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");

  if (req?.headers?.host) {
    const proto = req.headers["x-forwarded-proto"] || "http";
    return `${proto}://${req.headers.host}`.replace(/\/$/, "");
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`.replace(/\/$/, "");
  }

  return "http://localhost:3000";
}
