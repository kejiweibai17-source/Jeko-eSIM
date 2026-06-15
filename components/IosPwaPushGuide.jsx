"use client";

import { useState, useEffect } from "react";
import {
  DevicePhoneMobileIcon,
  ArrowUpOnSquareIcon,
  PlusCircleIcon,
  HomeIcon,
  BellAlertIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import { getBrowserContext, isStandalonePWA } from "../lib/pushSupport";

const STORAGE_KEY = "jeko-ios-pwa-guide-done";

const GUIDE_STEPS = [
  {
    id: 1,
    icon: DevicePhoneMobileIcon,
    title: "確認您正在使用 iPhone 或 iPad",
    desc: "推播功能需在 iPhone / iPad 上操作（電腦請改用 Chrome）",
    tip: "若您正在看這段文字，代表裝置正確 ✓",
  },
  {
    id: 2,
    icon: ArrowUpOnSquareIcon,
    title: "點 Safari 畫面「下方」的分享按鈕",
    desc: "分享圖示是一個方框 ⬆️ 加一支箭頭，在網址列下方或螢幕最底部中間",
    tip: "找不到？請確認是用 Safari 開啟，不是 Chrome 或 LINE 內建瀏覽器",
    visual: "share",
  },
  {
    id: 3,
    icon: PlusCircleIcon,
    title: "在選單中向下滑，點「加入主畫面」",
    desc: "若沒看到，繼續往下滑；圖示是 ➕ 在方框裡",
    tip: "選單很長時，「加入主畫面」通常在中段偏下",
    visual: "add-home",
  },
  {
    id: 4,
    icon: HomeIcon,
    title: "點右上角藍色「加入」",
    desc: "可修改名稱為「Jeko eSIM」，再按「加入」",
    tip: "完成後 Safari 會短暫閃一下，代表成功",
    visual: "confirm",
  },
  {
    id: 5,
    icon: DevicePhoneMobileIcon,
    title: "按 Home 鍵，從主畫面開啟 Jeko",
    desc: "在主畫面找到 Jeko 圖示，點它開啟（不是再開 Safari 分頁）",
    tip: "從主畫面開啟時，上方不會有 Safari 網址列，代表成功",
    visual: "launch",
  },
  {
    id: 6,
    icon: BellAlertIcon,
    title: "登入會員 → 回到「查詢用量」→ 開啟推播",
    desc: "必須在從主畫面開啟的 App 裡登入，再點「開啟流量提醒通知」",
    tip: "允許通知時請按「允許」",
    visual: "push",
  },
];

function ShareButtonMockup() {
  return (
    <div className="mt-3 flex justify-center">
      <div className="w-[200px] rounded-2xl border-2 border-stone-300 bg-stone-100 p-2 shadow-inner">
        <div className="h-6 rounded bg-white/80 mb-2" />
        <div className="flex justify-center gap-6 py-2 border-t border-stone-200">
          <div className="flex flex-col items-center gap-0.5">
            <div className="w-10 h-10 rounded-lg bg-[#0A6CD0] flex items-center justify-center ring-2 ring-[#FF8C00] ring-offset-2">
              <ArrowUpOnSquareIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-[9px] font-bold text-[#FF8C00]">分享 ← 點這裡</span>
          </div>
          <div className="flex flex-col items-center gap-0.5 opacity-40">
            <div className="w-10 h-10 rounded-lg bg-stone-300" />
            <span className="text-[9px] text-stone-400">其他</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddHomeMockup() {
  return (
    <div className="mt-3 mx-auto max-w-[240px] rounded-xl border border-stone-200 bg-white p-2 text-[10px] shadow-sm">
      <div className="py-1.5 px-2 text-stone-400 border-b">⋯ 更多選項</div>
      <div className="py-2 px-2 flex items-center gap-2 bg-[#F0F7FF] rounded-lg ring-2 ring-[#0A6CD0] font-bold text-[#0A6CD0]">
        <PlusCircleIcon className="w-5 h-5 shrink-0" />
        加入主畫面 ← 點這個
      </div>
      <div className="py-1.5 px-2 text-stone-400">書籤</div>
    </div>
  );
}

function LaunchMockup() {
  return (
    <div className="mt-3 flex justify-center gap-3">
      <div className="flex flex-col items-center gap-1">
        <img src="/icons/icon-192x192.png" alt="Jeko" className="w-14 h-14 rounded-2xl shadow-md ring-2 ring-[#0A6CD0]" />
        <span className="text-[9px] font-bold text-[#0A6CD0]">Jeko eSIM</span>
        <span className="text-[8px] text-[#FF8C00]">點圖示開啟</span>
      </div>
    </div>
  );
}

export default function IosPwaPushGuide({ className = "" }) {
  const [activeStep, setActiveStep] = useState(1);
  const [doneSteps, setDoneSteps] = useState([]);
  const [faqOpen, setFaqOpen] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const ctx = getBrowserContext();
    setIsIOS(ctx.isIOS);

    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      if (Array.isArray(saved)) setDoneSteps(saved);
    } catch {
      /* ignore */
    }

    if (isStandalonePWA()) {
      setActiveStep(6);
      markDone(5);
    }
  }, []);

  const markDone = (stepId) => {
    setDoneSteps((prev) => {
      const next = prev.includes(stepId) ? prev : [...prev, stepId];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
    if (stepId < GUIDE_STEPS.length) {
      setActiveStep(stepId + 1);
    }
  };

  const resetGuide = () => {
    setDoneSteps([]);
    setActiveStep(1);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  };

  if (!isIOS) return null;

  const progress = Math.round((doneSteps.length / GUIDE_STEPS.length) * 100);
  const allDone = doneSteps.length >= GUIDE_STEPS.length - 1; // step 6 is final action

  return (
    <div className={`w-full ${className}`}>
      <div className="rounded-2xl border-2 border-[#0A6CD0]/30 bg-gradient-to-b from-[#F0F7FF] to-white overflow-hidden">
        {/* Header */}
        <div className="bg-[#0A6CD0] px-4 py-3 text-white">
          <p className="text-xs font-medium opacity-90">iPhone 推播安裝教學</p>
          <p className="text-base font-black mt-0.5">3 分鐘完成 · 照著做就好</p>
          <div className="mt-2 h-1.5 rounded-full bg-white/30 overflow-hidden">
            <div
              className="h-full bg-[#FF8C00] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[10px] mt-1 opacity-80">進度 {doneSteps.length} / {GUIDE_STEPS.length} 步</p>
        </div>

        {/* Steps */}
        <div className="p-4 space-y-3 max-h-[420px] overflow-y-auto">
          {GUIDE_STEPS.map((step) => {
            const Icon = step.icon;
            const isDone = doneSteps.includes(step.id);
            const isActive = activeStep === step.id;

            return (
              <div
                key={step.id}
                className={`rounded-xl border p-3 transition-all ${
                  isDone
                    ? "border-green-200 bg-green-50/50"
                    : isActive
                    ? "border-[#0A6CD0] bg-white shadow-md ring-1 ring-[#0A6CD0]/20"
                    : "border-stone-100 bg-stone-50/50 opacity-70"
                }`}
              >
                <div className="flex gap-3">
                  <div
                    className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-black ${
                      isDone
                        ? "bg-green-500 text-white"
                        : isActive
                        ? "bg-[#0A6CD0] text-white"
                        : "bg-stone-200 text-stone-500"
                    }`}
                  >
                    {isDone ? <CheckCircleIcon className="w-5 h-5" /> : step.id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-stone-900 leading-snug">{step.title}</p>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">{step.desc}</p>
                    {step.tip && (
                      <p className="text-[11px] text-[#0A6CD0] mt-1.5 bg-[#F0F7FF] rounded-lg px-2 py-1">
                        💡 {step.tip}
                      </p>
                    )}
                    {isActive && step.visual === "share" && <ShareButtonMockup />}
                    {isActive && step.visual === "add-home" && <AddHomeMockup />}
                    {isActive && step.visual === "launch" && <LaunchMockup />}
                  </div>
                </div>

                {isActive && !isDone && (
                  <button
                    type="button"
                    onClick={() => markDone(step.id)}
                    className="mt-3 w-full py-2.5 rounded-xl bg-[#0A6CD0] hover:bg-[#0851A8] text-white text-sm font-bold transition-colors"
                  >
                    ✓ 我完成了，下一步
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="border-t border-stone-100 px-4 py-3 bg-stone-50/80">
          {isStandalonePWA() ? (
            <div className="text-center">
              <p className="text-sm font-bold text-green-700">✅ 您已從主畫面 App 開啟！</p>
              <p className="text-xs text-stone-600 mt-1">請登入後點上方「開啟流量提醒通知」</p>
            </div>
          ) : allDone ? (
            <div className="text-center">
              <p className="text-sm font-bold text-[#0A6CD0]">請從主畫面 Jeko 圖示重新開啟本站</p>
              <p className="text-xs text-stone-500 mt-1">關閉 Safari 分頁，改點主畫面 App</p>
            </div>
          ) : (
            <p className="text-[11px] text-stone-500 text-center">
              每完成一步請按「我完成了」；全部做完後從主畫面開啟
            </p>
          )}

          <button
            type="button"
            onClick={() => setFaqOpen(!faqOpen)}
            className="mt-2 w-full flex items-center justify-center gap-1 text-xs text-stone-500 hover:text-[#0A6CD0]"
          >
            找不到按鈕？常見問題
            {faqOpen ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
          </button>

          {faqOpen && (
            <div className="mt-2 space-y-2 text-[11px] text-stone-600 bg-white rounded-lg p-3 border border-stone-100">
              <p><strong>Q：沒有「分享」按鈕？</strong><br />請用 Safari 開啟，網址列要在螢幕下方（iOS 15+ 預設位置）</p>
              <p><strong>Q：沒有「加入主畫面」？</strong><br />在分享選單中繼續往下滑；或點「編輯動作」把它加進常用</p>
              <p><strong>Q：加了主畫面還是不行？</strong><br />請確認是點主畫面圖示開啟，不是從 Safari 書籤進入</p>
              <p><strong>Q：可以用 Chrome 嗎？</strong><br />iPhone 上請用 Safari 加入主畫面；電腦請用 Chrome 直接訂閱</p>
            </div>
          )}

          <button
            type="button"
            onClick={resetGuide}
            className="mt-2 w-full text-[10px] text-stone-400 hover:text-stone-600"
          >
            重新開始教學
          </button>
        </div>
      </div>
    </div>
  );
}
