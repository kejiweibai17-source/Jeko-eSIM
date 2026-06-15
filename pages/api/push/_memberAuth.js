import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { extractEsimsFromOrders } from "../../../lib/esimOrderExtract";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

/** 解析目前請求的使用者 Email（Supabase 或 LINE NextAuth） */
export async function resolveMemberEmail(req, res) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "").trim();

  if (token) {
    const { data: { user } } = await supabaseAdmin.auth.getUser(token);
    if (user?.email) {
      return { email: user.email.toLowerCase(), userId: user.id, source: "supabase" };
    }
  }

  const session = await getServerSession(req, res, authOptions);
  if (session?.user) {
    const email =
      session.user.email ||
      `${session.user.id || session.user.name}@line.jekoesim.com`;
    return { email: email.toLowerCase(), userId: session.user.id || null, source: "line" };
  }

  return null;
}

export async function fetchMemberEsims(email) {
  const { data: orders, error } = await supabaseAdmin
    .from("orders")
    .select("id, items, qrcode_data, status, created_at, customer_email")
    .eq("customer_email", email)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) throw error;
  return extractEsimsFromOrders(orders || []);
}
