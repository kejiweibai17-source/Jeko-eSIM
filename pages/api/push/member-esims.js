import { resolveMemberEmail, fetchMemberEsims } from "./_memberAuth";

/**
 * GET /api/push/member-esims
 * 已登入會員：列出本站訂單中可監控的 eSIM（topup_id）
 */
export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end("Method Not Allowed");
  }

  const member = await resolveMemberEmail(req, res);
  if (!member?.email) {
    return res.status(401).json({ error: "請先登入會員" });
  }

  try {
    const esims = await fetchMemberEsims(member.email);
    return res.status(200).json({
      success: true,
      email: member.email,
      esims,
      count: esims.length,
    });
  } catch (e) {
    return res.status(500).json({ error: "讀取訂單失敗", detail: e.message });
  }
}
