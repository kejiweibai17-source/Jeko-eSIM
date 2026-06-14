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

/** 包一層 timeout */
export function withTimeout(promise, ms, label) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`${label} 逾時（${ms / 1000}s）`));
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

function getWorkerState(registration) {
  const w = registration?.installing || registration?.waiting || registration?.active;
  return w?.state || (registration?.active ? "activated" : "none");
}

/** 快取 warmup 結果，避免重複 register */
let warmupPromise = null;
let cachedRegistration = null;

export function getCachedSWRegistration() {
  return cachedRegistration?.active ? cachedRegistration : null;
}

/** 讀取 client 端推播環境 */
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
    const reg = cachedRegistration || (await navigator.serviceWorker.getRegistration("/"));
    if (reg) {
      env.swRegistration = {
        scope: reg.scope,
        state: getWorkerState(reg),
        active: !!reg.active,
      };
      const sub = await reg.pushManager.getSubscription();
      env.existingSubscription = !!sub;
    }
  } catch (err) {
    env.swCheckError = err.message;
  }

  return env;
}

/** 等待 SW activated（僅用於「我們剛 register」的新 SW） */
function waitForSWActivated(registration, timeoutMs, addLog) {
  if (registration.active) return Promise.resolve(registration);

  const worker = registration.installing || registration.waiting;
  if (!worker) {
    return withTimeout(navigator.serviceWorker.ready, timeoutMs, "Service Worker ready");
  }

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`SW activate 逾時（${timeoutMs / 1000}s，state=${worker.state}）`));
    }, timeoutMs);

    const onStateChange = () => {
      pushLog("SW statechange", { state: worker.state });
      if (addLog) addLog(`SW → ${worker.state}`);

      if (worker.state === "activated") {
        clearTimeout(timer);
        worker.removeEventListener("statechange", onStateChange);
        resolve(registration);
      } else if (worker.state === "redundant") {
        clearTimeout(timer);
        worker.removeEventListener("statechange", onStateChange);
        reject(new Error("SW redundant"));
      }
    };

    worker.addEventListener("statechange", onStateChange);
    onStateChange();
  });
}

/** 清除非 active 的舊 SW（不等待 — 舊版 precache 的 installing 直接砍掉） */
async function clearStaleSW(addLog) {
  const reg = await navigator.serviceWorker.getRegistration("/");
  if (!reg || reg.active) return false;

  const state = getWorkerState(reg);

  // 快完成了就給 3 秒
  if (state === "activating") {
    addLog?.("SW activating，最多等 3 秒…");
    try {
      const activated = await waitForSWActivated(reg, 3000, addLog);
      cachedRegistration = activated;
      return true;
    } catch {
      /* fall through */
    }
  }

  addLog?.(`清除非 active SW（state=${state}）`);
  await reg.unregister();
  cachedRegistration = null;
  await new Promise((r) => setTimeout(r, 150));
  return false;
}

async function doWarmup(addLog) {
  if (!("serviceWorker" in navigator)) {
    return { ready: false, registration: null };
  }

  if (cachedRegistration?.active) {
    return { ready: true, registration: cachedRegistration };
  }

  let reg = await navigator.serviceWorker.getRegistration("/");
  if (reg?.active) {
    cachedRegistration = reg;
    addLog?.("✅ SW 已 active");
    return { ready: true, registration: reg };
  }

  // 有舊 SW 但未 active → 不等待 12 秒，直接清除
  if (reg && !reg.active) {
    const activated = await clearStaleSW(addLog);
    if (activated && cachedRegistration?.active) {
      addLog?.("✅ SW 在清除前完成 activate");
      return { ready: true, registration: cachedRegistration };
    }
  }

  addLog?.("register(/sw.js)…");
  reg = await navigator.serviceWorker.register("/sw.js");
  reg = await waitForSWActivated(reg, 20000, addLog);
  cachedRegistration = reg;
  addLog?.("✅ SW 預熱完成");
  return { ready: true, registration: reg };
}

/** 頁面載入背景預熱（singleton） */
export function warmupServiceWorker(addLog) {
  if (!warmupPromise) {
    warmupPromise = doWarmup(addLog).catch((err) => {
      warmupPromise = null;
      pushError("SW 預熱失敗", err);
      addLog?.(`⚠️ SW 預熱失敗：${err.message}`);
      return { ready: false, registration: null };
    });
  }
  return warmupPromise;
}

/** 點擊時確保 SW ready */
export async function ensureServiceWorkerReady(addLog) {
  const cached = getCachedSWRegistration();
  if (cached) {
    addLog("SW 快取命中 ✓");
    return cached;
  }

  const result = await warmupServiceWorker(addLog);
  if (result.ready && result.registration?.active) {
    return result.registration;
  }
  throw new Error("Service Worker 無法啟動，請重新整理後再試");
}

/** Push 訂閱（含 AbortError / push service error 自動重試） */
export async function subscribePushWithRetry(registration, applicationServerKey, addLog, maxAttempts = 3) {
  const existing = await registration.pushManager.getSubscription();
  if (existing) {
    addLog?.("沿用既有 browser 訂閱");
    return existing;
  }

  let lastErr;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      });
      return sub;
    } catch (err) {
      lastErr = err;
      const retryable =
        err?.name === "AbortError" ||
        /push service|Registration failed|network/i.test(err?.message || "");

      if (attempt < maxAttempts && retryable) {
        const delay = attempt * 400;
        addLog?.(`Push 暫時錯誤（${err.message}），${delay}ms 後重試 ${attempt + 1}/${maxAttempts}`);
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }
      throw err;
    }
  }
  throw lastErr;
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
