"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useUser } from "./context/UserContext";
import {
  pushLog,
  pushError,
  withTimeout,
  getClientPushEnvironment,
  ensureServiceWorkerReady,
  fetchServerPushConfig,
  warmupServiceWorker,
  subscribePushWithRetry,
} from "../lib/pushDebug";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
  return outputArray;
}

export default function PushButton({ className = "", showDebugPanel = true }) {
  const { token, user } = useUser();

  const [status, setStatus] = useState("idle"); // idle | warming | loading | subscribed | unsupported | error
  const [isSupported, setIsSupported] = useState(false);
  const [swReady, setSwReady] = useState(false);
  const [debugLogs, setDebugLogs] = useState([]);
  const [lastError, setLastError] = useState(null);
  const [currentStep, setCurrentStep] = useState("");
  const [serverConfig, setServerConfig] = useState(null);
  const [clientEnv, setClientEnv] = useState(null);
  const warmupStarted = useRef(false);

  const addLog = useCallback((msg) => {
    const line = `${new Date().toLocaleTimeString()} ${msg}`;
    pushLog(msg);
    setDebugLogs((prev) => [...prev.slice(-19), line]);
  }, []);

  // 頁面載入時背景預熱 SW（使用者點按鈕前就先準備好）
  useEffect(() => {
    if (warmupStarted.current) return;
    warmupStarted.current = true;

    const init = async () => {
      const supported = "serviceWorker" in navigator && "PushManager" in window;
      setIsSupported(supported);

      if (!supported) {
        setStatus("unsupported");
        addLog("❌ 不支援推播");
        return;
      }

      setStatus("warming");
      const [env, cfg] = await Promise.all([
        getClientPushEnvironment(),
        fetchServerPushConfig(),
      ]);
      setClientEnv(env);
      setServerConfig(cfg);
      pushLog("初始 client 環境", env);

      if (env.existingSubscription) {
        setStatus("subscribed");
        setSwReady(true);
        addLog("✅ 已有推播訂閱");
        return;
      }

      const { ready } = await warmupServiceWorker(addLog);
      setSwReady(ready);
      setStatus("idle");
      if (ready) {
        addLog("✅ SW 背景預熱完成，可立即訂閱");
      } else {
        addLog("⚠️ SW 預熱未完成，點擊時會再試");
      }
    };

    init();
  }, [addLog]);

  const handleSubscribe = async () => {
    setLastError(null);

    if (!token) {
      addLog("❌ 未登入");
      alert("請先登入會員，才能開啟流量提醒通知喔！");
      return;
    }

    addLog(`已登入 ${user?.email || user?.id}`);
    setStatus("loading");

    try {
      setCurrentStep("檢查伺服器");
      const cfg = serverConfig || (await fetchServerPushConfig());
      setServerConfig(cfg);
      if (cfg && !cfg.ok) {
        throw new Error(cfg.hint || "伺服器推播環境變數未設定");
      }

      const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!publicKey) throw new Error("找不到 NEXT_PUBLIC_VAPID_PUBLIC_KEY");

      setCurrentStep("通知權限");
      const permission = await withTimeout(
        Notification.requestPermission(),
        120000,
        "Notification.requestPermission"
      );
      addLog(`權限=${permission}`);
      if (permission !== "granted") {
        throw new Error(`通知權限=${permission}`);
      }

      setCurrentStep("Service Worker");
      const registration = await ensureServiceWorkerReady(addLog);
      setSwReady(true);

      setCurrentStep("Push 訂閱");
      const subscription = await subscribePushWithRetry(
        registration,
        urlBase64ToUint8Array(publicKey),
        addLog
      );

      setCurrentStep("儲存訂閱");
      const res = await withTimeout(
        fetch("/api/subscribe/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(subscription),
        }),
        30000,
        "POST /api/subscribe"
      );

      const data = await res.json().catch(() => ({}));
      addLog(`API ${res.status} testPush=${data.testPushOk}`);

      if (!res.ok) {
        throw new Error(data.error || data.detail || `HTTP ${res.status}`);
      }

      addLog("✅ 推播訂閱完成");
      setStatus("subscribed");
      setCurrentStep("");
    } catch (err) {
      pushError("訂閱失敗", err);
      const msg = err?.message || String(err);
      addLog(`❌ ${msg}`);
      setLastError(msg);
      setStatus("error");
      setCurrentStep("");
      alert(`開啟推播失敗：${msg}`);
    }
  };

  if (!isSupported || status === "unsupported") {
    return showDebugPanel ? (
      <div className="text-xs text-red-600 font-mono">此瀏覽器不支援 Web Push</div>
    ) : null;
  }

  const isSubscribed = status === "subscribed";
  const isLoading = status === "loading";
  const isWarming = status === "warming";
  const isError = status === "error";

  return (
    <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
      <button
        onClick={handleSubscribe}
        disabled={isSubscribed || isLoading || isWarming}
        className={`px-6 py-3 rounded-full font-bold text-white transition-all shadow-md active:scale-95 ${
          isSubscribed
            ? "bg-green-500 cursor-default"
            : isLoading || isWarming
            ? "bg-slate-400 cursor-wait"
            : isError
            ? "bg-orange-500 hover:bg-orange-600"
            : "bg-[#0A6CD0] hover:bg-blue-700"
        } ${className}`}
      >
        {isSubscribed
          ? "🔔 已開啟流量提醒通知"
          : isWarming
          ? "⏳ 準備推播服務…"
          : isLoading
          ? `⏳ ${currentStep}…`
          : isError
          ? "🔄 重試開啟推播"
          : swReady
          ? "開啟流量提醒通知 ✈️"
          : "開啟流量提醒通知 ✈️"}
      </button>

      {showDebugPanel && (debugLogs.length > 0 || isLoading || isError || isWarming) && (
        <div className="w-full sm:min-w-[320px] max-w-md rounded-xl bg-stone-900/95 border border-stone-700 p-3 text-[10px] font-mono text-stone-300 max-h-48 overflow-y-auto text-left">
          <p className="font-bold text-amber-400 mb-1.5">[Push Debug]</p>
          <p className="text-stone-500 mb-1">
            SW={swReady ? "✅ ready" : isWarming ? "預熱中" : "待準備"} | 權限=
            {clientEnv?.notificationPermission || "?"} | token={token ? "有" : "無"}
          </p>
          {lastError && <p className="text-red-400 mb-1 break-all">❌ {lastError}</p>}
          {debugLogs.map((line, i) => (
            <div key={i} className="leading-relaxed break-all text-stone-400">
              {line}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
