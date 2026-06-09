"use client";
import { useState, useEffect } from "react";
import { useUser } from "./context/UserContext";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
  return outputArray;
}

export default function PushButton({ className = "" }) {
  const { token } = useUser();

  const [status, setStatus] = useState("idle"); // idle | loading | subscribed | unsupported | error
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      navigator.serviceWorker.ready.then((reg) =>
        reg.pushManager.getSubscription().then((sub) => {
          if (sub) setStatus("subscribed");
        })
      );
    } else {
      setStatus("unsupported");
    }
  }, []);

  const handleSubscribe = async () => {
    if (!token) {
      alert("請先登入會員，才能開啟流量提醒通知喔！");
      return;
    }

    setStatus("loading");

    try {
      // 1. 請求通知權限（Safari 要求必須在 click handler 內同步呼叫）
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        alert("需要您允許通知權限，才能接收流量提醒。\n請至瀏覽器設定 → 通知 → 允許本站。");
        setStatus("idle");
        return;
      }

      // 2. 等待 Service Worker 就緒（build 版才有 SW，dev 模式會報錯）
      const registration = await navigator.serviceWorker.ready;

      const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!publicKey) throw new Error("找不到 NEXT_PUBLIC_VAPID_PUBLIC_KEY，請確認 .env.local");

      // 3. 向瀏覽器 Push 伺服器訂閱
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      // 4. 將訂閱憑證儲存到自己的 Next.js API（/api/subscribe）
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(subscription),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      setStatus("subscribed");
    } catch (err) {
      console.error("[PushButton] 訂閱失敗:", err);
      // 開發模式 SW 不存在時的友善提示
      if (err.message?.includes("service worker")) {
        alert(
          "Service Worker 未就緒。\n\n推播功能需要在 Production 模式下測試：\nnpm run build && npm run start"
        );
      } else {
        alert(`開啟推播失敗：${err.message}`);
      }
      setStatus("idle");
    }
  };

  if (!isSupported || status === "unsupported") return null;

  const isSubscribed = status === "subscribed";
  const isLoading = status === "loading";

  return (
    <button
      onClick={handleSubscribe}
      disabled={isSubscribed || isLoading}
      className={`px-6 py-3 rounded-full font-bold text-white transition-all shadow-md active:scale-95 ${
        isSubscribed
          ? "bg-green-500 cursor-default"
          : isLoading
          ? "bg-slate-400 cursor-wait"
          : "bg-[#0A6CD0] hover:bg-blue-700"
      } ${className}`}
    >
      {isSubscribed
        ? "🔔 已開啟流量提醒通知"
        : isLoading
        ? "⏳ 開啟中..."
        : "開啟流量提醒通知 ✈️"}
    </button>
  );
}
