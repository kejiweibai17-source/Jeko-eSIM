import { useState, useEffect } from "react";
import Head from "next/head";
import BossAdminLayout from "@/components/admin/BossAdminLayout";
import { StatusBanner } from "@/components/partner/PartnerAdminLayout";
import {
  bossFetch,
  clearBossSession,
  getBossToken,
} from "@/lib/bossAdminClient";
import AdminRefundsPanel from "@/components/admin/AdminRefundsPanel";
import AccountBossPartnersPanel from "@/components/account/AccountBossPartnersPanel";
import BossInlineLogin from "@/components/account/BossInlineLogin";

function BossLoginPage({ onLoginSuccess }) {
  return (
    <div className="min-h-screen flex font-sans bg-[#eef1f6] items-center justify-center p-6">
      <Head>
        <title>總部管理登入 | JEKO eSIM</title>
      </Head>
      <div className="w-full max-w-md">
        <BossInlineLogin onLoginSuccess={onLoginSuccess} />
      </div>
    </div>
  );
}

export default function AdminBossDashboard() {
  const [authChecking, setAuthChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [bossTab, setBossTab] = useState("partners");
  const [partnerStats, setPartnerStats] = useState({ total: 0, pending: 0, active: 0 });

  useEffect(() => {
    const token = getBossToken();
    if (!token) {
      setAuthChecking(false);
      return;
    }
    fetch("/api/admin/session", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.authenticated) {
          setIsAuthenticated(true);
          setAdminUser(data.user);
        } else {
          clearBossSession();
        }
      })
      .finally(() => setAuthChecking(false));
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    bossFetch("/api/admin/partners")
      .then((data) => {
        const list = data.partners || [];
        setPartnerStats({
          total: list.length,
          pending: list.filter((p) => p.status === "pending").length,
          active: list.filter((p) => p.status === "active").length,
        });
      })
      .catch(() => {});
  }, [isAuthenticated, bossTab]);

  if (authChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a56db]">
        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <BossLoginPage
        onLoginSuccess={(user) => {
          setAdminUser(user);
          setIsAuthenticated(true);
        }}
      />
    );
  }

  const { pending, active } = partnerStats;

  return (
    <BossAdminLayout title={bossTab === "partners" ? "夥伴審核" : "退款審核"}>
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          type="button"
          onClick={() => setBossTab("partners")}
          className={`px-4 py-2 rounded-sm text-sm font-bold transition ${
            bossTab === "partners"
              ? "bg-[#1a56db] text-white"
              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          夥伴審核
        </button>
        <button
          type="button"
          onClick={() => setBossTab("refunds")}
          className={`px-4 py-2 rounded-sm text-sm font-bold transition ${
            bossTab === "refunds"
              ? "bg-[#1a56db] text-white"
              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          退款審核
        </button>
      </div>

      {bossTab === "refunds" ? (
        <AdminRefundsPanel />
      ) : (
        <>
          <StatusBanner
            title={`您好，${adminUser?.first_name || adminUser?.email?.split("@")[0] || "管理員"}`}
            message={`目前 ${pending} 筆待審核、${active} 家已開通夥伴`}
            status={pending > 0 ? "warn" : "good"}
          />

          <AccountBossPartnersPanel />
        </>
      )}
    </BossAdminLayout>
  );
}
