import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "./supabaseClient";
import { getOrLinkPartnerStore } from "./partnerStoreHelper";

export const SITE_URL = "https://jeko-esim.com.tw";

/**
 * 合作夥伴後台專用 Auth Hook
 * 與一般會員 /account 完全分離，只允許 partners 表 active 用戶進入
 */
export function usePartnerSession({ redirect = true } = {}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [partner, setPartner] = useState(null);
  const [store, setStore] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();

        if (cancelled) return;

        if (!authUser) {
          if (redirect) router.replace("/partner/login");
          return;
        }

        const { data: partnerRow } = await supabase
          .from("partners")
          .select("id, name, slug, email, status")
          .eq("email", authUser.email)
          .single();

        if (!partnerRow || partnerRow.status !== "active") {
          if (redirect) {
            router.replace("/partner/login?error=not_partner");
          }
          return;
        }

        const storeRow = await getOrLinkPartnerStore(
          authUser.id,
          authUser.email,
        );

        if (cancelled) return;

        setUser(authUser);
        setPartner(partnerRow);
        setStore(storeRow);
      } catch (err) {
        console.error("[usePartnerSession]", err);
        if (!cancelled && redirect) {
          router.replace("/partner/login");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    init();
    return () => {
      cancelled = true;
    };
  }, [redirect, router]);

  return { loading, user, partner, store, setStore };
}

export async function fetchPartnerStats(partnerId, storeId) {
  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("partner_id", partnerId)
    .order("created_at", { ascending: false });

  const valid = (orders || []).filter(
    (o) => o.status === "completed" || o.status === "pending",
  );

  const totalProfit = valid.reduce(
    (sum, o) => sum + (Number(o.partner_profit) || 0),
    0,
  );
  const totalRevenue = valid.reduce(
    (sum, o) => sum + (Number(o.total_amount) || 0),
    0,
  );
  const totalCost = valid.reduce(
    (sum, o) => sum + (Number(o.b2b_cost) || 0),
    0,
  );

  let productCount = 0;
  if (storeId) {
    const { count } = await supabase
      .from("store_products")
      .select("*", { count: "exact", head: true })
      .eq("store_id", storeId);
    productCount = count || 0;
  }

  return {
    orders: orders || [],
    validOrders: valid,
    totalProfit,
    totalRevenue,
    totalCost,
    orderCount: valid.length,
    productCount,
  };
}

export async function partnerLogout(router) {
  await supabase.auth.signOut();
  router.push("/partner/login");
}
