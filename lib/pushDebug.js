/** 推播除錯 log — 瀏覽器 Console 搜尋 [Push Debug] */
export function pushLog(step, detail) {
  const ts = new Date().toISOString();
  if (detail !== undefined) {
    console.log(`[Push Debug] ${ts} | ${step}`, detail);
  } else {
    console.log(`[Push Debug] ${ts} | ${step}`);
  }
}

export function pushError(step, err) {
  const msg = err?.message || String(err);
  console.error(`[Push Debug] ❌ ${step}`, msg, err);
}

/** 包一層 timeout，避免 UI 永遠卡在「開啟中」 */
export function withTimeout(promise, ms, label) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`${label} 逾時（${ms / 1000}s）— 可能 Service Worker 未註冊或瀏覽器封鎖`));
    }, ms);
    Promise.resolve(promise)
      .then((v) => {
        clearTimeout(timer);
        resolve(v);
      })
      .catch((e) => {
        clearTimeout(timer);
        reject(e);
      });
  });
}

/** 讀取 client 端推播環境（同步 + 非同步） */
export async function getClientPushEnvironment() {
  const env = {
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
    isSecureContext: typeof window !== "undefined" ? window.isSecureContext : false,
    serviceWorkerSupported: typeof navigator !== "undefined" && "serviceWorker" in navigator,
    pushManagerSupported: typeof window !== "undefined" && "PushManager" in window,
    notificationSupported: typeof window !== "undefined" && "Notification" in window,
    notificationPermission:
      typeof Notification !== "undefined" ? Notification.permission : "unknown",
    vapidPublicKeySet: !!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    vapidPublicPrefix: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY?.slice(0, 12) || null,
    swController: null,
    swRegistration: null,
    existingSubscription: false,
  };

  if (!env.serviceWorkerSupported) return env;

  try {
    env.swController = !!navigator.serviceWorker.controller;
    const reg = await navigator.serviceWorker.getRegistration("/");
    if (reg) {
      env.swRegistration = {
        scope: reg.scope,
        active: !!reg.active,
        installing: !!reg.installing,
        waiting: !!reg.waiting,
      };
      const sub = await reg.pushManager.getSubscription();
      env.existingSubscription = !!sub;
    }
  } catch (err) {
    env.swCheckError = err.message;
  }

  return env;
}

/** 確保 SW 已註冊並 ready（修復 ready 永遠 pending 的問題） */
export async function ensureServiceWorkerReady(addLog, timeoutMs = 20000) {
  if (!("serviceWorker" in navigator)) {
    throw new Error("此瀏覽器不支援 Service Worker");
  }

  addLog("1/5 檢查 Service Worker 狀態...");
  pushLog("SW 檢查開始");

  let registration = await navigator.serviceWorker.getRegistration("/");

  if (registration) {
    addLog(`已有 SW：scope=${registration.scope}`);
    pushLog("SW 已存在", {
      scope: registration.scope,
      active: !!registration.active,
      waiting: !!registration.waiting,
    });
  } else {
    addLog("尚未註冊 SW，正在 register(/sw.js)...");
    pushLog("SW register 開始");
    registration = await withTimeout(
      navigator.serviceWorker.register("/sw.js"),
      timeoutMs,
      "Service Worker register"
    );
    addLog(`SW register 成功：${registration.scope}`);
    pushLog("SW register 成功", { scope: registration.scope });
  }

  addLog("2/5 等待 Service Worker ready...");
  const readyReg = await withTimeout(
    navigator.serviceWorker.ready,
    timeoutMs,
    "Service Worker ready"
  );

  addLog(`SW ready ✓ active=${!!readyReg.active}`);
  pushLog("SW ready", { scope: readyReg.scope, active: !!readyReg.active });
  return readyReg;
}

/** 拉 server 端 env 檢查 */
export async function fetchServerPushConfig() {
  try {
    const res = await fetch("/api/push/debug-config");
    const cfg = await res.json();
    pushLog("伺服器 push debug-config", cfg);
    return cfg;
  } catch (err) {
    pushError("無法取得 /api/push/debug-config", err);
    return null;
  }
}
