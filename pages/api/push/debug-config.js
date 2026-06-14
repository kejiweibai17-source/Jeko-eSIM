/**
 * GET /api/push/debug-config
 * 檢查 Vercel 推播相關環境變數（不含私鑰明文）
 */
export default function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end("Method Not Allowed");
  }

  const pub = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";
  const priv = process.env.VAPID_PRIVATE_KEY || "";

  const checks = {
    vapidPublicOk: pub.length > 20,
    vapidPrivateOk: priv.length > 20,
    vapidPairLikelyOk: pub.length > 20 && priv.length > 20,
    supabaseUrlOk: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseServiceOk: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  };

  return res.status(200).json({
    ok: Object.values(checks).every(Boolean),
    checks,
    vapidPublicPrefix: pub.slice(0, 12) || null,
    vapidPublicLength: pub.length,
    vapidPrivateLength: priv.length,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || null,
    nodeEnv: process.env.NODE_ENV,
    hint: !checks.vapidPublicOk
      ? "請在 Vercel 設定 NEXT_PUBLIC_VAPID_PUBLIC_KEY"
      : !checks.vapidPrivateOk
      ? "請在 Vercel 設定 VAPID_PRIVATE_KEY（與公鑰配對）"
      : !checks.supabaseServiceOk
      ? "請設定 SUPABASE_SERVICE_ROLE_KEY"
      : null,
  });
}
