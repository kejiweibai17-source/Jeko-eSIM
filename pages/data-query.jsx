"use client";

import React, { useState } from "react";
import Link from "next/link";
import Layout from "./Layout";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  MagnifyingGlassIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  XCircleIcon,
  SignalIcon,
  MapPinIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleSolid } from "@heroicons/react/24/solid";
import PushButton from "@/components/PushButton";

/* ── 流量對照資料（參考 Yesim / Saily / Monito 業界估算） ── */
const DATA_PLANS = [
  { key: "1gb", label: "1 GB", sub: "輕量旅遊", highlight: false },
  { key: "3gb", label: "3 GB", sub: "一般旅遊", highlight: false },
  { key: "5gb", label: "5 GB", sub: "熱門方案", highlight: true },
  { key: "10gb", label: "10 GB", sub: "深度旅遊", highlight: false },
];

const USAGE_ROWS = [
  {
    activity: "Facebook / Instagram 瀏覽",
    icon: "📱",
    note: "約 120 MB／小時",
    values: {
      "1gb": { text: "約 8 小時", ok: true },
      "3gb": { text: "約 25 小時", ok: true },
      "5gb": { text: "約 42 小時", ok: true },
      "10gb": { text: "約 85 小時", ok: true },
    },
  },
  {
    activity: "Line / WhatsApp 文字訊息",
    icon: "💬",
    note: "約 20 MB／小時",
    values: {
      "1gb": { text: "約 50 小時", ok: true },
      "3gb": { text: "約 150 小時", ok: true },
      "5gb": { text: "約 250 小時", ok: true },
      "10gb": { text: "約 500 小時", ok: true },
    },
  },
  {
    activity: "手機線上遊戲",
    icon: "🎮",
    note: "約 100 MB／小時",
    values: {
      "1gb": { text: "約 10 小時", ok: true },
      "3gb": { text: "約 30 小時", ok: true },
      "5gb": { text: "約 51 小時", ok: true },
      "10gb": { text: "約 100 小時", ok: true },
    },
  },
  {
    activity: "Google Maps 導航",
    icon: "🗺️",
    note: "約 80 MB／小時",
    values: {
      "1gb": { text: "約 12 小時", ok: true },
      "3gb": { text: "約 38 小時", ok: true },
      "5gb": { text: "約 64 小時", ok: true },
      "10gb": { text: "約 128 小時", ok: true },
    },
  },
  {
    activity: "一般網頁瀏覽",
    icon: "🌐",
    note: "約 100 MB／小時",
    values: {
      "1gb": { text: "約 10 小時", ok: true },
      "3gb": { text: "約 30 小時", ok: true },
      "5gb": { text: "約 51 小時", ok: true },
      "10gb": { text: "約 100 小時", ok: true },
    },
  },
  {
    activity: "Spotify / 音樂串流",
    icon: "🎵",
    note: "約 40 MB／小時",
    values: {
      "1gb": { text: "約 25 小時", ok: true },
      "3gb": { text: "約 75 小時", ok: true },
      "5gb": { text: "約 128 小時", ok: true },
      "10gb": { text: "約 256 小時", ok: true },
    },
  },
  {
    activity: "YouTube 標準畫質",
    icon: "▶️",
    note: "約 500 MB／小時",
    values: {
      "1gb": { text: "約 2 小時", ok: false },
      "3gb": { text: "約 6 小時", ok: true },
      "5gb": { text: "約 10 小時", ok: true },
      "10gb": { text: "約 20 小時", ok: true },
    },
  },
  {
    activity: "WhatsApp / FaceTime 視訊",
    icon: "📹",
    note: "約 300 MB／小時",
    values: {
      "1gb": { text: "約 3 小時", ok: false },
      "3gb": { text: "約 10 小時", ok: true },
      "5gb": { text: "約 17 小時", ok: true },
      "10gb": { text: "約 34 小時", ok: true },
    },
  },
  {
    activity: "TikTok / Reels 短影音",
    icon: "🎬",
    note: "約 700 MB／小時",
    values: {
      "1gb": { text: "約 1.5 小時", ok: false },
      "3gb": { text: "約 4 小時", ok: false },
      "5gb": { text: "約 7 小時", ok: true },
      "10gb": { text: "約 14 小時", ok: true },
    },
  },
  {
    activity: "Netflix HD 串流",
    icon: "🎥",
    note: "約 3 GB／小時",
    values: {
      "1gb": { text: "不足 1 小時", ok: false },
      "3gb": { text: "約 1 小時", ok: false },
      "5gb": { text: "約 1.5 小時", ok: false },
      "10gb": { text: "約 3 小時", ok: false },
    },
  },
];

const HOW_IT_WORKS = [
  {
    step: "Step 1",
    title: "輸入 ICCID",
    desc: "在電子郵件或 eSIM 設定中找到 19~20 碼的 ICCID 號碼，貼上即可查詢。",
    link: "#query-section",
    linkText: "立即查詢 >>",
  },
  {
    step: "Step 2",
    title: "查看剩餘流量",
    desc: "系統顯示已用／剩餘流量、有效期限與每日重置時間（如有）。數據更新可能有 30 分鐘延遲。",
    link: "#usage-table",
    linkText: "了解用量估算 >>",
  },
  {
    step: "Step 3",
    title: "一鍵恢復流量",
    desc: "流量即將用盡？無需重新購買 eSIM，直接充值即可讓原有方案瞬間恢復上網。",
    link: "/product",
    linkText: "前往充值 >>",
  },
];

export default function DataQueryPage() {
  const [iccid, setIccid] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (!iccid.trim()) return alert("請輸入 ICCID");
    console.log("查詢 ICCID:", iccid);
    alert(`查詢功能開發中，ICCID：${iccid.trim()}`);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-white pt-24 pb-20 font-sans">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-[1100px] w-[92%] mx-auto"
        >
          {/* ── 頁面標題 ── */}
          <h1 className="text-[28px] md:text-[36px] font-black text-stone-900 mb-10 tracking-tight">
            流量用量指南
          </h1>

          {/* ── 雙卡方案區（參照 Anker Benefits Comparison 頂部卡片） ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-14">
            {/* 查詢卡片 */}
            <div
              id="query-section"
              className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#FFF8ED] via-[#FFF3DC] to-[#FFE8B8] p-7 md:p-8 flex flex-col min-h-[280px]"
            >
              <span className="inline-flex self-start bg-[#F4596A] text-white text-[11px] font-bold px-3 py-1 rounded-md mb-4">
                推薦
              </span>
              <h2 className="text-[22px] md:text-[26px] font-black text-stone-900 mb-1">
                查詢 eSIM 用量
              </h2>
              <p className="text-sm text-stone-600 mb-6">
                輸入 ICCID 即可查看剩餘流量
              </p>

              <form onSubmit={handleSearch} className="mt-auto space-y-3">
                <div className="flex items-center bg-white rounded-xl border border-stone-200 px-4 py-3 shadow-sm">
                  <DocumentTextIcon className="w-5 h-5 text-stone-400 shrink-0 mr-3" />
                  <input
                    type="text"
                    value={iccid}
                    onChange={(e) => setIccid(e.target.value)}
                    placeholder="輸入 ICCID（19~20 碼）"
                    className="flex-1 bg-transparent border-none outline-none text-stone-800 placeholder-stone-400 text-sm font-medium"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-stone-900 hover:bg-stone-800 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <MagnifyingGlassIcon className="w-5 h-5" />
                  立即查詢
                </button>
              </form>

              <div className="absolute -bottom-6 -right-6 w-32 h-32 opacity-[0.08] pointer-events-none select-none text-[120px] leading-none">
                📶
              </div>
            </div>

            {/* 充值卡片 */}
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#FFF8ED] via-[#FFF3DC] to-[#FFE8B8] p-7 md:p-8 flex flex-col min-h-[280px]">
              <h2 className="text-[22px] md:text-[26px] font-black text-stone-900 mb-1 mt-7">
                流量即將用盡？
              </h2>
              <p className="text-sm text-stone-600 mb-2">
                無需重新購買，一鍵恢復原有 eSIM 流量
              </p>
              <p className="text-[40px] md:text-[48px] font-black text-stone-900 tracking-tight mb-6">
                充值
              </p>
              <Link
                href="/product"
                className="mt-auto w-full bg-stone-900 hover:bg-stone-800 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-center"
              >
                <ArrowPathIcon className="w-5 h-5" />
                前往充值方案
              </Link>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 opacity-[0.08] pointer-events-none select-none text-[120px] leading-none">
                ⚡
              </div>
            </div>
          </div>

          {/* ── 推播訂閱 ── */}
          <div className="mb-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#F0F7FF] border border-[#0A6CD0]/20 rounded-2xl px-6 py-5">
            <div>
              <p className="font-black text-stone-900 text-sm">流量快用完時通知我</p>
              <p className="text-xs text-stone-500 mt-1">
                登入後開啟推播，剩餘流量不足時會收到提醒（電腦 Chrome 不需安裝 PWA）
              </p>
            </div>
            <PushButton className="shrink-0" />
          </div>

          {/* ── 注意事項橫幅（參照 Anker 禮品卡橫幅） ── */}
          <div className="bg-[#F5F5F5] rounded-2xl p-6 md:p-8 mb-14 flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="shrink-0 w-16 h-16 md:w-20 md:h-20 bg-[#0A6CD0] rounded-xl flex items-center justify-center shadow-md">
              <SignalIcon className="w-9 h-9 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg md:text-xl font-black text-stone-900 mb-2">
                查詢前請注意
              </h3>
              <ul className="text-[13px] md:text-sm text-stone-600 space-y-1.5 leading-relaxed">
                <li>• 所有時間顯示為台灣時間（UTC+8），每日方案重置時間依電信商而異</li>
                <li>• 流量數據非即時更新，通常延遲 30 分鐘至數小時</li>
                <li>• 建議同時查看手機內建行動數據計算器以獲得最準確資訊</li>
              </ul>
            </div>
            <Link
              href="/support"
              className="shrink-0 text-sm font-bold text-[#0A6CD0] hover:underline whitespace-nowrap"
            >
              查看常見問題 →
            </Link>
          </div>

          {/* ── How It Works 三步驟 ── */}
          <section className="mb-16">
            <h2 className="text-[22px] md:text-[28px] font-black text-stone-900 mb-8">
              如何使用
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {HOW_IT_WORKS.map((item) => (
                <div key={item.step} className="relative">
                  <span className="inline-block bg-[#FF8C00] text-white text-[11px] font-bold px-2.5 py-0.5 rounded mb-3">
                    {item.step}
                  </span>
                  <h3 className="text-lg font-black text-stone-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-stone-600 leading-relaxed mb-4">
                    {item.desc}
                  </p>
                  <Link
                    href={item.link}
                    className="text-sm font-bold text-stone-900 hover:text-[#0A6CD0] transition-colors"
                  >
                    {item.linkText}
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* ── 流量對照表（參照 Anker Benefits Comparison 表格） ── */}
          <section id="usage-table">
            <h2 className="text-[22px] md:text-[28px] font-black text-stone-900 mb-2">
              流量用量對照表
            </h2>
            <p className="text-sm text-stone-500 mb-8">
              以下為各方案在不同使用情境下的預估可用時間，實際用量因 App 設定與畫質而異
            </p>

            {/* 桌面版表格 */}
            <div className="hidden md:block overflow-x-auto rounded-2xl border border-stone-200">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr>
                    <th className="text-left p-4 bg-stone-50 font-bold text-stone-700 border-b border-stone-200 w-[28%]">
                      使用情境
                    </th>
                    {DATA_PLANS.map((plan) => (
                      <th
                        key={plan.key}
                        className={cn(
                          "p-4 font-black border-b border-stone-200 text-center",
                          plan.highlight
                            ? "bg-[#FF8C00] text-white"
                            : "bg-stone-50 text-stone-700",
                        )}
                      >
                        <div>{plan.label}</div>
                        <div
                          className={cn(
                            "text-[11px] font-normal mt-0.5",
                            plan.highlight ? "text-white/80" : "text-stone-400",
                          )}
                        >
                          {plan.sub}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {USAGE_ROWS.map((row, idx) => (
                    <tr
                      key={row.activity}
                      className={idx % 2 === 0 ? "bg-white" : "bg-stone-50/60"}
                    >
                      <td className="p-4 border-b border-stone-100">
                        <div className="flex items-start gap-2">
                          <span className="text-lg leading-none mt-0.5">
                            {row.icon}
                          </span>
                          <div>
                            <div className="font-bold text-stone-800">
                              {row.activity}
                            </div>
                            <div className="text-[11px] text-stone-400 mt-0.5">
                              {row.note}
                            </div>
                          </div>
                        </div>
                      </td>
                      {DATA_PLANS.map((plan) => {
                        const val = row.values[plan.key];
                        return (
                          <td
                            key={plan.key}
                            className={cn(
                              "p-4 border-b border-stone-100 text-center",
                              plan.highlight && "bg-[#FFF8ED]/60",
                            )}
                          >
                            <div className="flex flex-col items-center gap-1">
                              {val.ok ? (
                                <CheckCircleSolid className="w-5 h-5 text-[#FF8C00]" />
                              ) : (
                                <XCircleIcon className="w-5 h-5 text-stone-400" />
                              )}
                              <span
                                className={cn(
                                  "font-bold text-[13px]",
                                  val.ok ? "text-stone-800" : "text-stone-400",
                                )}
                              >
                                {val.text}
                              </span>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 手機版卡片 */}
            <div className="md:hidden space-y-4">
              {DATA_PLANS.map((plan) => (
                <div
                  key={plan.key}
                  className={cn(
                    "rounded-2xl border overflow-hidden",
                    plan.highlight
                      ? "border-[#FF8C00] shadow-md"
                      : "border-stone-200",
                  )}
                >
                  <div
                    className={cn(
                      "px-5 py-3 font-black flex items-center justify-between",
                      plan.highlight
                        ? "bg-[#FF8C00] text-white"
                        : "bg-stone-50 text-stone-800",
                    )}
                  >
                    <span>{plan.label}</span>
                    <span
                      className={cn(
                        "text-xs font-normal",
                        plan.highlight ? "text-white/80" : "text-stone-400",
                      )}
                    >
                      {plan.sub}
                    </span>
                  </div>
                  <div className="divide-y divide-stone-100">
                    {USAGE_ROWS.map((row) => {
                      const val = row.values[plan.key];
                      return (
                        <div
                          key={row.activity}
                          className="px-5 py-3 flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span>{row.icon}</span>
                            <span className="text-[13px] font-medium text-stone-700 truncate">
                              {row.activity}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {val.ok ? (
                              <CheckCircleSolid className="w-4 h-4 text-[#FF8C00]" />
                            ) : (
                              <XCircleIcon className="w-4 h-4 text-stone-300" />
                            )}
                            <span
                              className={cn(
                                "text-[13px] font-bold",
                                val.ok ? "text-stone-800" : "text-stone-400",
                              )}
                            >
                              {val.text}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* 省流量小撇步 */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  icon: <MapPinIcon className="w-6 h-6 text-[#0A6CD0]" />,
                  title: "離線地圖",
                  desc: "出發前用 Wi-Fi 下載 Google Maps 離線地圖，導航幾乎不耗流量",
                },
                {
                  icon: <ChatBubbleLeftRightIcon className="w-6 h-6 text-[#0A6CD0]" />,
                  title: "關閉自動播放",
                  desc: "在 IG、Facebook 設定中關閉 Reels 自動播放，可省下 50% 以上流量",
                },
                {
                  icon: <SignalIcon className="w-6 h-6 text-[#0A6CD0]" />,
                  title: "降低串流畫質",
                  desc: "YouTube / Netflix 調至 480p，5GB 可多看 2~3 倍影片",
                },
              ].map((tip) => (
                <div
                  key={tip.title}
                  className="bg-[#F8FAFC] rounded-xl p-5 border border-stone-100"
                >
                  <div className="mb-2">{tip.icon}</div>
                  <h4 className="font-black text-stone-800 text-sm mb-1">
                    {tip.title}
                  </h4>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    {tip.desc}
                  </p>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-stone-400 mt-6 leading-relaxed">
              * 以上數據為業界平均估算值，參考 Yesim、Saily、Monito 等 eSIM
              業者公開資料。實際用量受 App 版本、畫質設定、背景更新等因素影響，僅供旅遊規劃參考。
            </p>
          </section>
        </motion.div>
      </div>
    </Layout>
  );
}
