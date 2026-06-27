/** Medusa metadata.hot_sale_telecoms — 推薦熱銷電信商 */

export function parseHotSaleTelecoms(raw) {
  if (!raw) return [];

  let parsed = raw;
  if (typeof raw === "string") {
    try {
      parsed = JSON.parse(raw);
    } catch {
      return [];
    }
  }

  if (!Array.isArray(parsed)) return [];
  return parsed.map(String).filter(Boolean);
}

export function isHotSaleTelecom(hotSaleList, carrierName) {
  if (!carrierName || !hotSaleList?.length) return false;
  const carrier = String(carrierName).trim();
  return hotSaleList.some(
    (item) => item.trim().toLowerCase() === carrier.toLowerCase(),
  );
}
