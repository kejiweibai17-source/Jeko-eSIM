"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "./Layout";
import ContactPageShell from "@/components/contact/ContactPageShell";
import GeneralInquiryTab from "@/components/contact/GeneralInquiryTab";
import PartnerApplicationTab from "@/components/contact/PartnerApplicationTab";
import RefundContactTab from "@/components/contact/RefundContactTab";

const TAB_MAP = {
  general: GeneralInquiryTab,
  partner: PartnerApplicationTab,
  refund: RefundContactTab,
};

const VALID_TABS = Object.keys(TAB_MAP);

export default function ContactPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    const q = router.query.tab;
    if (typeof q === "string" && VALID_TABS.includes(q)) {
      setActiveTab(q);
    }
  }, [router.query.tab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    router.replace({ pathname: "/contact", query: tab === "general" ? {} : { tab } }, undefined, {
      shallow: true,
    });
  };

  const TabContent = TAB_MAP[activeTab] || GeneralInquiryTab;

  return (
    <Layout
      seo={{
        title: "聯絡我們｜Jeko eSIM 客服、合作夥伴與退換款",
        description:
          "聯絡 Jeko eSIM：一般客服諮詢、合作夥伴申請、退換款售後聯繫。1～3 個工作天內回覆。",
      }}
    >
      <ContactPageShell activeTab={activeTab} onTabChange={handleTabChange}>
        <TabContent />
      </ContactPageShell>
    </Layout>
  );
}
