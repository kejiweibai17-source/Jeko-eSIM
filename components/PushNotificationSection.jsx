"use client";

import { useState, useEffect } from "react";
import PushButton from "./PushButton";
import IosPwaPushGuide from "./IosPwaPushGuide";
import { detectPushSupport } from "../lib/pushSupport";

/**
 * 推播區塊：自動判斷 iPhone 需教學 / 其他裝置直接顯示按鈕
 */
export default function PushNotificationSection({ className = "" }) {
  const [mode, setMode] = useState("loading"); // loading | guide | button

  useEffect(() => {
    detectPushSupport().then((support) => {
      if (support.reason === "ios-needs-pwa") {
        setMode("guide");
      } else {
        setMode("button");
      }
    });
  }, []);

  if (mode === "loading") {
    return (
      <div className={`shrink-0 px-6 py-3 rounded-full bg-stone-200 text-stone-500 text-sm font-bold animate-pulse ${className}`}>
        檢查推播環境…
      </div>
    );
  }

  if (mode === "guide") {
    return <IosPwaPushGuide className={className} />;
  }

  return <PushButton className={className} showDebugPanel={true} />;
}
