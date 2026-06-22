"use client";

import { useEffect } from "react";
import { getServiceWorkerUrl } from "@/lib/pushSw";
import { initInstallPromptCapture } from "@/lib/pwaInstallPrompt";

/**
 * 頁面載入即註冊 Service Worker，讓 Chrome 網址列出現 PWA 安裝圖示。
 * next.config.js 設 register:false，改由此元件統一處理，與推播共用 /sw.js。
 */
export default function PWARegister() {
  useEffect(() => {
    initInstallPromptCapture();

    if (process.env.NODE_ENV === "development") return;
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker
      .register(getServiceWorkerUrl(), { scope: "/" })
      .catch((err) => {
        console.warn("[PWA] Service Worker 註冊失敗:", err);
      });
  }, []);

  return null;
}
