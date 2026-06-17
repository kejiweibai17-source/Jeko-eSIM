/** 推播用 Service Worker 路徑（dev 用輕量版，避免 Workbox precache 與 HMR 衝突） */
export function getServiceWorkerUrl() {
  if (process.env.NODE_ENV === "development") {
    return "/sw-push.js";
  }
  return "/sw.js";
}

export function isDevPushEnvironment() {
  return process.env.NODE_ENV === "development";
}
