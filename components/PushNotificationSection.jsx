"use client";

import { useState, useEffect, useCallback } from "react";
import PushButton from "./PushButton";
import IosPwaPushGuide from "./IosPwaPushGuide";
import { detectPushSupport } from "../lib/pushSupport";

/**
 * 推播區塊：iPhone 未安裝 → 簡易安裝引導；其餘 → 推播按鈕
 */
export default function PushNotificationSection({ className = "" }) {
  const [mode, setMode] = useState("loading");

  const refresh = useCallback(() => {
    detectPushSupport().then((support) => {
      setMode(support.reason === "ios-needs-pwa" ? "guide" : "button");
    });
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener("visibilitychange", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      window.removeEventListener("visibilitychange", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, [refresh]);

  if (mode === "loading") {
    return (
      <div
        className={`px-6 py-3 rounded-full bg-stone-200 text-stone-500 text-sm font-bold animate-pulse ${className}`}
      >
        載入中…
      </div>
    );
  }

  if (mode === "guide") {
    return <IosPwaPushGuide className={className} />;
  }

  return <PushButton className={className} showDebugPanel={false} />;
};
