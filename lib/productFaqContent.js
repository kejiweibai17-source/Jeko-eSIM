/** Medusa metadata：依電信商儲存常見問題 HTML */

export const FAQ_CONTENT_METADATA_KEY = "faq_content_by_carrier";

export function parseFaqContentByCarrier(raw) {
  if (!raw) return {};
  let data = raw;
  if (typeof raw === "string") {
    try {
      data = JSON.parse(raw);
    } catch {
      return {};
    }
  }
  if (!data || typeof data !== "object" || Array.isArray(data)) return {};

  const out = {};
  for (const [carrier, html] of Object.entries(data)) {
    const content = String(html || "").trim();
    if (content) out[carrier] = content;
  }
  return out;
}

function findCarrierEntry(map, carrierName) {
  if (!map || !carrierName || carrierName === "default") return null;
  const carrier = String(carrierName).trim();
  if (map[carrier]) return map[carrier];
  const key = Object.keys(map).find(
    (k) => k.trim().toLowerCase() === carrier.toLowerCase(),
  );
  return key ? map[key] : null;
}

export function resolveFaqContent(product, carrierName) {
  const fromMeta = parseFaqContentByCarrier(product?.faq_content_by_carrier);

  if (fromMeta && Object.keys(fromMeta).length > 0) {
    const matched = findCarrierEntry(fromMeta, carrierName);
    if (matched) return matched;
    if (fromMeta.default) return fromMeta.default;
    if (fromMeta._default) return fromMeta._default;
  }

  return product?.faq_content || "";
}
