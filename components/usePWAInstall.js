"use client";

import { useState, useEffect } from "react";
import { subscribeToPush as subscribeToPushApi } from "@/lib/pushSubscribe";

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
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const installPWA = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setIsInstallable(false);
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
