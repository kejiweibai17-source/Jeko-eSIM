/**
 * GET /api/cron/check-traffic
 *
 * Vercel Cron 每 30 分鐘檢查已綁定 eSIM 的剩餘流量，偏低時發 Web Push + LINE 推播。
 * 需帶 Authorization: Bearer {CRON_SECRET} 或 ?secret=
 */
import { runTrafficMonitor } from "../../../lib/trafficMonitor";

const CRON_SECRET =
  process.env.CRON_SECRET ||
  process.env.PUSH_INTERNAL_SECRET ||
  "jeko-push-secret-2026";

export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "POST") {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end("Method Not Allowed");
  }

  const authHeader = req.headers.authorization || "";
  const bearer = authHeader.replace(/^Bearer\s+/i, "").trim();
  const querySecret = req.query.secret;
  const vercelCron = req.headers["x-vercel-cron"] === "1";

  const authorized =
    vercelCron ||
    bearer === CRON_SECRET ||
    querySecret === CRON_SECRET;

  if (!authorized) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const result = await runTrafficMonitor();
    if (!result.ok) {
      return res.status(500).json(result);
    }
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    console.error("[cron/check-traffic]", err);
    return res.status(500).json({ error: err.message });
  }
}
