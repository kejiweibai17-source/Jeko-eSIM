import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import PartnerAdminLayout, {
  StatCard,
  StatusBanner,
} from "@/components/partner/PartnerAdminLayout";
import { usePartnerSession, fetchPartnerStats, SITE_URL } from "@/lib/partnerAuth";
import {
  ArrowTopRightOnSquareIcon,
  ShoppingBagIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

function formatNTD(n) {
  return `NT$ ${Math.round(Number(n) || 0).toLocaleString()}`;
}

export default function PartnerDashboard() {
  const router = useRouter();
  const { partner, store } = usePartnerSession();
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (!partner) return;
    setStatsLoading(true);
    fetchPartnerStats(partner.id, store?.id).then((s) => {
      setStats(s);
      setStatsLoading(false);
    });
  }, [partner, store]);

  const storeUrl = store ? `${SITE_URL}/p/${store.domain}` : null;

  return (
    <PartnerAdminLayout title="儀表板">
      {/* 頁面標題列 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-slate-800">儀表板</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {store?.store_name || partner?.name} · 合作夥伴後台
          </p>
        </div>
        {storeUrl && (
          <a
            href={storeUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 bg-[#1a3a6b] text-white text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-[#1344b5] transition shadow-sm"
          >
            預覽我的賣場 <ArrowTopRightOnSquareIcon className="w-4 h-4" />
          </a>
        )}
      </div>

      {/* 狀態橫幅 */}
      <StatusBanner
        title={statsLoading ? "載入中..." : stats?.orderCount > 0 ? "營運良好" : "準備就緒，開始推廣！"}
        message={
          statsLoading
            ? "正在讀取您的分潤數據..."
            : stats?.orderCount > 0
              ? `您已成功推廣 ${stats.orderCount} 筆訂單，累計分潤 ${formatNTD(stats.totalProfit)}。`
              : "您的專屬賣場已開通，前往「選品管理」加入 eSIM 方案後即可開始推廣。"
        }
      />

      {/* 統計卡片 — 參考 DOBERMAN 數字卡片 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          accent
          label="累計分潤"
          value={statsLoading ? "..." : formatNTD(stats?.totalProfit)}
          sub="含待結算與已結算"
        />
        <StatCard
          label="推廣訂單數"
          value={statsLoading ? "..." : stats?.orderCount ?? 0}
          sub="已完成 + 待付款"
          onClick={() => router.push("/partner/orders")}
        />
        <StatCard
          label="店鋪營收"
          value={statsLoading ? "..." : formatNTD(stats?.totalRevenue)}
          sub="客戶付款總額"
        />
        <StatCard
          label="已上架商品"
          value={statsLoading ? "..." : stats?.productCount ?? 0}
          sub="可在賣場銷售"
          onClick={() => router.push("/partner/products")}
        />
      </div>

      {/* 快捷操作 + 最近訂單 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 快捷操作 */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h2 className="font-bold text-slate-800 mb-4 text-sm">快速操作</h2>
          <div className="flex flex-col gap-2">
            {[
              {
                href: "/partner/catalog",
                icon: PlusIcon,
                label: "加入 eSIM 商品",
                desc: "從商品池選品上架",
                color: "bg-blue-50 text-blue-700 hover:bg-blue-100",
              },
              {
                href: "/partner/products",
                icon: ShoppingBagIcon,
                label: "管理商品定價",
                desc: "設定各方案售價",
                color: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
              },
              {
                href: "/partner/settings",
                icon: ArrowTopRightOnSquareIcon,
                label: "商店品牌設定",
                desc: "修改店名與描述",
                color: "bg-purple-50 text-purple-700 hover:bg-purple-100",
              },
            ].map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className={`flex items-center gap-3 p-3 rounded-xl transition ${action.color}`}
              >
                <action.icon className="w-5 h-5 shrink-0" />
                <div>
                  <p className="text-sm font-bold">{action.label}</p>
                  <p className="text-xs opacity-70">{action.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* 最近訂單 */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-slate-800 text-sm">最近推廣訂單</h2>
            <Link href="/partner/orders" className="text-xs text-[#1a56db] font-bold hover:underline">
              查看全部 →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                <tr>
                  <th className="px-5 py-3 text-left font-bold">訂單 / 日期</th>
                  <th className="px-5 py-3 text-left font-bold">金額</th>
                  <th className="px-5 py-3 text-left font-bold">我的分潤</th>
                  <th className="px-5 py-3 text-left font-bold">狀態</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {statsLoading ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-slate-400 text-sm">
                      載入中...
                    </td>
                  </tr>
                ) : (stats?.orders || []).slice(0, 5).length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-10 text-slate-400 text-sm">
                      尚無推廣訂單，分享您的賣場連結開始賺取分潤！
                    </td>
                  </tr>
                ) : (
                  (stats?.orders || []).slice(0, 5).map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/50">
                      <td className="px-5 py-3">
                        <p className="font-mono font-bold text-slate-700 text-xs">
                          {String(order.id).substring(0, 8)}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {new Date(order.created_at).toLocaleDateString("zh-TW")}
                        </p>
                      </td>
                      <td className="px-5 py-3 font-bold text-slate-800">
                        {formatNTD(order.total_amount)}
                      </td>
                      <td className="px-5 py-3 font-bold text-emerald-600">
                        +{formatNTD(order.partner_profit)}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            order.status === "completed"
                              ? "bg-emerald-100 text-emerald-700"
                              : order.status === "pending"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {order.status === "completed"
                            ? "已完成"
                            : order.status === "pending"
                              ? "待付款"
                              : order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 賣場連結分享 */}
      {storeUrl && (
        <div className="mt-6 bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase mb-1">我的專屬賣場連結</p>
            <p className="font-mono text-sm text-[#1a56db] font-bold">{storeUrl}</p>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(storeUrl);
              alert("連結已複製！");
            }}
            className="bg-[#1a3a6b] text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-[#1344b5] transition shrink-0"
          >
            複製連結
          </button>
        </div>
      )}
    </PartnerAdminLayout>
  );
}
