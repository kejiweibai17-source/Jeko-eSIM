const TOKEN_KEY = "boss_medusa_token";
const EMAIL_KEY = "boss_admin_email";

export function getBossToken() {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(TOKEN_KEY);
}

export function setBossSession(token, email) {
  sessionStorage.setItem(TOKEN_KEY, token);
  if (email) sessionStorage.setItem(EMAIL_KEY, email);
}

export function clearBossSession() {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(EMAIL_KEY);
}

export function getBossEmail() {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(EMAIL_KEY);
}

export async function bossFetch(url, options = {}) {
  const token = getBossToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (res.status === 401) {
    clearBossSession();
    const err = new Error("登入已過期，請重新登入");
    err.code = "UNAUTHORIZED";
    throw err;
  }

  if (!res.ok) {
    throw new Error(data.message || data.error || "請求失敗");
  }

  return data;
}
