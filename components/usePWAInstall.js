"use client";

import { useState, useEffect } from "react";
import { subscribeToPush as subscribeToPushApi } from "@/lib/pushSubscribe";
import {
  subscribeInstallPrompt,
  isPwaInstallAvailable,
} from "@/lib/pwaInstallPrompt";
import { isSafariBrowser } from "@/lib/deviceDetect";

export function usePWAInstall() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [deviceType, setDeviceType] = useState("none");
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIos = /iphone|ipad|ipod/.test(userAgent);
    const isIpadOS = userAgent.includes("mac") && "ontouchend" in document;
    const isMacSafari =
      userAgent.includes("mac") &&
      !("ontouchend" in document) &&
      isSafariBrowser();

    const standaloneCheck =
      window.navigator.standalone === true ||
      window.matchMedia("(display-mode: standalone)").matches;

    setIsStandalone(standaloneCheck);

    if (!standaloneCheck) {
      if (isIos || isIpadOS) {
        setDeviceType("ios");
      } else if (isMacSafari) {
        setDeviceType("mac");
      }
    }

    const syncInstallable = (available) => {
      setIsInstallable(!!available);
      if (available) setDeviceType("none");
    };

    syncInstallable(isPwaInstallAvailable());
    const unsubscribe = subscribeInstallPrompt(syncInstallable);

    const onInstalled = () => {
      setIsInstallable(false);
      setDeviceType("none");
      setIsStandalone(true);
    };

    window.addEventListener("appinstalled", onInstalled);

    return () => {
      unsubscribe();
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const installPWA = async () => {
    // 安裝由 Chrome 網址列圖示處理，此函式僅供 UI 提示
  };

  const subscribeToPush = async ({ token, onStep } = {}) => {
    try {
      await subscribeToPushApi({ token, onStep });
      alert("🎉 推播已開啟！您將能第一時間接收專屬優惠與通知。");
    } catch (error) {
      alert(`訂閱過程中發生錯誤：\n${error.message}`);
      throw error;
    }
  };

  return { isInstallable, installPWA, deviceType, isStandalone, subscribeToPush };
}
