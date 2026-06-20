import { requireMedusaAdminFromRequest } from "../../../lib/medusaAdminAuth";

/** GET /api/admin/session — 驗證 Medusa 管理員 token */
export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end("Method Not Allowed");
  }

  const admin = await requireMedusaAdminFromRequest(req);
  res.setHeader("Cache-Control", "private, no-store");

  if (!admin) {
    return res.status(401).json({ authenticated: false });
  }

  return res.status(200).json({
    authenticated: true,
    user: admin.user,
  });
}
