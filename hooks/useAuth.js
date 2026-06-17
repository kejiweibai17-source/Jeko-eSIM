"use client";

import { useSession } from "next-auth/react";
import { useUser } from "@/components/context/UserContext";

/**
 * 雙引擎登入狀態：Supabase + NextAuth（LINE）
 * Navbar 與推播區塊共用，避免 LINE 登入仍被當訪客
 */
export function useAuth() {
  const { user, token, isHydrated, loading } = useUser();
  const { data: session, status: nextAuthStatus } = useSession();

  const nextAuthLoggedIn = nextAuthStatus === "authenticated";
  const supabaseLoggedIn = !!(user || token);
  const authReady = isHydrated && nextAuthStatus !== "loading";
  const isLoggedIn = nextAuthLoggedIn || supabaseLoggedIn;
  const isGuest = authReady && !isLoggedIn;

  return {
    user,
    token,
    session,
    isHydrated,
    loading,
    authReady,
    isLoggedIn,
    isGuest,
    isMember: isLoggedIn,
    nextAuthStatus,
  };
}
