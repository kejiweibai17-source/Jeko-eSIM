import { useEffect } from "react";
import { useRouter } from "next/router";

/**
 * 若 Supabase 重設信被導到首頁（Redirect URL 未白名單），
 * 將 recovery token 轉送到夥伴重設密碼頁。
 */
export default function PartnerRecoveryRedirect() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const path = window.location.pathname.replace(/\/$/, "");
    if (path.endsWith("/partner/reset-password")) return;

    const hash = window.location.hash || "";
    const search = window.location.search || "";
    const params = new URLSearchParams(search);
    const hashParams = new URLSearchParams(hash.replace(/^#/, ""));

    const isRecovery =
      params.get("type") === "recovery" ||
      params.get("token_hash") ||
      hashParams.get("type") === "recovery" ||
      (hashParams.get("access_token") && hashParams.get("type") === "recovery");

    if (!isRecovery) return;

    const target = `/partner/reset-password/${search}${hash}`;
    router.replace(target);
  }, [router]);

  return null;
}
