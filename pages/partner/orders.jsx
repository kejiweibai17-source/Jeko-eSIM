import { useEffect, useState } from "react";
import PartnerAdminLayout, { StatCard } from "@/components/partner/PartnerAdminLayout";
import { usePartnerSession, fetchPartnerStats } from "@/lib/partnerAuth";

function formatNTD(n) {
  return `NT$ ${Math.round(Number(n) || 0).toLocaleString()}`;
}

function formatDate(d) {
  return new Date(d).toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

const STATUS_MAP = {
  completed: { label: "已完成", cls: "bg-emerald-100 text-emerald-700" },
  pending: { label: "待付款", cls: "bg-amber-100 text-amber-700" },
  cancelled: { label: "已取消", cls: "bg-slate-100 text-slate-500" },
  failed: { label: "失敗", cls: "bg-red-100 text-red-600" },
};

export default function PartnerOrdersPage() {
  const { partner, store } = usePartnerSession();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!partner) return;
    fetchPartnerStats(partner.id, store?.id).then((s) => {
      setStats(s);
      setLoading(false);
    });
  }, [partner, store]);

  const filtered = (stats?.orders || []).filter((o) => {
    if (filter === "all") return true;
    return o.status === filter;
  });

  return (
    <PartnerAdminLayout title="訂單分潤">
      <div className="mb-6">
        <h1 className="text-xl font-black text-slate-800">訂單分潤</h1>
        <p className="text-sm text-slate-500 mt-0.5">查看所有透過您賣場產生的訂單與分潤明細</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard
          accent
          label="累計分潤"
          value={loading ? "..." : formatNTD(stats?.totalProfit)}
          sub="所有有效訂單合計"
        />
        <StatCard
          label="有效訂單"
          value={loading ? "..." : stats?.orderCount ?? 0}
          sub="已完成 + 待付款"
        />
        <StatCard
          label="店鋪營收"
          value={loading ? "..." : formatNTD(stats?.totalRevenue)}
          sub="客戶付款總額"
        />
      </div>

      {/* 篩選列 */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {[
          { id: "all", label: "全部" },
          { id: "completed", label: "已完成" },
          { id: "pending", label: "待付款" },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
              filter === f.id
                ? "bg-[#1a3a6b] text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
              <tr>
                <th className="px-5 py-3 text-left font-bold">訂單編號 / 日期</th>
                <th className="px-5 py-3 text-left font-bold">客戶 Email</th>
                <th className="px-5 py-3 text-left font-bold">訂單金額</th>
                <th className="px-5 py-3 text-left font-bold">底價成本</th>
                <th className="px-5 py-3 text-left font-bold">我的分潤</th>
                <th className="px-5 py-3 text-left font-bold">狀態</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    載入中...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    目前沒有符合條件的訂單
                  </td>
                </tr>
              ) : (
                filtered.map((order) => {
                  const st = STATUS_MAP[order.status] || {
                    label: order.status,
                    cls: "bg-slate-100 text-slate-500",
                  };
                  return (
                    <tr key={order.id} className="hover:bg-slate-50/50">
                      <td className="px-5 py-4">
                        <p className="font-mono font-bold text-slate-700 text-xs">
                          {String(order.id).substring(0, 8).toUpperCase()}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {formatDate(order.created_at)}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-slate-600 text-xs">
                        {order.customer_email || "—"}
                      </td>
                      <td className="px-5 py-4 font-bold text-slate-800">
                        {formatNTD(order.total_amount)}
                      </td>
                      <td className="px-5 py-4 text-slate-500">
                        {formatNTD(order.b2b_cost)}
                      </td>
                      <td className="px-5 py-4 font-black text-emerald-600">
                        +{formatNTD(order.partner_profit)}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${st.cls}`}>
                          {st.label}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </PartnerAdminLayout>
  );
}
