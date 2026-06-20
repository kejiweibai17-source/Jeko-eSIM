import {
  getAuthUserFromBearer,
  getSupabaseAdmin,
  verifyPartnerAccessForUser,
} from "../../../lib/partnerServer";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end("Method Not Allowed");
  }

  if (!getSupabaseAdmin()) {
    return res.status(500).json({
      ok: false,
      message: "伺服器設定不完整",
    });
  }

  const user = await getAuthUserFromBearer(req);
  if (!user) {
    return res.status(401).json({
      ok: false,
      code: "UNAUTHORIZED",
      message: "請先登入",
    });
  }

  const result = await verifyPartnerAccessForUser(user);
  return res.status(result.ok ? 200 : 403).json(result);
}
