/** Medusa metadata.carrier_specs_by_carrier — 商品頁方案規格 icon 區塊（依電信商） */

const SPEC_KEYS = ["ip_type", "route_type", "network", "speed_rule", "apps"];

export function normalizeCarrierSpecEntry(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {
      ip_type: "",
      route_type: "",
      network: "",
      speed_rule: "",
      apps: "",
    };
  }

  const obj = value;
  return {
    ip_type: String(obj.ip_type ?? "").trim(),
    route_type: String(obj.route_type ?? "").trim(),
    network: String(obj.network ?? "").trim(),
    speed_rule: String(obj.speed_rule ?? "").trim(),
    apps: String(obj.apps ?? "").trim(),
  };
}

export function parseCarrierSpecsByCarrier(raw) {
  if (!raw) return null;

  let parsed = raw;
  if (typeof raw === "string") {
    try {
      parsed = JSON.parse(raw);
    } catch {
      return null;
    }
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return null;
  }

  return Object.fromEntries(
    Object.entries(parsed).map(([carrier, value]) => [
      carrier,
      normalizeCarrierSpecEntry(value),
    ]),
  );
}

export function findCarrierSpecEntry(fromMeta, carrierName) {
  if (!fromMeta || !carrierName || carrierName === "default") return null;
  const carrier = String(carrierName).trim();
  if (fromMeta[carrier]) return fromMeta[carrier];
  const key = Object.keys(fromMeta).find(
    (k) => k.trim().toLowerCase() === carrier.toLowerCase(),
  );
  return key ? fromMeta[key] : null;
}

export function resolveCarrierSpecs(product, carrierName) {
  const fromMeta = parseCarrierSpecsByCarrier(product?.carrier_specs_by_carrier);
  if (!fromMeta || !Object.keys(fromMeta).length) return null;

  const matched =
    findCarrierSpecEntry(fromMeta, carrierName) || fromMeta.default || null;
  if (!matched) return null;

  const normalized = normalizeCarrierSpecEntry(matched);
  const hasAny = SPEC_KEYS.some((key) => normalized[key]);
  return hasAny ? normalized : null;
}

export function buildCarrierSpecDisplayItems(specs) {
  if (!specs) return [];

  const items = [];
  if (specs.ip_type) {
    items.push({ key: "ip_type", icon: "public", text: specs.ip_type });
  }
  if (specs.route_type) {
    items.push({ key: "route_type", icon: "diamond", text: specs.route_type });
  }
  if (specs.network) {
    items.push({
      key: "network",
      icon: "signal_cellular_alt",
      text: specs.network,
    });
  }
  if (specs.speed_rule) {
    items.push({ key: "speed_rule", icon: "bolt", text: specs.speed_rule });
  }
  if (specs.apps) {
    items.push({
      key: "apps",
      icon: "check_circle",
      text: `支援： ${specs.apps}`,
      fullWidth: true,
      iconClass: "text-emerald-600",
    });
  }
  return items;
}

export function serializeCarrierSpecsByCarrier(map) {
  const out = {};
  Object.entries(map).forEach(([carrier, entry]) => {
    const normalized = normalizeCarrierSpecEntry(entry);
    const payload = {};
    SPEC_KEYS.forEach((key) => {
      if (normalized[key]) payload[key] = normalized[key];
    });
    if (Object.keys(payload).length) out[carrier] = payload;
  });
  return out;
}
