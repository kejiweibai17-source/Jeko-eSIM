const MEDUSA_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
  process.env.MEDUSA_BACKEND_URL ||
  "http://localhost:9000";

export function getMedusaBackendUrl() {
  return MEDUSA_URL.replace(/\/$/, "");
}

/** Medusa v2 管理員登入 */
export async function loginMedusaAdmin(email, password) {
  const res = await fetch(`${getMedusaBackendUrl()}/auth/user/emailpass`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.trim(), password }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg =
      data.message ||
      data.error ||
      (typeof data === "string" ? data : null) ||
      "Email 或密碼錯誤";
    throw new Error(msg);
  }

  const token = data.token || data.access_token;
  if (!token) throw new Error("Medusa 未回傳有效 token");
  return token;
}

/** 驗證 JWT 是否為有效 Medusa 管理員 */
export async function verifyMedusaAdminToken(token) {
  if (!token) return null;

  const res = await fetch(`${getMedusaBackendUrl()}/admin/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) return null;

  const data = await res.json().catch(() => ({}));
  const user = data.user || data;
  if (!user?.email) return null;

  return {
    id: user.id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
  };
}

export async function requireMedusaAdminFromRequest(req) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (!token) return null;

  const user = await verifyMedusaAdminToken(token);
  if (!user) return null;

  return { token, user };
}
