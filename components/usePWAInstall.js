"use client";

import { useState, useEffect } from "react";
import { subscribeToPush as subscribeToPushApi } from "@/lib/pushSubscribe";
import {
  getDeferredInstallPrompt,
  subscribeInstallPrompt,
  promptInstall,
} from "@/lib/pwaInstallPrompt";

export function usePWAInstall() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [deviceType, setDeviceType] = useState("none");
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIos = /iphone|ipad|ipod/.test(userAgent);
    const isIpadOS = userAgent.includes("mac") && "ontouchend" in document;
    const isMac = userAgent.includes("mac") && !("ontouchend" in document);

    const standaloneCheck =
      window.navigator.standalone === true ||
      window.matchMedia("(display-mode: standalone)").matches;

    setIsStandalone(standaloneCheck);

    if (!standaloneCheck) {
      if (isIos || isIpadOS) {
        setDeviceType("ios");
      } else if (isMac) {
        setDeviceType("mac");
      }
    }

    const syncInstallable = (prompt) => {
      setIsInstallable(!!prompt);
      if (prompt) setDeviceType("none");
    };

    syncInstallable(getDeferredInstallPrompt());
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
    await promptInstall();
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
