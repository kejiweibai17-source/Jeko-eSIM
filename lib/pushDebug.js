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

/** 等待 SW 進入 activated；若 install 失敗（redundant）則拋錯 */
function waitForSWActivated(registration, timeoutMs) {
  if (registration.active) return Promise.resolve(registration);

  const worker = registration.installing || registration.waiting;
  if (!worker) {
    return withTimeout(navigator.serviceWorker.ready, timeoutMs, "Service Worker ready");
  }

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(
        new Error(
          "Service Worker activate 逾時 — Console 若有 bad-precaching-response，請重新部署後清除 SW 快取"
        )
      );
    }, timeoutMs);

    const onStateChange = () => {
      pushLog("SW statechange", { state: worker.state });
      if (worker.state === "activated") {
        clearTimeout(timer);
        worker.removeEventListener("statechange", onStateChange);
        resolve(registration);
      } else if (worker.state === "redundant") {
        clearTimeout(timer);
        worker.removeEventListener("statechange", onStateChange);
        reject(
          new Error(
            "Service Worker 安裝失敗（precache 404）— 常見原因：/index.html 不存在。請重新部署並在 DevTools → Application → Service Workers 按 Unregister"
          )
        );
      }
    };

    worker.addEventListener("statechange", onStateChange);
    // 若事件已錯過，立即檢查
    onStateChange();
  });
}

/** 清除損壞的 SW 註冊（install 失敗時重試用） */
async function unregisterBrokenSW(addLog) {
  const reg = await navigator.serviceWorker.getRegistration("/");
  if (reg) {
    addLog("清除舊 SW 註冊...");
    await reg.unregister();
    pushLog("SW unregister 完成");
  }
}

/** 確保 SW 已註冊並 ready（修復 ready 永遠 pending 的問題） */
export async function ensureServiceWorkerReady(addLog, timeoutMs = 20000) {
  if (!("serviceWorker" in navigator)) {
    throw new Error("此瀏覽器不支援 Service Worker");
  }

  addLog("1/5 檢查 Service Worker 狀態...");
  pushLog("SW 檢查開始");

  const tryRegister = async () => {
    let registration = await navigator.serviceWorker.getRegistration("/");

    if (registration?.active) {
      addLog(`已有 active SW：${registration.scope}`);
      return registration;
    }

    if (registration && !registration.active) {
      addLog("SW 存在但未 active，等待 activate...");
      return waitForSWActivated(registration, timeoutMs);
    }

    addLog("尚未註冊 SW，正在 register(/sw.js)...");
    pushLog("SW register 開始");
    registration = await withTimeout(
      navigator.serviceWorker.register("/sw.js"),
      timeoutMs,
      "Service Worker register"
    );
    addLog(`SW register 成功：${registration.scope}`);
    pushLog("SW register 成功", { scope: registration.scope });

    addLog("2/5 等待 Service Worker activate...");
    return waitForSWActivated(registration, timeoutMs);
  };

  try {
    const readyReg = await tryRegister();
    addLog(`SW ready ✓ active=${!!readyReg.active}`);
    pushLog("SW ready", { scope: readyReg.scope, active: !!readyReg.active });
    return readyReg;
  } catch (firstErr) {
    pushError("SW 第一次啟動失敗，嘗試 unregister 後重試", firstErr);
    await unregisterBrokenSW(addLog);
    const readyReg = await tryRegister();
    addLog(`SW 重試成功 ✓ active=${!!readyReg.active}`);
    return readyReg;
  }
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
