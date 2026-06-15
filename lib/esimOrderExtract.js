/**
 * 從 Supabase orders 抽出可監控的 eSIM（topup_id）
 */
export function parseQrcodeData(raw) {
  if (!raw) return [];
  let data = raw;
  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch {
      return [];
    }
  }
  if (data && typeof data === "object" && !Array.isArray(data)) {
    data = [data];
  }
  return Array.isArray(data) ? data : [];
}

export function extractEsimsFromOrders(orders = []) {
  const seen = new Set();
  const esims = [];

  for (const order of orders) {
    const qrcodeItems = parseQrcodeData(order.qrcode_data);
    for (const item of qrcodeItems) {
      const topupId = item.topupId || item.topup_id;
      if (!topupId || seen.has(String(topupId))) continue;
      seen.add(String(topupId));
      esims.push({
        topupId: String(topupId),
        productName: item.productName || item.name || "eSIM 方案",
        orderId: order.id,
        orderDate: order.created_at,
        iccid: item.iccid || item.ICCID || null,
        status: order.status,
      });
    }

    const lineItems = Array.isArray(order.items) ? order.items : [];
    for (const item of lineItems) {
      const topupId = item.topupId || item.topup_id || item.fulfilledTopupId;
      if (!topupId || seen.has(String(topupId))) continue;
      seen.add(String(topupId));
      esims.push({
        topupId: String(topupId),
        productName: item.name || item.productName || "eSIM 方案",
        orderId: order.id,
        orderDate: order.created_at,
        iccid: item.iccid || null,
        status: order.status,
      });
    }
  }

  return esims.sort(
    (a, b) => new Date(b.orderDate || 0) - new Date(a.orderDate || 0),
  );
}

export function userOwnsTopupId(esims, topupId) {
  return esims.some((e) => e.topupId === String(topupId));
}
