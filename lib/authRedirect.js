/** 登入後安全導回路徑（僅允許站內相對路徑） */
export function sanitizeRedirect(path, fallback = "/account") {
  if (!path || typeof path !== "string") return fallback;
  const trimmed = path.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) return fallback;
  if (trimmed.startsWith("/login")) return fallback;
  return trimmed;
}

/** 帶 redirect 的登入頁 URL */
export function buildLoginUrl(redirectPath, fallback = "/account") {
  const safe = sanitizeRedirect(redirectPath, fallback);
  if (safe === fallback && (!redirectPath || redirectPath === "/account")) {
    return "/login";
  }
  return `/login?redirect=${encodeURIComponent(safe)}`;
}
