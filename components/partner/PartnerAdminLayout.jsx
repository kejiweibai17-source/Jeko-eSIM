import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import {
  ChartBarIcon,
  ShoppingBagIcon,
  ArchiveBoxIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  ArrowTopRightOnSquareIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { usePartnerSession, partnerLogout, SITE_URL } from "@/lib/partnerAuth";

const NAV_ITEMS = [
  { href: "/partner/dashboard", label: "儀表板", icon: ChartBarIcon },
  { href: "/partner/catalog", label: "選品管理", icon: ShoppingBagIcon },
  { href: "/partner/products", label: "我的商品", icon: ArchiveBoxIcon },
  { href: "/partner/orders", label: "訂單分潤", icon: ClipboardDocumentListIcon },
  { href: "/partner/settings", label: "商店設定", icon: Cog6ToothIcon },
];

export default function PartnerAdminLayout({ title, children }) {
  const router = useRouter();
  const { loading, user, partner, store } = usePartnerSession();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#eef2f7]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#1a3a6b] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500 font-medium">載入合作夥伴後台...</p>
        </div>
      </div>
    );
  }

  if (!user || !partner) return null;

  const storeUrl = store ? `${SITE_URL}/p/${store.domain}` : null;

  return (
    <div className="min-h-screen bg-[#eef2f7] flex flex-col font-sans">
      <Head>
        <title>{title ? `${title} | JEKO 夥伴後台` : "JEKO 夥伴後台"}</title>
      </Head>

      {/* 頂部 Header — 參考 DOBERMAN 深藍 bar */}
      <header className="bg-[#1a3a6b] text-white h-14 flex items-center justify-between px-6 shrink-0 shadow-md z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
            <span className="text-sm font-black text-blue-200">J</span>
          </div>
          <div>
            <span className="font-black text-sm tracking-wide">JEKO eSIM</span>
            <span className="text-blue-300 text-xs ml-2 font-medium">夥伴管理後台</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {storeUrl && (
            <a
              href={storeUrl}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-xs text-blue-200 hover:text-white transition font-medium"
            >
              預覽賣場 <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
            </a>
          )}
          <span className="text-xs text-blue-300 hidden md:block">{user.email}</span>
          <button
            onClick={() => partnerLogout(router)}
            className="flex items-center gap-1.5 text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition font-bold"
          >
            <ArrowRightOnRectangleIcon className="w-4 h-4" /> 登出
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* 左側 Sidebar — 參考 DOBERMAN 導覽 */}
        <aside className="w-52 bg-[#234876] text-white flex flex-col shrink-0 hidden md:flex">
          <div className="px-4 py-5 border-b border-white/10">
            <p className="text-[10px] text-blue-300 uppercase tracking-widest font-bold mb-1">
              店鋪
            </p>
            <p className="text-sm font-bold truncate">
              {store?.store_name || partner.name}
            </p>
            {store && (
              <p className="text-[10px] text-blue-400 mt-0.5 font-mono truncate">
                /p/{store.domain}
              </p>
            )}
          </div>

          <nav className="flex-1 py-3 flex flex-col gap-0.5 px-2">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const active = router.pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? "bg-[#1a3a6b] text-white shadow-sm"
                      : "text-blue-200 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/10">
            <Link
              href="/account"
              className="text-[11px] text-blue-400 hover:text-blue-200 transition block"
            >
              ← 切換至一般會員中心
            </Link>
          </div>
        </aside>

        {/* 主內容區 */}
        <main className="flex-1 overflow-y-auto">
          {/* 手機版底部導覽 */}
          <div className="md:hidden flex overflow-x-auto bg-[#234876] px-2 py-1 gap-1 shrink-0">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const active = router.pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                    active ? "bg-[#1a3a6b] text-white" : "text-blue-200"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </Link>
              );
            })}
          </div>

          <div className="p-5 md:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}

/** 可重用的統計卡片 */
export function StatCard({ label, value, sub, accent = false, onClick }) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      onClick={onClick}
      className={`rounded-xl p-5 flex flex-col gap-1 text-left transition hover:shadow-md ${
        accent
          ? "bg-gradient-to-br from-[#1a3a6b] to-[#2563b0] text-white shadow-lg"
          : "bg-white border border-slate-200 shadow-sm"
      } ${onClick ? "cursor-pointer" : ""}`}
    >
      <p className={`text-xs font-bold uppercase tracking-wide ${accent ? "text-blue-200" : "text-slate-500"}`}>
        {label}
      </p>
      <p className={`text-3xl font-black ${accent ? "text-white" : "text-slate-800"}`}>{value}</p>
      {sub && (
        <p className={`text-xs mt-1 ${accent ? "text-blue-200" : "text-slate-400"}`}>{sub}</p>
      )}
    </Tag>
  );
}

/** 狀態橫幅 — 參考 DOBERMAN Good 橫幅 */
export function StatusBanner({ title, message, status = "good" }) {
  const colors = {
    good: "bg-[#1a56db] border-[#1344b5]",
    warn: "bg-amber-500 border-amber-600",
    info: "bg-slate-600 border-slate-700",
  };
  return (
    <div className={`${colors[status]} text-white rounded-xl p-5 flex items-center gap-4 mb-6 shadow-md`}>
      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl shrink-0">
        {status === "good" ? "✓" : "ℹ"}
      </div>
      <div>
        <p className="font-black text-lg">{title}</p>
        <p className="text-sm text-blue-100 mt-0.5">{message}</p>
      </div>
    </div>
  );
}
