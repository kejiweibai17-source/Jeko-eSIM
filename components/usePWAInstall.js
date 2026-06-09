"use client";

import { useState, useEffect } from "react";

// 輔助函式：轉換 VAPID 公鑰格式
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [deviceType, setDeviceType] = useState("none");
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIos = /iphone|ipad|ipod/.test(userAgent);
    const isIpadOS = userAgent.includes("mac") && "ontouchend" in document;
    const isMac = userAgent.includes("mac") && !("ontouchend" in document);

    // 檢查是否已經在 PWA 獨立模式下運行 (從桌面/Dock開啟)
    const standaloneCheck = 
      window.navigator.standalone === true || 
      window.matchMedia('(display-mode: standalone)').matches;
    
    setIsStandalone(standaloneCheck); // 記錄狀態

    if (!standaloneCheck) {
      if (isIos || isIpadOS) {
        setDeviceType("ios");
      } else if (isMac) {
        setDeviceType("mac");
      }
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
      setDeviceType("none");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    window.addEventListener("appinstalled", () => {
      setDeferredPrompt(null);
      setIsInstallable(false);
      setDeviceType("none");
      setIsStandalone(true);
      console.log("[PWA] 安裝成功");
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const installPWA = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  // 🌟 完美除錯版：推播訂閱邏輯
  const subscribeToPush = async () => {
    console.log("[Push Debug] 1. 按鈕已點擊，開始檢查環境...");

    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.error("[Push Debug] 環境不支援推播");
      alert("您的裝置或瀏覽器不支援推播通知");
      return;
    }

    try {
      console.log("[Push Debug] 2. 準備向系統請求權限...");
      // ⚠️ 關鍵：Safari 規定這行必須在點擊後的第一時間執行，中間不能有任何 await！
      const permission = await Notification.requestPermission();
      console.log("[Push Debug] 3. 使用者權限結果:", permission);

      if (permission !== 'granted') {
        alert(`無法開啟推播，因為您選擇了：${permission} (您可能需要去系統設定中開啟通知)`);
        return;
      }

      console.log("[Push Debug] 4. 開始註冊 Service Worker...");
      const registration = await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;
      console.log("[Push Debug] 5. SW 註冊完成:", registration);

      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidKey) {
        throw new Error("找不到 NEXT_PUBLIC_VAPID_PUBLIC_KEY，請確認 .env.local 檔案");
      }

      console.log("[Push Debug] 6. 開始轉換金鑰，向瀏覽器推播伺服器訂閱...");
      const convertedVapidKey = urlBase64ToUint8Array(vapidKey);
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey
      });

      console.log("[Push Debug] 7. 取得訂閱憑證成功：", JSON.stringify(subscription));

      const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
      console.log(`[Push Debug] 8. 準備打 API 將憑證傳給 Medusa: ${backendUrl}/store/push/subscribe`);

      const response = await fetch(`${backendUrl}/store/push/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription)
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Medusa API 儲存失敗 (狀態碼: ${response.status}) - ${errText}`);
      }

      console.log("[Push Debug] 9. 流程完美結束，Medusa 儲存成功！");
      alert("🎉 訂閱成功！您將能第一時間接收專屬優惠！");
      
    } catch (error) {
      console.error("[Push Debug] 發生致命錯誤:", error);
      alert(`訂閱過程中發生錯誤：\n${error.message}`);
    }
  };

  return { isInstallable, installPWA, deviceType, isStandalone, subscribeToPush };
}