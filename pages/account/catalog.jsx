import { useEffect } from "react";
import { useRouter } from "next/router";

export default function LegacyCatalogRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/partner/catalog");
  }, [router]);
  return null;
}
