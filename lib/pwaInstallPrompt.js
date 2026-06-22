/** 全域保存 Chrome beforeinstallprompt，避免元件 mount 較晚而錯過事件 */

let deferredPrompt = null;
const listeners = new Set();

export function getDeferredInstallPrompt() {
  return deferredPrompt;
}

export function subscribeInstallPrompt(listener) {
  listeners.add(listener);
  if (deferredPrompt) listener(deferredPrompt);
  return () => listeners.delete(listener);
}

export function initInstallPromptCapture() {
  if (typeof window === "undefined" || window.__pwaInstallPromptInit) return;
  window.__pwaInstallPromptInit = true;

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    listeners.forEach((fn) => fn(e));
  });

  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    listeners.forEach((fn) => fn(null));
  });
}

export async function promptInstall() {
  if (!deferredPrompt) return { outcome: "dismissed" };
  deferredPrompt.prompt();
  const choice = await deferredPrompt.userChoice;
  deferredPrompt = null;
  listeners.forEach((fn) => fn(null));
  return choice;
}
