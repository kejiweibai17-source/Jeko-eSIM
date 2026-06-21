/**
 * GET /api/auth/debug-config
 * 檢查 NextAuth / LINE / Supabase 環境（不輸出完整 secret）
 * Vercel → Deployments → Functions → Logs 也可看到 [Auth Debug] 輸出
 */
import { authLog } from "../../../lib/authDebug";
import { PRODUCTION_SITE_URL, PRODUCTION_SITE_HOST } from "../../../lib/siteUrl";

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const nextAuthUrl = process.env.NEXTAUTH_URL || "(未設定)";
  const lineId = process.env.LINE_CLIENT_ID || "";
  const hasLineSecret = !!process.env.LINE_CLIENT_SECRET;
  const hasNextAuthSecret = !!process.env.NEXTAUTH_SECRET;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "(未設定)";
  const hasServiceRole = !!process.env.SUPABASE_SERVICE_ROLE_KEY;

  const report = {
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV || "(本機)",
    vercelUrl: process.env.VERCEL_URL || "(本機)",
    nextAuthUrl,
    expectedLineCallback: nextAuthUrl.startsWith("http")
      ? `${nextAuthUrl.replace(/\/$/, "")}/api/auth/callback/line`
      : "(NEXTAUTH_URL 無效，無法推算 callback)",
    lineClientIdPrefix: lineId ? `${lineId.slice(0, 6)}...` : "(未設定)",
    hasLineClientId: !!lineId,
    hasLineClientSecret: hasLineSecret,
    hasNextAuthSecret,
    supabaseUrl,
    hasSupabaseServiceRole: hasServiceRole,
    checks: {
      nextAuthUrlOk:
        nextAuthUrl.startsWith(PRODUCTION_SITE_URL) ||
        nextAuthUrl.startsWith(`https://${PRODUCTION_SITE_HOST}`) ||
        nextAuthUrl.startsWith("http://localhost:3000"),
      lineKeysOk: !!lineId && hasLineSecret,
      supabaseOk:
        supabaseUrl.includes("supabase.co") && hasServiceRole && hasNextAuthSecret,
    },
    productionSiteUrl: PRODUCTION_SITE_URL,
    hint: `LINE Developers 必須登記 expectedLineCallback；正式站 NEXTAUTH_URL=${PRODUCTION_SITE_URL}`,
  };

  authLog("debug-config 被呼叫", report);
  return res.status(200).json(report);
}
