/** Medusa metadata.key_features_by_carrier 解析（相容舊版 string[] 與新版物件） */

export function normalizeCarrierFeatureEntry(value) {
  if (Array.isArray(value)) {
    return {
      bullets: value.map(String).filter(Boolean),
      actualExperience: "",
    };
  }

  if (value && typeof value === "object") {
    const obj = value;
    const bullets = Array.isArray(obj.bullets)
      ? obj.bullets.map(String).filter(Boolean)
      : [];
    const actualExperience = String(
      obj.actual_experience ?? obj.actualExperience ?? "",
    ).trim();
    return { bullets, actualExperience };
  }

  return { bullets: [], actualExperience: "" };
}

export function parseKeyFeaturesByCarrier(raw) {
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
      normalizeCarrierFeatureEntry(value),
    ]),
  );
}

export function findCarrierFeatureEntry(fromMeta, carrierName) {
  if (!fromMeta || !carrierName || carrierName === "default") return null;
  const carrier = String(carrierName).trim();
  if (fromMeta[carrier]) return fromMeta[carrier];
  const key = Object.keys(fromMeta).find(
    (k) => k.trim().toLowerCase() === carrier.toLowerCase(),
  );
  return key ? fromMeta[key] : null;
}

export function resolveIntroBullets(product, carrierName) {
  const fromMeta = parseKeyFeaturesByCarrier(product?.key_features_by_carrier);
  if (!fromMeta || !Object.keys(fromMeta).length) return [];
  const matched = findCarrierFeatureEntry(fromMeta, carrierName);
  if (matched?.bullets?.length) return matched.bullets;
  if (fromMeta.default?.bullets?.length) return fromMeta.default.bullets;
  return [];
}

export function resolveActualExperience(product, carrierName) {
  const fromMeta = parseKeyFeaturesByCarrier(product?.key_features_by_carrier);
  if (!fromMeta || !Object.keys(fromMeta).length) return "";
  const matched = findCarrierFeatureEntry(fromMeta, carrierName);
  if (matched?.actualExperience) return matched.actualExperience;
  return fromMeta.default?.actualExperience || "";
}

export function serializeKeyFeaturesByCarrier(map) {
  const out = {};
  Object.entries(map).forEach(([carrier, entry]) => {
    const bullets = (entry.bullets || [])
      .map((b) => b.replace(/^\s+|\s+$/g, ""))
      .filter(Boolean);
    const actualExperience = String(entry.actualExperience || "").trim();
    if (bullets.length || actualExperience) {
      out[carrier] = {
        bullets,
        actual_experience: actualExperience,
      };
    }
  });
  return out;
}
