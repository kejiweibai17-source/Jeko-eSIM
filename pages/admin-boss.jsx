import { useState, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";
import BossAdminLayout, { StatCard } from "@/components/admin/BossAdminLayout";
import { StatusBanner } from "@/components/partner/PartnerAdminLayout";
import {
  bossFetch,
  clearBossSession,
  getBossToken,
  setBossSession,
} from "@/lib/bossAdminClient";

function parsePartnerType(description) {
  if (!description) return "—";
  const match = description.match(/【合作類型】(.*?)(?:\n|$)/);
  return match ? match[1].trim() : "—";
}

function parseDescriptionField(description, key) {
  if (!description) return null;
  const re = new RegExp(`【${key}】(.*?)(?:\\n|$)`);
  const match = description.match(re);
  return match ? match[1].trim() : null;
}

function PartnerDetailPanel({ partner, onClose }) {
  if (!partner) return null;

  const lines = (partner.description || "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[85vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-100 px-5 py-4 flex justify-between items-start">
          <div>
            <p className="text-xs font-bold text-[#1a56db] uppercase">申請詳情</p>
            <h3 className="text-lg font-black text-slate-900">{partner.name}</h3>
            <p className="text-sm text-slate-500">{partner.email}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl leading-none px-2"
          >
            ×
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">合作類型</p>
              <p className="font-bold text-slate-800">{parsePartnerType(partner.description)}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">專屬網址</p>
              <p className="font-mono text-[#1a56db] font-bold text-xs">/p/{partner.slug}</p>
            </div>
            {parseDescriptionField(partner.description, "聯絡人") && (
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">聯絡人</p>
                <p className="font-bold text-slate-800">
                  {parseDescriptionField(partner.description, "聯絡人")}
                </p>
              </div>
            )}
            {parseDescriptionField(partner.description, "聯絡電話") && (
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">電話</p>
                <p className="font-bold text-slate-800">
                  {parseDescriptionField(partner.description, "聯絡電話")}
                </p>
              </div>
            )}
            {parseDescriptionField(partner.description, "LINE ID") && (
              <div className="bg-slate-50 rounded-xl p-3 col-span-2">
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">LINE ID</p>
                <p className="font-bold text-slate-800">
                  {parseDescriptionField(partner.description, "LINE ID")}
                </p>
              </div>
            )}
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase mb-2">完整申請內容</p>
            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 text-xs text-slate-600 leading-relaxed space-y-1">
              {lines.length ? lines.map((line) => <p key={line}>{line}</p>) : "（無）"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BossLoginPage({ onLoginSuccess }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/medusa-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "登入失敗");
      }
      setBossSession(data.token, data.user?.email || form.email);
      onLoginSuccess(data.user);
    } catch (err) {
      setError(err.message || "登入失敗");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans">
      <Head>
        <title>總部管理登入 | JEKO eSIM</title>
      </Head>

      <div className="w-full lg:w-1/2 bg-[#1a56db] flex flex-col justify-center px-10 md:px-16 py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="relative z-10 max-w-md mx-auto w-full">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-200 text-sm mb-10 hover:text-white transition"
          >
            ← JEKO eSIM 官網
          </Link>

          <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-2">
            Admin Portal
          </p>
          <h1 className="text-3xl md:text-4xl font-black text-white leading-tight mb-3">
            總部
            <br />
            管理後台
          </h1>
          <p className="text-blue-100 text-sm leading-relaxed mb-4">
            請使用與 Medusa 後台<strong className="text-white">相同的一組帳密</strong>
            登入，審核合作夥伴申請、批准專屬賣場。
          </p>
          <div className="mb-8 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-[11px] text-blue-100 leading-relaxed">
            <p className="font-bold text-white mb-1">帳號不是信箱？</p>
            <p>
              Medusa 登入畫面可能只寫「帳號」，但 API 實際用的是資料庫裡管理員的{" "}
              <strong className="text-white">email 欄位</strong>。請填您在 Medusa
              後台登入時用的那個值（多數情況就是 Email）。可在 Medusa Admin →
              Settings → Users 查看。
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-xs font-bold text-blue-200 mb-1.5 uppercase tracking-wide">
                帳號（Medusa 管理員 Email）
              </label>
              <input
                required
                type="text"
                autoComplete="username"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="與 Medusa 後台登入相同"
                className="w-full bg-white/10 border border-white/30 rounded-xl px-4 py-3 text-white placeholder:text-blue-300 text-sm outline-none focus:bg-white/20 focus:border-white/60 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-blue-200 mb-1.5 uppercase tracking-wide">
                密碼（與 Medusa 後台相同）
              </label>
              <input
                required
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full bg-white/10 border border-white/30 rounded-xl px-4 py-3 text-white placeholder:text-blue-300 text-sm outline-none focus:bg-white/20 focus:border-white/60 transition"
              />
            </div>

            {error && (
              <p className="text-sm text-red-200 bg-red-500/20 border border-red-400/30 rounded-xl px-4 py-3">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#4ade80] hover:bg-[#22c55e] disabled:opacity-60 text-slate-900 font-black py-4 rounded-full text-base transition shadow-lg mt-2"
            >
              {loading ? "驗證中..." : "登入總部後台 →"}
            </button>
          </form>

          <p className="mt-8 text-blue-300 text-xs">
            此為內部管理入口，與{" "}
            <Link href="/partner/login" className="text-blue-100 hover:underline">
              合作夥伴後台
            </Link>{" "}
            不同。
          </p>
        </div>
      </div>

      <div
        className="hidden lg:flex lg:w-1/2 relative bg-cover bg-center items-end"
        style={{
          backgroundImage:
            "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 60%), url('https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&q=80')",
        }}
      >
        <div className="p-12 text-white">
          <p className="text-sm font-bold text-white/70 uppercase tracking-widest mb-2">
            JEKO eSIM HQ
          </p>
          <h2 className="text-3xl font-black leading-snug mb-3">
            夥伴申請
            <br />
            審核中心
          </h2>
          <p className="text-white/80 text-sm leading-relaxed max-w-sm">
            查看合作夥伴申請資料、批准專屬賣場代碼，通過後夥伴即可至 /partner/login 選品開店。
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AdminBossDashboard() {
  const [authChecking, setAuthChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionId, setActionId] = useState(null);
  const [detailPartner, setDetailPartner] = useState(null);
  const [toast, setToast] = useState("");

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const data = await bossFetch("/api/admin/partners");
      setPartners(data.partners || []);
    } catch (err) {
      if (err.code === "UNAUTHORIZED") {
        setIsAuthenticated(false);
        clearBossSession();
      }
      setToast(err.message);
    } finally {
      setLoading(false);
    }
  };

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
          fetchPartners();
        } else {
          clearBossSession();
        }
      })
      .finally(() => setAuthChecking(false));
  }, []);

  const updateStatus = async (partner, newStatus) => {
    const label = newStatus === "active" ? "批准" : "停用";
    if (!window.confirm(`確定要${label}「${partner.name}」嗎？`)) return;

    setActionId(partner.id);
    try {
      const data = await bossFetch("/api/admin/partners", {
        method: "PATCH",
        body: JSON.stringify({ id: partner.id, status: newStatus }),
      });

      if (data.warning) {
        setToast(data.warning);
      } else if (newStatus === "active") {
        const storeLine = data.storeUrl || `jeko-esim.com.tw/p/${partner.slug}`;
        if (data.emailSent) {
          setToast(`已批准！開通通知信已寄至 ${partner.email} · 賣場：${storeLine}`);
        } else if (data.emailError) {
          setToast(
            `已批准，但開通通知信寄送失敗：${data.emailError} · 賣場：${storeLine}`,
          );
        } else {
          setToast(`已批准！賣場：${storeLine}`);
        }
      } else {
        setToast(`已將 ${partner.name} 設為停用`);
      }
      fetchPartners();
    } catch (err) {
      if (err.code === "UNAUTHORIZED") setIsAuthenticated(false);
      setToast(err.message);
    } finally {
      setActionId(null);
    }
  };

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
          fetchPartners();
        }}
      />
    );
  }

  const pending = partners.filter((p) => p.status === "pending").length;
  const active = partners.filter((p) => p.status === "active").length;

  return (
    <BossAdminLayout title="夥伴審核">
      <StatusBanner
        title={`您好，${adminUser?.first_name || adminUser?.email?.split("@")[0] || "管理員"}`}
        message={`目前 ${pending} 筆待審核、${active} 家已開通夥伴`}
        status={pending > 0 ? "warn" : "good"}
      />

      {toast && (
        <div className="mb-4 text-sm bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-700 shadow-sm flex justify-between gap-3">
          <span>{toast}</span>
          <button type="button" className="text-slate-400 hover:text-slate-600" onClick={() => setToast("")}>
            ×
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="全部申請" value={partners.length} />
        <StatCard label="待審核" value={pending} accent={pending > 0} />
        <StatCard label="已開通" value={active} />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
          <h2 className="font-black text-slate-800">合作夥伴申請列表</h2>
          <button
            type="button"
            onClick={fetchPartners}
            disabled={loading}
            className="text-xs font-bold text-[#1a56db] hover:underline disabled:opacity-50"
          >
            {loading ? "更新中..." : "重新整理"}
          </button>
        </div>

        {loading && !partners.length ? (
          <div className="py-16 text-center text-slate-400 text-sm">讀取申請資料中...</div>
        ) : !partners.length ? (
          <div className="py-16 text-center text-slate-400 text-sm">尚無申請資料</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[760px]">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs border-b border-slate-100">
                  <th className="p-4 font-bold">夥伴 / Email</th>
                  <th className="p-4 font-bold">合作類型</th>
                  <th className="p-4 font-bold">Slug</th>
                  <th className="p-4 font-bold">狀態</th>
                  <th className="p-4 font-bold text-right">操作</th>
                </tr>
              </thead>
              <tbody>
                {partners.map((p) => (
                  <tr key={p.id} className="border-b border-slate-50 hover:bg-blue-50/30 transition">
                    <td className="p-4">
                      <div className="font-bold text-slate-900 text-sm">{p.name}</div>
                      <div className="text-xs text-slate-400">{p.email}</div>
                    </td>
                    <td className="p-4">
                      <span className="bg-blue-50 text-[#1a56db] px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                        {parsePartnerType(p.description)}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-mono text-xs text-[#1a56db] bg-slate-50 px-2 py-1 rounded">
                        /p/{p.slug}
                      </span>
                    </td>
                    <td className="p-4">
                      {p.status === "pending" && (
                        <span className="bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full text-xs font-bold">
                          待審核
                        </span>
                      )}
                      {p.status === "active" && (
                        <span className="bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-bold">
                          已開通
                        </span>
                      )}
                      {p.status === "rejected" && (
                        <span className="bg-red-100 text-red-700 px-2.5 py-1 rounded-full text-xs font-bold">
                          已停用
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() => setDetailPartner(p)}
                          className="text-xs font-bold text-slate-500 hover:text-[#1a56db] px-3 py-2 rounded-lg hover:bg-slate-50"
                        >
                          詳情
                        </button>
                        {p.status !== "active" && (
                          <button
                            type="button"
                            disabled={actionId === p.id}
                            onClick={() => updateStatus(p, "active")}
                            className="text-xs font-bold bg-[#1a56db] text-white px-3 py-2 rounded-lg hover:bg-[#1344b5] disabled:opacity-50"
                          >
                            {actionId === p.id ? "處理中..." : "批准"}
                          </button>
                        )}
                        {p.status !== "rejected" && (
                          <button
                            type="button"
                            disabled={actionId === p.id}
                            onClick={() => updateStatus(p, "rejected")}
                            className="text-xs font-bold bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 disabled:opacity-50"
                          >
                            停用
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <PartnerDetailPanel partner={detailPartner} onClose={() => setDetailPartner(null)} />
    </BossAdminLayout>
  );
}
