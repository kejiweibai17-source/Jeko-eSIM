/** 追蹤 Chrome PWA 安裝狀態（不呼叫 preventDefault，保留網址列安裝圖示） */

let installAvailable = false;
const listeners = new Set();

export function isPwaInstallAvailable() {
  return installAvailable;
}

export function subscribeInstallPrompt(listener) {
  listeners.add(listener);
  listener(installAvailable);
  return () => listeners.delete(listener);
}

export function initInstallPromptCapture() {
  if (typeof window === "undefined" || window.__pwaInstallPromptInit) return;
  window.__pwaInstallPromptInit = true;

  if (window.__pwaInstallAvailable) {
    installAvailable = true;
    listeners.forEach((fn) => fn(true));
  }

  window.addEventListener("beforeinstallprompt", () => {
    // 不呼叫 preventDefault → Chrome 會自動顯示網址列「安裝」圖示
    installAvailable = true;
    window.__pwaInstallAvailable = true;
    listeners.forEach((fn) => fn(true));
  });

  window.addEventListener("pwa-install-available", () => {
    installAvailable = true;
    listeners.forEach((fn) => fn(true));
  });

  window.addEventListener("appinstalled", () => {
    installAvailable = false;
    window.__pwaInstallAvailable = false;
    listeners.forEach((fn) => fn(false));
  });
}

/** 自訂按鈕無法取代 Chrome 原生安裝 UI（未 preventDefault 時） */
export async function promptInstall() {
  return { outcome: "unavailable" };
}
