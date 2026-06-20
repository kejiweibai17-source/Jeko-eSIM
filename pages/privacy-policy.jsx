import { useEffect } from "react";
import { useRouter } from "next/router";

/** 舊路徑 /privacy-policy → /privacy */
export default function PrivacyPolicyRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/privacy");
  }, [router]);
  return null;
}
