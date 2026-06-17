import { withTimeout } from "./pushDebug";

/** 從目前瀏覽器的 Push 訂閱取得 endpoint（不無限期等待 SW ready） */
export async function getPushEndpoint() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return null;
  }
  try {
    const reg = await withTimeout(
      (async () => {
        const existing = await navigator.serviceWorker.getRegistration("/");
        if (existing?.active) return existing;
        if (existing?.installing || existing?.waiting) {
          return navigator.serviceWorker.ready;
        }
        return null;
      })(),
      8000,
      "getPushEndpoint",
    );
    if (!reg?.active) return null;
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
