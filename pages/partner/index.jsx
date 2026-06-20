import { useEffect } from "react";
import { useRouter } from "next/router";

export default function PartnerIndex() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/partner/login");
  }, [router]);
  return null;
}
