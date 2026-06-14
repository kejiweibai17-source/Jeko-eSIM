"use client";
import { useState, useEffect, useCallback } from "react";
import { useUser } from "./context/UserContext";
import {
  pushLog,
  pushError,
  withTimeout,
  getClientPushEnvironment,
  ensureServiceWorkerReady,
  fetchServerPushConfig,
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

  const [status, setStatus] = useState("idle"); // idle | loading | subscribed | unsupported | error
  const [isSupported, setIsSupported] = useState(false);
  const [debugLogs, setDebugLogs] = useState([]);
  const [lastError, setLastError] = useState(null);
  const [currentStep, setCurrentStep] = useState("");
  const [serverConfig, setServerConfig] = useState(null);
  const [clientEnv, setClientEnv] = useState(null);

  const addLog = useCallback((msg) => {
    const line = `${new Date().toLocaleTimeString()} ${msg}`;
    pushLog(msg);
    setDebugLogs((prev) => [...prev.slice(-19), line]);
  }, []);

  useEffect(() => {
    const init = async () => {
      const supported = "serviceWorker" in navigator && "PushManager" in window;
      setIsSupported(supported);

      if (!supported) {
        setStatus("unsupported");
        addLog("❌ 不支援推播（需 Service Worker + PushManager）");
        return;
      }

      const env = await getClientPushEnvironment();
      setClientEnv(env);
      pushLog("初始 client 環境", env);

      const cfg = await fetchServerPushConfig();
      setServerConfig(cfg);

      try {
        const reg = await withTimeout(navigator.serviceWorker.ready, 8000, "初始 SW ready");
        const sub = await reg.pushManager.getSubscription();
        if (sub) {
          setStatus("subscribed");
          addLog("✅ 偵測到既有推播訂閱");
        }
      } catch {
        addLog("⚠️ 初始 SW 尚未 ready（點擊訂閱時會自動 register）");
      }
    };

    init();
  }, [addLog]);

  const handleSubscribe = async () => {
    setLastError(null);
    setDebugLogs([]);

    if (!token) {
      addLog("❌ 未登入：token 為空");
      alert("請先登入會員，才能開啟流量提醒通知喔！");
      return;
    }

    addLog(`已登入 user=${user?.email || user?.id || "?"}`);
    addLog(`token 長度=${token.length}`);

    setStatus("loading");

    try {
      // 0. 伺服器 env
      setCurrentStep("檢查伺服器設定");
      const cfg = serverConfig || (await fetchServerPushConfig());
      setServerConfig(cfg);
      if (cfg) {
        addLog(`伺服器 VAPID 公鑰=${cfg.checks?.vapidPublicOk ? "✓" : "✗"} 私鑰=${cfg.checks?.vapidPrivateOk ? "✓" : "✗"}`);
        if (!cfg.ok) {
          throw new Error(cfg.hint || "伺服器推播環境變數未設定完整");
        }
      }

      const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!publicKey) {
        throw new Error("找不到 NEXT_PUBLIC_VAPID_PUBLIC_KEY");
      }
      addLog(`Client VAPID 前綴=${publicKey.slice(0, 12)}...`);

      // 1. 通知權限
      setCurrentStep("請求通知權限");
      addLog("3/5 請求 Notification 權限...");
      pushLog("requestPermission 前", { permission: Notification.permission });

      const permission = await withTimeout(
        Notification.requestPermission(),
        120000,
        "Notification.requestPermission（請在彈窗按「允許」）"
      );

      addLog(`權限結果=${permission}`);
      if (permission !== "granted") {
        throw new Error(`通知權限=${permission}，請至瀏覽器設定允許 jeko-e-sim.vercel.app`);
      }

      // 2. Service Worker（明確 register，避免 ready 永遠 pending）
      setCurrentStep("註冊 Service Worker");
      const registration = await ensureServiceWorkerReady(addLog, 60000);

      // 3. Push 訂閱
      setCurrentStep("向 Push 伺服器訂閱");
      addLog("4/5 pushManager.subscribe...");
      const subscription = await withTimeout(
        registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey),
        }),
        20000,
        "pushManager.subscribe"
      );

      addLog(`訂閱 endpoint=${subscription.endpoint?.slice(0, 48)}...`);

      // 4. 存到 API
      setCurrentStep("儲存訂閱到伺服器");
      addLog("5/5 POST /api/subscribe...");
      const res = await withTimeout(
        fetch("/api/subscribe", {
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
      addLog(`API 回應 HTTP ${res.status} ${JSON.stringify(data)}`);

      if (!res.ok) {
        throw new Error(data.error || data.detail || `HTTP ${res.status}`);
      }

      addLog("✅ 推播訂閱完成！應收到測試通知");
      setStatus("subscribed");
      setCurrentStep("");
    } catch (err) {
      pushError("訂閱流程失敗", err);
      const msg = err?.message || String(err);
      addLog(`❌ ${msg}`);
      setLastError(msg);
      setStatus("error");
      setCurrentStep("");

      if (msg.includes("Service Worker") || msg.includes("逾時")) {
        alert(
          `推播失敗：${msg}\n\n` +
            "常見原因：\n" +
            "• Safari 需 HTTPS 且允許通知\n" +
            "• 首次需等 SW 註冊（已自動處理）\n" +
            "• 請重新整理頁面後再試\n" +
            "• dev 模式不支援，請用 Vercel 正式站測試"
        );
      } else {
        alert(`開啟推播失敗：${msg}`);
      }
    }
  };

  if (!isSupported || status === "unsupported") {
    return showDebugPanel ? (
      <div className="text-xs text-red-600 font-mono">此瀏覽器不支援 Web Push</div>
    ) : null;
  }

  const isSubscribed = status === "subscribed";
  const isLoading = status === "loading";
  const isError = status === "error";

  return (
    <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
      <button
        onClick={handleSubscribe}
        disabled={isSubscribed || isLoading}
        className={`px-6 py-3 rounded-full font-bold text-white transition-all shadow-md active:scale-95 ${
          isSubscribed
            ? "bg-green-500 cursor-default"
            : isLoading
            ? "bg-slate-400 cursor-wait"
            : isError
            ? "bg-orange-500 hover:bg-orange-600"
            : "bg-[#0A6CD0] hover:bg-blue-700"
        } ${className}`}
      >
        {isSubscribed
          ? "🔔 已開啟流量提醒通知"
          : isLoading
          ? `⏳ ${currentStep || "開啟中"}...`
          : isError
          ? "🔄 重試開啟推播"
          : "開啟流量提醒通知 ✈️"}
      </button>

      {showDebugPanel && (debugLogs.length > 0 || isLoading || isError) && (
        <div className="w-full sm:min-w-[320px] max-w-md rounded-xl bg-stone-900/95 border border-stone-700 p-3 text-[10px] font-mono text-stone-300 max-h-48 overflow-y-auto text-left">
          <p className="font-bold text-amber-400 mb-1.5">
            [Push Debug] F12 Console 可看完整 log
          </p>
          {clientEnv && (
            <p className="text-stone-500 mb-1 break-all">
              SW={clientEnv.swRegistration ? "已註冊" : "未註冊"} | 權限=
              {clientEnv.notificationPermission} | token={token ? "有" : "無"}
            </p>
          )}
          {serverConfig && !serverConfig.ok && (
            <p className="text-red-400 mb-1">⚠️ 伺服器：{serverConfig.hint}</p>
          )}
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
