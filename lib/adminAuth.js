import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../pages/api/auth/[...nextauth]";

const supabaseAdmin =
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        { auth: { autoRefreshToken: false, persistSession: false } },
      )
    : null;

/** 管理者 Email 白名單（僅伺服器端，逗號分隔） */
export function getAdminEmailAllowlist() {
  const raw =
    process.env.PRODUCT_ADMIN_EMAILS ||
    process.env.ADMIN_EMAIL ||
    "";
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email) {
  if (!email) return false;
  const normalized = String(email).trim().toLowerCase();
  return getAdminEmailAllowlist().includes(normalized);
}

/**
 * 解析目前請求是否為管理者（Supabase JWT 或 NextAuth session）
 * 絕不依賴前端傳入的 isAdmin 旗標
 */
export async function resolveAdminUser(req, res) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();

  if (token && supabaseAdmin) {
    const {
      data: { user },
      error,
    } = await supabaseAdmin.auth.getUser(token);
    if (!error && user?.email) {
      if (
        isAdminEmail(user.email) ||
        user.user_metadata?.role === "admin"
      ) {
        return {
          email: user.email.toLowerCase(),
          userId: user.id,
          source: "supabase",
        };
      }
    }
  }

  const session = await getServerSession(req, res, authOptions);
  const sessionEmail =
    session?.user?.email ||
    (session?.user?.id ? `${session.user.id}@line-login.com` : null);

  if (sessionEmail && isAdminEmail(sessionEmail)) {
    return {
      email: sessionEmail.toLowerCase(),
      userId: session.user.id || null,
      source: "nextauth",
    };
  }

  return null;
}

/** 管理者專用 API：未通過則回 403 並回傳 null */
export async function requireAdmin(req, res) {
  const admin = await resolveAdminUser(req, res);
  if (!admin) {
    res.status(403).json({ error: "需要管理者權限" });
    return null;
  }
  return admin;
}
