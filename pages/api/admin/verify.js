import { resolveAdminUser } from "../../../lib/adminAuth";

/**
 * GET /api/admin/verify
 * 伺服器端驗證是否為商品內容管理者（前端僅依此顯示編輯按鈕）
 */
export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end("Method Not Allowed");
  }

  const admin = await resolveAdminUser(req, res);
  res.setHeader("Cache-Control", "private, no-store");
  return res.status(200).json({
    isAdmin: !!admin,
  });
}
