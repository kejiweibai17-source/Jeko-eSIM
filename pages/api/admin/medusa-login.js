import { loginMedusaAdmin, verifyMedusaAdminToken } from "../../../lib/medusaAdminAuth";

/**
 * POST /api/admin/medusa-login
 * Body: { email, password }
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end("Method Not Allowed");
  }

  const { email, password } = req.body || {};
  const identifier = String(email || "").trim();
  if (!identifier || !password) {
    return res.status(400).json({ success: false, message: "請輸入帳號與密碼" });
  }

  try {
    const token = await loginMedusaAdmin(identifier, password);
    const user = await verifyMedusaAdminToken(token);

    if (!user) {
      return res.status(403).json({
        success: false,
        message: "此帳號無 Medusa 管理員權限",
      });
    }

    return res.status(200).json({
      success: true,
      token,
      user,
    });
  } catch (err) {
    console.error("[medusa-login]", err.message);
    return res.status(401).json({
      success: false,
      message:
        err.message ||
        "登入失敗。請確認帳號為 Medusa 管理員的 email 欄位，且密碼與 Medusa 後台相同",
    });
  }
}
