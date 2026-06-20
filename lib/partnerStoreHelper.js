import { supabase } from "./supabaseClient";
import { normalizePartnerEmail } from "./partnerUtils";

/**
 * 取得合作夥伴的 stores 記錄。
 * 流程：
 *  1. 先用 user_id 查詢（正常情況）
 *  2. 找不到時：用 email 比對 partners 表取得 slug → 查詢 stores.domain
 *  3. 找到後自動把 user_id 寫回 stores（首次登入自動綁定）
 */
export async function getOrLinkPartnerStore(userId, userEmail) {
  // Step 1: 先用 user_id 找
  const { data: storeByUserId } = await supabase
    .from("stores")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (storeByUserId) return storeByUserId;

  // Step 2: 用 email 找 partner → 取得 slug
  if (!userEmail) return null;

  const { data: partnerRows } = await supabase
    .from("partners")
    .select("id, slug")
    .ilike("email", normalizePartnerEmail(userEmail))
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!partnerRows) return null;

  const partner = partnerRows;

  const { data: storeBySlug } = await supabase
    .from("stores")
    .select("*")
    .eq("domain", partner.slug)
    .single();

  if (!storeBySlug) return null;

  // Step 3: 自動把 user_id 寫回（首次登入綁定）
  const { data: updatedStore } = await supabase
    .from("stores")
    .update({ user_id: userId })
    .eq("id", storeBySlug.id)
    .select()
    .single();

  return updatedStore || storeBySlug;
}
