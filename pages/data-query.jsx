"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Layout from "./Layout";
import MaterialIcon from "@/components/MaterialIcon";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import PushNotificationSection from "@/components/PushNotificationSection";
import { ICCID_STORAGE_KEY, normalizeIccid } from "@/lib/pushBind";

/** 圖二參考設計：藍色圓角按鈕 */
function RefPillButton({
  children,
  type = "button",
  disabled,
  showArrow = true,
  className = "",
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`relative inline-flex items-center justify-center gap-2 bg-[#1d5cc5] hover:bg-[#174da8] disabled:opacity-60 text-white text-sm font-bold rounded-full px-6 py-2.5 transition-colors shadow-sm ${className}`}
      {...props}
    >
      {children}
      {showArrow && <MaterialIcon name="arrow_forward" size={18} />}
    </button>
  );
}

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
    icon: "smartphone",
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
    icon: "chat",
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
    icon: "sports_esports",
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
    icon: "map",
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
    icon: "language",
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
    icon: "music_note",
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
    icon: "play_circle",
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
    icon: "videocam",
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
    icon: "movie",
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
    icon: "live_tv",
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
  const [queryLoading, setQueryLoading] = useState(false);
  const [usageResult, setUsageResult] = useState(null);
  const [queryError, setQueryError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(ICCID_STORAGE_KEY);
    if (saved) setIccid(saved);
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    const value = normalizeIccid(iccid);
    if (!value) return alert("請輸入 ICCID");
    localStorage.setItem(ICCID_STORAGE_KEY, value);
    setQueryLoading(true);
    setQueryError("");
    setUsageResult(null);
    try {
      const res = await fetch("/api/esim/usage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ iccid: value }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.detail || "查詢失敗");
      setUsageResult(data);
    } catch (err) {
      setQueryError(err.message || "查詢失敗");
    } finally {
      setQueryLoading(false);
    }
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

          {/* ── 圖二風格：雙卡全幅圖 + 底部橫幅 ── */}
          <div className="space-y-5 mb-14">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* 查詢 eSIM 用量 */}
              <div
                id="query-section"
                className="relative rounded-3xl overflow-hidden min-h-[380px] md:min-h-[420px] flex flex-col"
              >
                <Image
                  src="/images/ece770c6-f71d-404e-a92a-756fc194e492.png"
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/20" />

                <div className="relative z-10 flex flex-col flex-1 p-7 md:p-8">
                  <span className="inline-flex self-start bg-[#F4596A] text-white text-[11px] font-bold px-3 py-1 rounded-md">
                    推薦
                  </span>

                  <div className="flex-1" />

                  <div className="max-w-[92%]">
                    <h2 className="text-[28px] md:text-[32px] font-bold text-white leading-tight tracking-tight">
                      查詢 eSIM 用量
                    </h2>
                    <p className="text-sm md:text-[15px] text-white/90 mt-3 leading-relaxed">
                      輸入 ICCID 即可查看剩餘流量與方案狀態，數據更新可能有 30
                      分鐘延遲。
                    </p>

                    <form onSubmit={handleSearch} className="mt-6 space-y-3">
                      <div className="flex items-center bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-sm max-w-md">
                        <MaterialIcon
                          name="description"
                          size={20}
                          className="text-stone-400 shrink-0 mr-3"
                        />
                        <input
                          type="text"
                          value={iccid}
                          onChange={(e) => setIccid(e.target.value)}
                          placeholder="輸入 ICCID（19～20 碼）"
                          className="flex-1 bg-transparent border-none outline-none text-stone-800 placeholder-stone-400 text-sm font-medium min-w-0"
                        />
                      </div>
                      <RefPillButton type="submit" disabled={queryLoading}>
                        {queryLoading ? "查詢中…" : "立即查詢"}
                      </RefPillButton>
                    </form>

                    {queryError && (
                      <p className="mt-3 text-sm text-red-300 flex items-center gap-1">
                        <MaterialIcon name="error" size={16} />
                        {queryError}
                      </p>
                    )}

                    {usageResult && (
                      <div className="mt-4 rounded-2xl bg-white/95 backdrop-blur-sm p-4 text-sm text-stone-800 max-w-md">
                        <p className="font-bold mb-2 flex items-center gap-2">
                          <MaterialIcon
                            name="analytics"
                            size={18}
                            className="text-[#1d5cc5]"
                          />
                          查詢結果
                        </p>
                        {usageResult.productName && (
                          <p>方案：{usageResult.productName}</p>
                        )}
                        {usageResult.remainingMb != null ? (
                          <p className="font-bold mt-1">
                            剩餘流量：約 {usageResult.remainingMb} MB
                            {usageResult.totalMb != null &&
                              ` / ${usageResult.totalMb} MB`}
                          </p>
                        ) : (
                          <p className="mt-1">{usageResult.note}</p>
                        )}
                        {usageResult.expiresAt && (
                          <p className="text-xs text-stone-500 mt-1">
                            有效期限：{usageResult.expiresAt}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 充值方案 */}
              <div className="relative rounded-3xl overflow-hidden min-h-[480px] md:min-h-[520px] flex flex-col">
                <Image
                  src="/images/7bf7a01a-6740-4390-800c-566683623985.png"
                  alt=""
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-zinc-900/25" />

                <div className="relative z-10 flex flex-col flex-1 p-7 md:p-8">
                  <div className="flex-1" />

                  <div className="max-w-[92%]">
                    <h2 className="text-[28px] md:text-[32px] font-bold text-white leading-tight tracking-tight">
                      流量即將用盡？
                    </h2>
                    <p className="text-sm md:text-[15px] text-white/90 mt-3 leading-relaxed">
                      無需重新購買 eSIM，一鍵恢復原有流量，出國上網不中斷。
                    </p>
                    <button
                      type="button"
                      onClick={() => alert("此功能即將上線")}
                      className="inline-block mt-6"
                    >
                      <span className="relative inline-flex items-center justify-center gap-2 bg-[#1d5cc5] hover:bg-[#174da8] text-white text-sm font-bold rounded-full px-6 py-2.5 transition-colors shadow-sm">
                        前往充值方案
                        <MaterialIcon name="arrow_forward" size={18} />
                      </span>
                    </button>
                  </div>
                </div>

                <span
                  className="absolute top-[42%] right-[16%] w-3 h-3 rounded-full bg-amber-400 shadow-md z-10 pointer-events-none"
                  aria-hidden
                />
              </div>
            </div>

            {/* 圖二底部橫幅 */}
            <PushNotificationSection
              onIccidBound={(boundIccid) => setIccid(boundIccid)}
              initialIccid={iccid}
              variant="banner"
            />
          </div>

          {/* ── 注意事項橫幅（參照 Anker 禮品卡橫幅） ── */}
          <div className="bg-[#F5F5F5] rounded-2xl p-6 md:p-8 mb-14 flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="shrink-0 w-16 h-16 md:w-20 md:h-20 bg-[#0A6CD0] rounded-xl flex items-center justify-center shadow-md">
              <MaterialIcon
                name="signal_cellular_alt"
                size={36}
                className="text-white"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-lg md:text-xl font-black text-stone-900 mb-2">
                查詢前請注意
              </h3>
              <ul className="text-[13px] md:text-sm text-stone-600 space-y-1.5 leading-relaxed">
                <li className="flex items-start gap-2">
                  <MaterialIcon
                    name="schedule"
                    size={16}
                    className="text-[#0A6CD0] shrink-0 mt-0.5"
                  />
                  所有時間顯示為台灣時間（UTC+8），每日方案重置時間依電信商而異
                </li>
                <li className="flex items-start gap-2">
                  <MaterialIcon
                    name="update"
                    size={16}
                    className="text-[#0A6CD0] shrink-0 mt-0.5"
                  />
                  流量數據非即時更新，通常延遲 30 分鐘至數小時
                </li>
                <li className="flex items-start gap-2">
                  <MaterialIcon
                    name="smartphone"
                    size={16}
                    className="text-[#0A6CD0] shrink-0 mt-0.5"
                  />
                  建議同時查看手機內建行動數據計算器以獲得最準確資訊
                </li>
              </ul>
            </div>
            <Link
              href="/support"
              className="shrink-0 inline-flex items-center gap-1 text-sm font-bold text-[#0A6CD0] hover:underline whitespace-nowrap"
            >
              查看常見問題
              <MaterialIcon name="arrow_forward" size={16} />
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
              以下為各方案在不同使用情境下的預估可用時間，實際用量因 App
              設定與畫質而異
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
                          <MaterialIcon
                            name={row.icon}
                            size={20}
                            className="text-[#0A6CD0] shrink-0 mt-0.5"
                          />
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
                                <MaterialIcon
                                  name="check_circle"
                                  size={20}
                                  filled
                                  className="text-[#FF8C00]"
                                />
                              ) : (
                                <MaterialIcon
                                  name="cancel"
                                  size={20}
                                  className="text-stone-400"
                                />
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
                            <MaterialIcon
                              name={row.icon}
                              size={18}
                              className="text-[#0A6CD0] shrink-0"
                            />
                            <span className="text-[13px] font-medium text-stone-700 truncate">
                              {row.activity}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {val.ok ? (
                              <MaterialIcon
                                name="check_circle"
                                size={16}
                                filled
                                className="text-[#FF8C00]"
                              />
                            ) : (
                              <MaterialIcon
                                name="cancel"
                                size={16}
                                className="text-stone-300"
                              />
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
                  icon: "offline_pin",
                  title: "離線地圖",
                  desc: "出發前用 Wi-Fi 下載 Google Maps 離線地圖，導航幾乎不耗流量",
                },
                {
                  icon: "play_disabled",
                  title: "關閉自動播放",
                  desc: "在 IG、Facebook 設定中關閉 Reels 自動播放，可省下 50% 以上流量",
                },
                {
                  icon: "hd",
                  title: "降低串流畫質",
                  desc: "YouTube / Netflix 調至 480p，5GB 可多看 2~3 倍影片",
                },
              ].map((tip) => (
                <div
                  key={tip.title}
                  className="bg-[#F8FAFC] rounded-xl p-5 border border-stone-100"
                >
                  <div className="mb-2">
                    <MaterialIcon
                      name={tip.icon}
                      size={24}
                      className="text-[#0A6CD0]"
                    />
                  </div>
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
              業者公開資料。實際用量受 App
              版本、畫質設定、背景更新等因素影響，僅供旅遊規劃參考。
            </p>
          </section>
        </motion.div>
      </div>
    </Layout>
  );
}
