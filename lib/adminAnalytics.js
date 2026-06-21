import { isSettledOrderStatus, orderItemSummary } from "@/lib/refundPolicy";

function dayKey(d) {
  const x = new Date(d);
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`;
}

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function buildAdminAnalytics(orders = [], days = 30) {
  const all = orders || [];
  const settled = all.filter((o) => isSettledOrderStatus(o.status));
  const completed = all.filter((o) => String(o.status).toLowerCase() === "completed");
  const refunded = all.filter((o) => String(o.status).toLowerCase() === "refunded");
  const pending = all.filter((o) => String(o.status).toLowerCase() === "pending");

  const now = startOfDay(new Date());
  const todayKey = dayKey(now);
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = dayKey(yesterday);

  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const sumAmount = (list) =>
    list.reduce((s, o) => s + (Number(o.total_amount) || 0), 0);

  const todayOrders = settled.filter((o) => dayKey(o.created_at) === todayKey);
  const yesterdayOrders = settled.filter((o) => dayKey(o.created_at) === yesterdayKey);
  const weekOrders = settled.filter((o) => new Date(o.created_at) >= weekAgo);

  const todayRevenue = sumAmount(todayOrders);
  const yesterdayRevenue = sumAmount(yesterdayOrders);
  const weekRevenue = sumAmount(weekOrders);

  const pctChange = (curr, prev) => {
    if (!prev) return curr > 0 ? 100 : 0;
    return Math.round(((curr - prev) / prev) * 1000) / 10;
  };

  const labels = [];
  const revenueSeries = [];
  const orderSeries = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const k = dayKey(d);
    labels.push(`${d.getMonth() + 1}/${d.getDate()}`);
    const dayList = settled.filter((o) => dayKey(o.created_at) === k);
    revenueSeries.push(sumAmount(dayList));
    orderSeries.push(dayList.length);
  }

  const storeMap = {};
  settled.forEach((o) => {
    const name = o.stores?.store_name || "官方主站";
    if (!storeMap[name]) storeMap[name] = { revenue: 0, orders: 0, profit: 0 };
    storeMap[name].revenue += Number(o.total_amount) || 0;
    storeMap[name].orders += 1;
    storeMap[name].profit += Number(o.partner_profit) || 0;
  });
  const storeShare = Object.entries(storeMap)
    .map(([name, v]) => ({ name, ...v }))
    .sort((a, b) => b.revenue - a.revenue);

  const productMap = {};
  completed.forEach((o) => {
    const name = orderItemSummary(o);
    if (!productMap[name]) productMap[name] = { qty: 0, revenue: 0 };
    productMap[name].qty += 1;
    productMap[name].revenue += Number(o.total_amount) || 0;
  });
  const productRank = Object.entries(productMap)
    .map(([name, v]) => ({ name, ...v }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 8);

  const refundAmount = refunded.reduce(
    (s, o) => s + (Number(o.total_amount) || 0),
    0,
  );

  return {
    kpis: {
      revenue: sumAmount(settled),
      todayRevenue,
      revenueVsYesterday: pctChange(todayRevenue, yesterdayRevenue),
      orderCount: settled.length,
      todayOrders: todayOrders.length,
      ordersVsYesterday: pctChange(todayOrders.length, yesterdayOrders.length),
      completedCount: completed.length,
      pendingCount: pending.length,
      refundCount: refunded.length,
      refundAmount,
      weekRevenue,
      partnerProfit: settled.reduce((s, o) => s + (Number(o.partner_profit) || 0), 0),
    },
    lineChart: { labels, revenueSeries, orderSeries },
    storeShare,
    productRank,
    recentActivity: all.slice(0, 12).map((o) => ({
      id: o.id,
      label: `訂單 #${o.id} · ${orderItemSummary(o)}`,
      status: o.status,
      amount: o.total_amount,
      at: o.created_at,
    })),
  };
}
