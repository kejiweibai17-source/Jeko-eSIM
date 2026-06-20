import { useEffect } from "react";
import { useRouter } from "next/router";

export default function LegacyPartnerRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/partner/dashboard");
  }, [router]);
  return null;
}
