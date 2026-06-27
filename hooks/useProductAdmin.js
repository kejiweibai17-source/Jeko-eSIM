"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useUser } from "@/components/context/UserContext";
import { isAdminEmail } from "@/lib/productAdminConfig";

/**
 * 商品頁內容編輯器 — 管理者狀態（與 /api/admin/verify 同步）
 */
export function useProductAdmin() {
  const { token, user } = useUser();
  const { data: session } = useSession();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminChecked, setAdminChecked] = useState(false);

  const optimisticAdmin = useMemo(() => {
    const email = user?.email || session?.user?.email;
    if (email && isAdminEmail(email)) return true;
    if (user?.user_metadata?.role === "admin") return true;
    if (user?.app_metadata?.role === "admin") return true;
    return false;
  }, [user, session?.user?.email]);

  const authHeaders = useMemo(() => {
    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
  }, [token]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/verify", {
          credentials: "include",
          headers: authHeaders,
        });
        const data = res.ok ? await res.json() : { isAdmin: false };
        if (!cancelled) setIsAdmin(!!data.isAdmin);
      } catch {
        if (!cancelled) setIsAdmin(optimisticAdmin);
      } finally {
        if (!cancelled) setAdminChecked(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [authHeaders, token, session?.user?.email, user?.email, optimisticAdmin]);

  return {
    isAdmin: adminChecked ? isAdmin : optimisticAdmin,
    adminChecked,
    authHeaders,
  };
}
