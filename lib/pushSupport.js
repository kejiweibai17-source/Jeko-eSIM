/** 是否以 PWA 獨立模式開啟（主畫面 / Dock） */
export function isStandalonePWA() {
  if (typeof window === "undefined") return false;
  return (
    window.navigator.standalone === true ||
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches
  );
}

/** 辨識瀏覽器環境 */
export function getBrowserContext() {
  if (typeof navigator === "undefined") {
    return { isIOS: false, isSafari: false, isMacDesktop: false, isStandalone: false };
  }

  const ua = navigator.userAgent;
  const isIOS =
    /iPhone|iPad|iPod/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isSafari =
    /Safari/.test(ua) && !/Chrome|CriOS|Chromium|Edg|OPR|Firefox|FxiOS/.test(ua);
  const isMacDesktop = /Macintosh/.test(ua) && navigator.maxTouchPoints <= 1;

  return {
    isIOS,
    isSafari,
    isMacDesktop,
    isStandalone: isStandalonePWA(),
  };
}

/**
 * 偵測 Web Push 是否可用
 * Safari 不會把 PushManager 掛在 window 上，需改查 registration.pushManager
 */
export async function detectPushSupport() {
  const ctx = getBrowserContext();

  if (!("serviceWorker" in navigator)) {
    return {
      supported: false,
      reason: "no-service-worker",
      title: "此瀏覽器不支援推播",
      hint: "請使用 Chrome、Edge，或 macOS Safari 16.4+",
    };
  }

  if (!("Notification" in window)) {
    return {
      supported: false,
      reason: "no-notification",
      title: "此瀏覽器不支援通知",
      hint: "請改用 Chrome 或 Edge",
    };
  }

  // iPhone / iPad 一般瀏覽器分頁：Apple 規定必須先加入主畫面（Safari / Chrome 皆同）
  if (ctx.isIOS && !ctx.isStandalone) {
    return {
      supported: false,
      reason: "ios-needs-pwa",
      needsPWA: true,
      title: "iPhone 需先安裝 App",
      hint: "請依下方步驟將 Jeko 加入主畫面，再開啟推播",
    };
  }

  // Chrome / Edge / Firefox
  if ("PushManager" in window) {
    return { supported: true, reason: "standard" };
  }

  // Safari（macOS 或 iOS 已從主畫面開啟）
  if (ctx.isSafari) {
    try {
      let reg = await navigator.serviceWorker.getRegistration("/");
      if (!reg) {
        reg = await navigator.serviceWorker.register("/sw.js");
      }
      if (reg?.pushManager) {
        return { supported: true, reason: "safari" };
      }
    } catch {
      /* fall through */
    }

    if (ctx.isMacDesktop) {
      return {
        supported: false,
        reason: "safari-mac-old",
        title: "此 Safari 版本不支援 Web Push",
        hint: "請將 macOS / Safari 更新至 16.4+，或改用 Chrome",
      };
    }

    return {
      supported: false,
      reason: "safari-unsupported",
      title: "Safari 目前無法訂閱推播",
      hint: "iPhone 請「加入主畫面」；Mac 請更新 Safari 或改用 Chrome",
    };
  }

  return {
    supported: false,
    reason: "unknown",
    title: "此瀏覽器不支援 Web Push",
    hint: "建議使用 Chrome 或 Edge",
  };
}
