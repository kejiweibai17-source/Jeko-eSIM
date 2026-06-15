/** 從目前瀏覽器的 Push 訂閱取得 endpoint */
export async function getPushEndpoint() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return null;
  }
  try {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    return sub?.endpoint || null;
  } catch {
    return null;
  }
}

export function normalizeIccid(value) {
  return String(value || "").replace(/\s+/g, "").trim();
}

export function isValidIccid(value) {
  const iccid = normalizeIccid(value);
  return /^\d{18,22}$/.test(iccid);
}

export const ICCID_STORAGE_KEY = "jeko_esim_iccid";
