"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

/** 國家 Tab（之後可改由 CMS / 聯盟 API 提供） */
const COUNTRY_TABS = [
  { id: "all", label: "全部" },
  { id: "japan", label: "日本" },
  { id: "korea", label: "韓國" },
  { id: "malaysia", label: "馬來西亞" },
  { id: "thailand", label: "泰國" },
];

/**
 * 假資料 — 之後可替換為聯盟行銷 API / 後台 CMS
 * affiliateUrl: 聯盟導購連結（目前用 #）
 */
const ACCOMMODATIONS = [
  {
    id: "jp-1",
    countryId: "japan",
    regionLabel: "東京・新宿",
    badge: "聯盟優惠",
    subtitle: "商務飯店・近車站",
    title: "新宿格拉斯麗飯店",
    pricePerNight: 3200,
    capacityLabel: "2人房",
    footer: "評價 4.8 · 免費取消",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
    affiliateUrl: "#",
  },
  {
    id: "jp-2",
    countryId: "japan",
    regionLabel: "大阪",
    badge: "熱銷",
    subtitle: "公寓式酒店・心齋橋",
    title: "心齋橋精品公寓",
    pricePerNight: 2800,
    capacityLabel: "4人房",
    footer: "評價 4.6 · 含廚房",
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80",
    affiliateUrl: "#",
  },
  {
    id: "jp-3",
    countryId: "japan",
    regionLabel: "京都",
    subtitle: "傳統旅館・祇園",
    title: "祇園花見小路旅館",
    pricePerNight: 4500,
    capacityLabel: "2人房",
    footer: "評價 4.9 · 含早餐",
    image:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80",
    affiliateUrl: "#",
  },
  {
    id: "jp-4",
    countryId: "japan",
    regionLabel: "北海道・札幌",
    badge: "限定",
    subtitle: "溫泉飯店",
    title: "札幌定山溪溫泉旅館",
    pricePerNight: 5200,
    capacityLabel: "2人房",
    footer: "評價 4.7 · 含溫泉",
    image:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80",
    affiliateUrl: "#",
  },
  {
    id: "kr-1",
    countryId: "korea",
    regionLabel: "首爾・明洞",
    badge: "聯盟優惠",
    subtitle: "精品飯店",
    title: "明洞中心酒店",
    pricePerNight: 2900,
    capacityLabel: "2人房",
    footer: "評價 4.5 · 近地鐵",
    image:
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80",
    affiliateUrl: "#",
  },
  {
    id: "kr-2",
    countryId: "korea",
    regionLabel: "釜山・海雲台",
    subtitle: "海景度假村",
    title: "海雲台海景套房",
    pricePerNight: 3800,
    capacityLabel: "3人房",
    footer: "評價 4.8 · 海景陽台",
    image:
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&q=80",
    affiliateUrl: "#",
  },
  {
    id: "my-1",
    countryId: "malaysia",
    regionLabel: "吉隆坡",
    badge: "熱銷",
    subtitle: "城市酒店・雙子星塔",
    title: "KLCC 景觀酒店",
    pricePerNight: 2100,
    capacityLabel: "2人房",
    footer: "評價 4.4 · 含早餐",
    image:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80",
    affiliateUrl: "#",
  },
  {
    id: "my-2",
    countryId: "malaysia",
    regionLabel: "檳城",
    subtitle: "文化古城・喬治市",
    title: "喬治市精品民宿",
    pricePerNight: 1600,
    capacityLabel: "2人房",
    footer: "評價 4.7 · 步行老街",
    image:
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600&q=80",
    affiliateUrl: "#",
  },
  {
    id: "th-1",
    countryId: "thailand",
    regionLabel: "曼谷",
    badge: "聯盟優惠",
    subtitle: "河畔精品酒店",
    title: "昭披耶河畔度假村",
    pricePerNight: 2400,
    capacityLabel: "2人房",
    footer: "評價 4.6 · 泳池",
    image:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80",
    affiliateUrl: "#",
  },
  {
    id: "th-2",
    countryId: "thailand",
    regionLabel: "清邁",
    subtitle: "古城周邊・泳池別墅",
    title: "清邁古城泳池別墅",
    pricePerNight: 1900,
    capacityLabel: "4人房",
    footer: "評價 4.8 · 含機場接送",
    image:
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&q=80",
    affiliateUrl: "#",
  },
];

const PREVIEW_COUNT = 4;

function AccommodationCard({ item }) {
  return (
    <a
      href={item.affiliateUrl}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="group flex flex-col bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-md hover:border-[#0A6CD0]/25 transition-all duration-200 overflow-hidden h-full"
    >
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
        />
        <span className="absolute top-2.5 left-2.5 rounded-md bg-black/85 px-2 py-0.5 text-[10px] font-bold text-white">
          {item.regionLabel}
        </span>
        {item.badge && (
          <span className="absolute top-2.5 right-2.5 rounded-md bg-[#0A6CD0] px-2 py-0.5 text-[10px] font-bold text-white">
            {item.badge}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col px-4 pt-3.5 pb-4">
        <p className="text-[11px] text-gray-400 line-clamp-1">
          {item.subtitle}
        </p>
        <h3 className="mt-1 text-[15px] font-black text-gray-900 leading-snug line-clamp-2 min-h-[2.5rem]">
          {item.title}
        </h3>

        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FFD43A] text-[9px] font-black text-slate-800">
              NT
            </span>
            <div className="flex items-baseline gap-0.5 min-w-0">
              <span className="text-[10px] text-gray-500">NT$</span>
              <span className="text-lg font-black text-gray-900">
                {item.pricePerNight.toLocaleString("zh-TW")}
              </span>
              <span className="text-[10px] text-gray-400">/晚</span>
            </div>
          </div>
          <span className="shrink-0 rounded-full bg-[#0A6CD0] px-2.5 py-0.5 text-[10px] font-bold text-white">
            {item.capacityLabel}
          </span>
        </div>

        <div className="mt-3 border-t border-gray-100 pt-2.5">
          <p className="text-[10px] text-gray-400 line-clamp-1">
            {item.footer}
          </p>
        </div>
      </div>
    </a>
  );
}

export default function AccommodationRecommendSection() {
  const [activeTab, setActiveTab] = useState("all");

  const filtered = useMemo(() => {
    if (activeTab === "all") return ACCOMMODATIONS;
    return ACCOMMODATIONS.filter((item) => item.countryId === activeTab);
  }, [activeTab]);

  const displayItems = filtered.slice(0, PREVIEW_COUNT);

  return (
    <section className="w-full bg-[#f0f1f3] pb-12 lg:pb-16 pt-4">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* 標題列（參考抽選會場版型） */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-baseline gap-3">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              住宿推薦
            </h2>
          </div>
        </div>

        {/* 國家 Tab */}
        <div className="flex flex-wrap gap-2 mb-8">
          {COUNTRY_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={[
                "rounded-full px-4 py-2 text-sm font-bold transition-all duration-200",
                activeTab === tab.id
                  ? "bg-gray-900 text-white shadow-sm"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:text-gray-900",
              ].join(" ")}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 卡片網格 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5"
          >
            {displayItems.length > 0 ? (
              displayItems.map((item) => (
                <AccommodationCard key={item.id} item={item} />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500 py-12 text-sm">
                此國家暫無推薦住宿，敬請期待合作上架
              </p>
            )}
          </motion.div>
        </AnimatePresence>

        {/* 查看更多 */}
        <div className="mt-10 flex justify-center">
          <Link
            href="/product"
            className="inline-flex items-center justify-center min-w-[200px] px-10 py-3.5 rounded-xl bg-[#0A6CD0] text-white text-sm font-bold shadow-md hover:bg-[#095bb8] transition-colors"
          >
            查看更多
          </Link>
        </div>

        <p className="mt-4 text-center text-[11px] text-gray-400 max-w-lg mx-auto leading-relaxed">
          聯盟行銷連結，點擊將導向合作平台預訂。
        </p>
      </div>
    </section>
  );
}
