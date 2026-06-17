import { createClient } from "@supabase/supabase-js";
import { extractEsimsFromOrders } from "./esimOrderExtract";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

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

/** LINE 登入會員的 Supabase email 格式 */
export function lineUserIdToEmail(lineUserId) {
  return `${String(lineUserId).trim()}@line-login.com`.toLowerCase();
}

export async function fetchEsimsByLineUserId(lineUserId) {
  if (!lineUserId) return [];
  const email = lineUserIdToEmail(lineUserId);
  return fetchMemberEsims(email);
}
