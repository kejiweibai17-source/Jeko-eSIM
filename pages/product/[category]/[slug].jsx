"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/router";
import { useCart } from "../../../components/context/CartContext";
import Layout from "../../Layout";
import { buildProductSeo } from "../../../lib/seo.config";
import {
  resolveOverviewNotices,
  parseOverviewNoticesByCarrier,
} from "../../../lib/productOverviewNotices";
import {
  resolveDetailedContent,
  parseDetailedContentByCarrier,
} from "../../../lib/productDetailedContent";
import { useUser } from "../../../components/context/UserContext";
import MaterialIcon from "../../../components/MaterialIcon";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { motion, AnimatePresence } from "framer-motion";
import "swiper/css";
import "swiper/css/navigation";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import DOMPurify from "isomorphic-dompurify";
import "react-quill/dist/quill.snow.css";
import {
  buildProductRichTextHtml,
  sanitizeProductRichTextHtml,
  PRODUCT_RICH_LINK_CLASS,
} from "../../../lib/productRichText";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
ChartJS.register(ArcElement, Tooltip, Legend);

// 🚀 Supabase (用於評論系統與圖片上傳)
import { supabase } from "../../../lib/supabaseClient";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

// ==========================================
// 1. 靜態資料設定
// ==========================================
const COMPATIBLE_DEVICES = [
  {
    category: "支援 eSIM 的蘋果 iPhone",
    items: [
      "iPhone 16 / 16 Plus / 16 Pro / 16 Pro Max",
      "iPhone 15 / 15 Plus / 15 Pro / 15 Pro Max",
      "iPhone 14 / 14 Plus / 14 Pro / 14 Pro Max",
      "iPhone 13 / 13 Mini / 13 Pro / 13 Pro Max",
      "iPhone 12 / 12 Mini / 12 Pro / 12 Pro Max",
      "iPhone 11 / 11 Pro / 11 Pro Max",
      "iPhone XS / XS Max / XR",
      "iPhone SE (2020 / 2022)",
    ],
  },
  {
    category: "相容 eSIM 的 iPad (Wi-Fi + 行動網路)",
    items: [
      "iPad Pro 13 吋 (M4)",
      "iPad Pro 11 吋 (第一代至第四代)",
      "iPad Pro 12.9 吋 (第三代至第六代)",
      "iPad Air (第三代至第六代)",
      "iPad Mini (第五代、第六代)",
      "iPad (第七代至第十代)",
    ],
  },
  {
    category: "Google Pixel 支援 eSIM 的手機",
    items: [
      "Pixel 9 / 9 Pro / 9 Pro XL / 9 Pro Fold",
      "Pixel 8 / 8 Pro / 8a",
      "Pixel 7 / 7 Pro / 7a",
      "Pixel 6 / 6 Pro / 6a",
      "Pixel 5 / 5a",
      "Pixel 4 / 4a / 4 XL",
    ],
  },
  {
    category: "具備 eSIM 功能的三星手機",
    items: [
      "Galaxy S24 / S24+ / S24 Ultra",
      "Galaxy S23 / S23+ / S23 Ultra",
      "Galaxy S22 / S22+ / S22 Ultra",
      "Galaxy S21 / S21+ / S21 Ultra",
      "Galaxy S20 / S20+ / S20 Ultra",
      "Galaxy Z Flip (全系列)",
      "Galaxy Z Fold (全系列)",
    ],
  },
  {
    category: "其他支援 eSIM 的手機裝置",
    items: [
      "Sony Xperia 1 IV / 5 IV / 10 IV",
      "Sony Xperia 1 V / 5 V / 10 V",
      "Sharp Aquos Sense 4 lite / Sense 6",
      "Oppo Find X3 Pro / X5 / X5 Pro",
      "Xiaomi 12T Pro / 13 / 13 Pro",
    ],
  },
];

const CARRIER_INFO_MAP = {
  "SoftBank / KDDI": {
    badges: [
      { text: "KDDI", type: "5G" },
      { text: "SoftBank", type: "5G" },
    ],
    marketingBox: {
      bgColor: "bg-cyan-50",
      borderColor: "border-cyan-100",
      couponText: "這款 eSIM 加碼 5% 折扣！使用折扣碼：Hello26",
      policyTitle: "公平使用政策 (FUP):",
      policyDesc:
        "每日高速數據用完後，降速至 5Mbps 吃到飽 (高速數據每24小時重置)。",
      note: "注意：我們建議您抵達當地後再安裝 eSIM。",
    },
    summaryPrefix: "SoftBank / KDDI",
  },
  "AU(KDDI)": {
    badges: [{ text: "KDDI", type: "5G" }],
    marketingBox: {
      bgColor: "bg-cyan-50",
      borderColor: "border-cyan-100",
      couponText: "這款 eSIM 加碼 5% 折扣！使用折扣碼：Hello26",
      policyTitle: "公平使用政策 (FUP):",
      policyDesc: "無限流量，平均速度8~20Mbps。",
      note: "注意：我們建議您抵達後再新增 eSIM。查看啟用政策。",
    },
    summaryPrefix: "AU(KDDI)",
  },
  "IIJ Docomo": {
    badges: [{ text: "Docomo", type: "4G/LTE" }],
    marketingBox: {
      bgColor: "bg-red-50",
      borderColor: "border-red-100",
      couponText: "支援 TikTok / Netflix 跨區解鎖",
      policyTitle: "流量規範:",
      policyDesc: "本方案為原生日網，支援多數日本限定服務。",
      note: "注意：此線路為日本 IP。",
    },
    summaryPrefix: "IIJ Docomo",
  },
  default: {
    badges: [],
    marketingBox: {
      bgColor: "bg-gray-50",
      borderColor: "border-gray-100",
      couponText: "請選擇電信商以查看詳細規格",
      policyTitle: "說明:",
      policyDesc: "不同電信商擁有不同的流量公平使用原則 (FUP)。",
      note: "",
    },
    summaryPrefix: "eSIM",
  },
};

const CARRIER_SPECS_DATA = {
  "SoftBank / KDDI": [
    {
      label: "訊號覆蓋範圍",
      value: "東京、京都、廣島、關東、長崎、大阪等日本各城市及旅遊目的地。",
    },
    { label: "電信業者", value: "KDDI (5G) / Softbank (5G)" },
    { label: "速度", value: "4G / LTE / 5G" },
    { label: "方案類型", value: "僅數據流量" },
    { label: "網路共用 / 熱點功能", value: "支持" },
    { label: "電話號碼", value: "無" },
    { label: "通話", value: "不支持，只能透過應用程式（網路通話，即 VoIP）。" },
    { label: "簡訊", value: "無" },
    { label: "eKYC (身分驗證)", value: "不需要" },
    {
      label: "效期政策",
      value:
        "一旦 eSIM 連接到支援的網路並開始產生數據訪問互聯網，有效期即開始。我們建議您在到達目的地後添加 eSIM。您可以提前安裝 eSIM，但請記得安裝後立即將其關閉，以避免有效期提前開始。",
      fullWidth: true,
    },
  ],
  "AU(KDDI)": [
    {
      label: "訊號覆蓋範圍",
      value: "東京、京都、廣島、關東、長崎、大阪等日本各城市及旅遊目的地。",
    },
    { label: "電信業者", value: "KDDI 5G" },

    { label: "速度", value: "4G / LTE / 5G" },
    { label: "方案類型", value: "僅數據流量" },
    { label: "網路共用／熱點功能", value: "支持" },
    { label: "通話", value: "不支持，只能透過應用程式（網路通話，即 VoIP）。" },
    {
      label: "效期政策",
      value:
        "一旦 eSIM 連接到支援的網路並開始產生數據訪問互聯網，有效期限即開始。我們建議您在到達目的地後添加 eSIM。",
      fullWidth: true,
    },
  ],
  "IIJ Docomo": [
    {
      label: "訊號覆蓋範圍",
      value: "東京、京都、廣島、關東、長崎、大阪等日本各城市及旅遊目的地。",
    },
    { label: "電信業者", value: "IIJ(Docomo) LTE" },
    { label: "速度", value: "4G / LTE" },
    { label: "方案類型", value: "僅數據流量" },
    {
      label: "效期政策",
      value:
        "有效期於eSIM下載到您的裝置後立即開始計算。請在準備好使用時再安裝eSIM。",
      fullWidth: true,
    },
  ],
  default: [
    {
      label: "說明",
      value: "請選擇上方的電信商以查看詳細技術規格。",
      fullWidth: true,
    },
  ],
};

const stripHtml = (html) =>
  html ? html.replace(/<[^>]*>?/gm, "").substring(0, 160) + "..." : "";

const FEATURE_LINK_CLASS = PRODUCT_RICH_LINK_CLASS;

/** 重點特色 / 概覽說明：粗體 **文字**、連結 [文字](網址) */
const formatFeatureBulletHtml = (text) => {
  if (!text) return "";
  const raw = buildProductRichTextHtml(text, FEATURE_LINK_CLASS);
  return sanitizeProductRichTextHtml(raw, DOMPurify.sanitize);
};

function FeatureBulletText({ children, className = "" }) {
  const html = useMemo(() => formatFeatureBulletHtml(children), [children]);
  return (
    <div
      className={`feature-bullet-text ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/** 概覽分頁：FUP 資訊 + 啟用注意（後台 Medusa metadata 可編輯） */
function ProductOverviewNotices({ notices, carrierFallback }) {
  const fupText =
    notices?.fup_notice ||
    (carrierFallback?.policyTitle && carrierFallback?.policyDesc
      ? `${carrierFallback.policyTitle} ${carrierFallback.policyDesc}`
      : "");
  const activationText =
    notices?.activation_notice || carrierFallback?.note || "";

  if (!fupText && !activationText) return null;

  return (
    <div className="mt-4 space-y-3">
      {fupText && (
        <div className="flex gap-3 rounded-lg border border-slate-200 bg-sky-50/80 px-4 py-3.5 text-sm text-slate-700 leading-relaxed border-l-4 border-l-sky-500">
          <MaterialIcon
            name="info"
            size={20}
            className="text-sky-600 shrink-0 mt-0.5"
          />
          <FeatureBulletText className="flex-1 min-w-0">{fupText}</FeatureBulletText>
        </div>
      )}
      {activationText && (
        <div className="flex gap-3 rounded-lg border border-slate-200 bg-amber-50/90 px-4 py-3.5 text-sm text-slate-700 leading-relaxed border-l-4 border-l-amber-400">
          <MaterialIcon
            name="warning"
            size={20}
            className="text-amber-600 shrink-0 mt-0.5"
          />
          <FeatureBulletText className="flex-1 min-w-0">
            {activationText}
          </FeatureBulletText>
        </div>
      )}
    </div>
  );
}

/** 解析 Medusa metadata.key_features_by_carrier（JSON 字串或物件） */
const parseKeyFeaturesByCarrier = (raw) => {
  if (!raw) return null;
  if (typeof raw === "object" && !Array.isArray(raw)) {
    return Object.fromEntries(
      Object.entries(raw).map(([k, v]) => [
        k,
        Array.isArray(v) ? v.map(String).filter(Boolean) : [],
      ]),
    );
  }
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return Object.fromEntries(
          Object.entries(parsed).map(([k, v]) => [
            k,
            Array.isArray(v) ? v.map(String).filter(Boolean) : [],
          ]),
        );
      }
    } catch {
      /* ignore */
    }
  }
  return null;
};

/** 依 key 找電信商重點（忽略大小寫與前後空白） */
const findCarrierBullets = (fromMeta, carrierName) => {
  if (!fromMeta || !carrierName || carrierName === "default") return null;
  const carrier = String(carrierName).trim();
  if (fromMeta[carrier]?.length) return fromMeta[carrier];
  const key = Object.keys(fromMeta).find(
    (k) => k.trim().toLowerCase() === carrier.toLowerCase(),
  );
  return key && fromMeta[key]?.length ? fromMeta[key] : null;
};

/** 依電信商取得重點特色（僅讀 Medusa metadata，不寫死國家/電信商） */
const resolveIntroBullets = (product, carrierName) => {
  const fromMeta = parseKeyFeaturesByCarrier(product?.key_features_by_carrier);
  if (!fromMeta || !Object.keys(fromMeta).length) return [];
  const matched = findCarrierBullets(fromMeta, carrierName);
  if (matched?.length) return matched;
  if (fromMeta.default?.length) return fromMeta.default;
  return [];
};

const ANKER_BLUE = "#00befa";

const PRODUCT_SUB_NAV = [
  { id: "purchase", label: "購買", href: "#purchase-section" },
  { id: "overview", label: "概覽", href: "#product-tabs" },
  { id: "specs", label: "規格", href: "#product-specs" },
  { id: "comparison", label: "比較", href: "#product-comparison" },
  { id: "faq", label: "FAQ", href: "#product-faq" },
  { id: "reviews", label: "評論", href: "#product-reviews" },
];

function ProductStickyNav({ productName }) {
  return <div className=" "></div>;
}

const PRODUCT_GALLERY_LB_STYLE = `
  .product-main-swiper .swiper-slide {
    width: 100% !important;
    box-sizing: border-box;
  }
  .product-gallery-lb.swiper {
    width: 100%;
    height: 100%;
  }
  .product-gallery-lb .swiper-slide {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

function ProductImageLightbox({
  isOpen,
  onClose,
  images,
  productName,
  initialIndex,
}) {
  const [lbIndex, setLbIndex] = useState(initialIndex);
  const [lbSwiper, setLbSwiper] = useState(null);
  const [isAutoplay, setIsAutoplay] = useState(false);
  const [showThumbGrid, setShowThumbGrid] = useState(false);
  const [portalRoot, setPortalRoot] = useState(null);

  useEffect(() => {
    setPortalRoot(document.body);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    setLbIndex(initialIndex);
    setIsAutoplay(false);
    setShowThumbGrid(false);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, initialIndex]);

  const handleClose = useCallback(() => {
    onClose(lbIndex);
  }, [onClose, lbIndex]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") handleClose();
      if (!isOpen || images.length <= 1) return;
      if (e.key === "ArrowLeft") lbSwiper?.slidePrev();
      if (e.key === "ArrowRight") lbSwiper?.slideNext();
    };
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, handleClose, lbSwiper, images.length]);

  useEffect(() => {
    if (!isOpen || !isAutoplay || images.length <= 1) return;
    const id = setInterval(() => lbSwiper?.slideNext(), 3500);
    return () => clearInterval(id);
  }, [isOpen, isAutoplay, lbSwiper, images.length]);

  const goTo = useCallback(
    (idx) => {
      if (!lbSwiper) return;
      if (images.length > 1) {
        lbSwiper.slideToLoop?.(idx) ?? lbSwiper.slideTo(idx);
      } else {
        lbSwiper.slideTo(0);
      }
      setLbIndex(idx);
      setShowThumbGrid(false);
    },
    [lbSwiper, images.length],
  );

  if (!portalRoot) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-[10050] flex flex-col backdrop-blur-[3px]"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.88)" }}
          role="dialog"
          aria-modal="true"
          aria-label="商品圖片檢視"
        >
          {/* 頂部列 — Anker：計數 + 品名 | 分頁連結 | 工具列 + 關閉 */}
          <header className="relative z-30 flex items-center gap-4 px-4 sm:px-8 lg:px-10 h-14 sm:h-16 shrink-0 border-b border-white/[0.08]">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <span className="text-white text-sm font-normal tabular-nums shrink-0">
                {lbIndex + 1} / {images.length}
              </span>
              <span className="text-white/90 text-sm font-normal truncate hidden sm:block">
                {productName}
              </span>
            </div>

            <div className="flex items-center gap-0.5 sm:gap-1 shrink-0 text-white/70">
              <button
                type="button"
                className="hidden sm:flex p-2.5 hover:text-white transition-colors"
                aria-label="搜尋"
                onClick={() => {}}
              >
                <MaterialIcon name="search" size={20} />
              </button>
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={() => setIsAutoplay((v) => !v)}
                  className="p-2.5 hover:text-white transition-colors"
                  aria-label={isAutoplay ? "暫停輪播" : "自動輪播"}
                >
                  {isAutoplay ? (
                    <MaterialIcon name="pause" size={20} />
                  ) : (
                    <MaterialIcon name="play_arrow" size={20} />
                  )}
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowThumbGrid((v) => !v)}
                className="hidden sm:flex p-2.5 hover:text-white transition-colors"
                aria-label="縮圖網格"
              >
                <MaterialIcon name="grid_view" size={20} />
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="p-2 sm:p-2.5 ml-1 sm:ml-2 text-white hover:text-white/90 transition-colors"
                aria-label="關閉"
              >
                <MaterialIcon name="close" size={26} />
              </button>
            </div>
          </header>

          {/* 主圖 + 左右大箭頭 */}
          <div className="relative flex-1 flex items-center justify-center min-h-0 z-10">
            {images.length > 1 && !showThumbGrid && (
              <>
                <button
                  type="button"
                  onClick={() => lbSwiper?.slidePrev()}
                  className="absolute left-2 sm:left-6 lg:left-10 top-1/2 -translate-y-1/2 z-20 p-2 text-white/50 hover:text-white transition-colors"
                  aria-label="上一張"
                >
                  <MaterialIcon
                    name="chevron_left"
                    className="w-10 h-10 sm:w-14 sm:h-14 text-[40px] sm:text-[56px]"
                  />
                </button>
                <button
                  type="button"
                  onClick={() => lbSwiper?.slideNext()}
                  className="absolute right-2 sm:right-6 lg:right-10 top-1/2 -translate-y-1/2 z-20 p-2 text-white/50 hover:text-white transition-colors"
                  aria-label="下一張"
                >
                  <MaterialIcon
                    name="chevron_right"
                    className="w-10 h-10 sm:w-14 sm:h-14 text-[40px] sm:text-[56px]"
                  />
                </button>
              </>
            )}

            {showThumbGrid ? (
              <div className="w-full max-w-5xl px-6 py-8 overflow-y-auto max-h-full">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => goTo(idx)}
                      className={`relative aspect-[4/3] rounded overflow-hidden border-2 transition-all ${
                        lbIndex === idx
                          ? "border-[#00befa]"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.src}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <Swiper
                onSwiper={(swiper) => {
                  setLbSwiper(swiper);
                  setLbIndex(initialIndex);
                  if (images.length > 1) {
                    swiper.slideToLoop?.(initialIndex, 0) ??
                      swiper.slideTo(initialIndex, 0);
                  }
                }}
                initialSlide={initialIndex}
                loop={images.length > 1}
                slidesPerView={1}
                spaceBetween={0}
                onSlideChange={(s) => setLbIndex(s.realIndex)}
                className="w-full h-full max-w-[min(96vw,1200px)] product-gallery-lb px-14 sm:px-20 lg:px-28"
              >
                {images.map((img, idx) => (
                  <SwiperSlide key={idx}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.src}
                      alt={img.alt || `商品圖 ${idx + 1}`}
                      className="max-h-[calc(100vh-220px)] max-w-full w-auto mx-auto object-contain select-none"
                      draggable={false}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>

          {/* 底部縮圖列 — Anker 置中、青藍選中框 */}
          {!showThumbGrid && images.length > 1 && (
            <div className="relative z-30 shrink-0 pb-8 sm:pb-10 pt-2">
              <div className="flex justify-center items-center gap-2 sm:gap-2.5 px-4 overflow-x-auto max-w-[100vw]">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => goTo(idx)}
                    className={`relative shrink-0 w-[72px] h-[52px] sm:w-[88px] sm:h-[60px] rounded-md overflow-hidden transition-all duration-200 ${
                      lbIndex === idx
                        ? "border-2 border-[#00befa] opacity-100 shadow-[0_0_0_1px_rgba(0,190,250,0.4)]"
                        : "border-2 border-transparent opacity-45 hover:opacity-75"
                    }`}
                    aria-label={`第 ${idx + 1} 張`}
                    aria-current={lbIndex === idx ? "true" : undefined}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.src}
                      alt=""
                      className="w-full h-full object-cover bg-black/20"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          <style
            dangerouslySetInnerHTML={{ __html: PRODUCT_GALLERY_LB_STYLE }}
          />
        </motion.div>
      )}
    </AnimatePresence>,
    portalRoot,
  );
}

function ServiceBenefits() {
  const items = [
    {
      icon: "local_shipping",
      title: "快速出貨",
      desc: "下單後 Email 寄送 eSIM QR Code",
    },
    {
      icon: "assignment_return",
      title: "安心購買",
      desc: "依方案政策提供售後支援",
    },
    {
      icon: "verified_user",
      title: "品質保障",
      desc: "正規電信線路，穩定連線",
    },
    { icon: "support_agent", title: "終身客服", desc: "LINE 官方客服即時協助" },
  ];
  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <h3 className="text-lg font-bold text-slate-900 mb-4">服務與保障</h3>
      <a
        href="/promotions"
        className="flex items-center justify-between rounded-xl px-4 py-3.5 mb-4 text-sm font-semibold text-slate-800 transition-colors hover:opacity-90"
        style={{ background: "rgba(0, 190, 250, 0.12)" }}
      >
        <span>更多專屬優惠</span>
        <MaterialIcon
          name="chevron_right"
          size={18}
          className="text-gray-400"
        />
      </a>
      <ul className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden bg-white">
        {items.map((item) => (
          <li
            key={item.title}
            className="flex items-center gap-3 px-4 py-3.5 text-sm hover:bg-gray-50/80"
          >
            <span
              className="w-8 shrink-0 flex items-center justify-center"
              style={{ color: ANKER_BLUE }}
            >
              <MaterialIcon name={item.icon} size={22} />
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-900">{item.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
            </div>
            <MaterialIcon
              name="info"
              size={16}
              className="text-gray-300 shrink-0"
            />
          </li>
        ))}
      </ul>
      <div className="mt-5">
        <p className="text-xs font-bold text-gray-500 mb-2">付款方式</p>
        <div className="flex flex-wrap gap-2">
          {["Visa", "Mastercard", "Apple Pay", "LINE Pay", "街口", "藍新"].map(
            (p) => (
              <span
                key={p}
                className="px-2.5 py-1 text-[10px] font-bold text-gray-600 bg-gray-50 border border-gray-200 rounded"
              >
                {p}
              </span>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

const VIDEO_REGEX = /\.(mp4|webm|mov|m4v|avi|mkv|qt)$/i;
const ADMIN_EMAIL = "bob112722761236tom@gmail.com";

// ==========================================
// 2. UI 組件設定 (Modal, Tabs 等)
// ==========================================
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "max-w-5xl",
}) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => (document.body.style.overflow = "unset");
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 z-[60] backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className={`bg-white w-full ${maxWidth} max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl pointer-events-auto flex flex-col`}
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
                <h3 className="text-xl font-bold text-slate-800">{title}</h3>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
                >
                  <MaterialIcon name="close" size={22} />
                </button>
              </div>
              <div className="p-6">{children}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const CompatibilityModal = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredDevices = useMemo(() => {
    if (!searchTerm) return COMPATIBLE_DEVICES;
    return COMPATIBLE_DEVICES.map((cat) => ({
      ...cat,
      items: cat.items.filter((item) =>
        item.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    })).filter((cat) => cat.items.length > 0);
  }, [searchTerm]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="我的手機支援日本 eSIM 嗎？"
      maxWidth="max-w-3xl"
    >
      <div className="text-slate-700 space-y-6">
        <div className="bg-slate-50 p-4 rounded-xl text-sm leading-relaxed border border-gray-100">
          <p className="font-bold mb-2">
            若要使用 FeGo eSIM，請確保您的裝置：支援 eSIM 且未鎖定電信商。
          </p>
        </div>
        <input
          type="text"
          className="block w-full px-3 py-3 border border-gray-200 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="輸入設備型號 (例如：iPhone 14)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="space-y-3">
          {filteredDevices.map((category, idx) => (
            <div
              key={idx}
              className="border border-gray-200 rounded-xl overflow-hidden p-4 bg-white"
            >
              <span className="font-bold text-slate-800 block mb-2">
                {category.category}
              </span>
              <ul className="space-y-1 text-sm text-slate-600">
                {category.items.map((item, i) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

const DataEstimatorModal = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="估算您的數據用量"
      maxWidth="max-w-md"
    >
      <div className="text-center py-10">
        <p>數據估算器正在載入中...</p>
        <button
          onClick={onClose}
          className="mt-4 bg-slate-900 text-white px-6 py-2 rounded-lg"
        >
          關閉
        </button>
      </div>
    </Modal>
  );
};

const ComparisonTable = () => (
  <div className="overflow-x-auto rounded-xl border shadow-sm my-8 text-sm text-left border-collapse min-w-full">
    <table className="w-full">
      <thead>
        <tr className="bg-slate-900 text-white">
          <th className="p-4 w-1/4">產品</th>
          <th className="p-4 w-1/6">運營商</th>
          <th className="p-4 w-1/6">最適合</th>
          <th className="p-4">優點與注意事項</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y">
        <tr>
          <td className="p-4 font-bold">日本 eSIM AU</td>
          <td className="p-4">KDDI</td>
          <td className="p-4">串流愛好者</td>
          <td className="p-4 text-xs inline-flex items-center gap-1 flex-wrap">
            <MaterialIcon
              name="check_circle"
              size={14}
              className="text-emerald-600"
            />{" "}
            本地網絡
            <MaterialIcon
              name="check_circle"
              size={14}
              className="text-emerald-600"
            />{" "}
            支援 TikTok
          </td>
        </tr>
        <tr className="bg-slate-50">
          <td className="p-4 font-bold">SoftBank / KDDI 雙網</td>
          <td className="p-4">SB / KDDI</td>
          <td className="p-4">多城市旅行者</td>
          <td className="p-4 text-xs inline-flex items-center gap-1 flex-wrap">
            <MaterialIcon
              name="check_circle"
              size={14}
              className="text-emerald-600"
            />{" "}
            雙網切換
            <MaterialIcon
              name="cancel"
              size={14}
              className="text-red-500"
            />{" "}
            無法訪問 TikTok
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

const DETAILED_CONTENT_SANITIZE = {
  ALLOWED_TAGS: [
    "p",
    "br",
    "strong",
    "b",
    "em",
    "i",
    "u",
    "a",
    "ul",
    "ol",
    "li",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
    "img",
    "div",
    "span",
    "blockquote",
  ],
  ALLOWED_ATTR: [
    "href",
    "class",
    "style",
    "src",
    "alt",
    "target",
    "rel",
    "width",
    "height",
  ],
};

// ==========================================
// 產品動態介紹區域 (依電信商 + 管理者專用編輯)
// ==========================================
const ProductTabs = ({ product, selectedCarrier, onProductUpdate }) => {
  const [activeTab, setActiveTab] = useState("desc");
  const { data: session } = useSession();
  const { token } = useUser();

  const [isAdmin, setIsAdmin] = useState(false);
  const [adminChecked, setAdminChecked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [editMode, setEditMode] = useState("visual");

  const safeCarrier = selectedCarrier || null;
  const specs =
    (safeCarrier && CARRIER_SPECS_DATA[safeCarrier]) ||
    CARRIER_SPECS_DATA["default"];
  const introBullets = resolveIntroBullets(product, safeCarrier);
  const displayedContent = resolveDetailedContent(product, safeCarrier);
  const sanitizedDisplayHtml = useMemo(
    () => DOMPurify.sanitize(displayedContent || "", DETAILED_CONTENT_SANITIZE),
    [displayedContent],
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const headers = {};
        if (token) headers.Authorization = `Bearer ${token}`;
        const res = await fetch("/api/admin/verify", {
          credentials: "include",
          headers,
        });
        const data = res.ok ? await res.json() : { isAdmin: false };
        if (!cancelled) setIsAdmin(!!data.isAdmin);
      } catch {
        if (!cancelled) setIsAdmin(false);
      } finally {
        if (!cancelled) setAdminChecked(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token, session?.user?.email]);

  useEffect(() => {
    if (!isEditing) {
      setContent(resolveDetailedContent(product, safeCarrier));
    }
  }, [product, safeCarrier, isEditing]);

  const handleSave = async () => {
    if (!safeCarrier) {
      alert("請先選擇電信商後再儲存");
      return;
    }
    setIsSaving(true);
    try {
      const headers = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch("/api/admin/product-detailed-content", {
        method: "POST",
        credentials: "include",
        headers,
        body: JSON.stringify({
          productId: product.id,
          carrier: safeCarrier,
          html: content,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || data.detail || "儲存失敗");
      }

      onProductUpdate?.({
        detailed_content_by_carrier: data.detailed_content_by_carrier,
      });
      setIsEditing(false);
      alert(`已儲存「${safeCarrier}」的產品介紹`);
    } catch (error) {
      alert(error.message || "儲存失敗");
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: "desc", label: "產品介紹" },
    { id: "specs", label: "套餐參數" },
    { id: "install", label: "安裝/激活" },
  ];

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ size: ["small", false, "large", "huge"] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ align: [] }],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      [{ color: [] }, { background: [] }],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  return (
    <div id="product-tabs" className="mt-16">
      <div className="flex justify-center border-b border-gray-200 mb-8 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 sm:px-8 py-3.5 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "border-[#00befa] text-slate-900"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="min-h-[200px]">
        {activeTab === "desc" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <MaterialIcon
                  name="travel_explore"
                  size={24}
                  className="text-[#00befa]"
                />
                關於 {product.name}
              </h3>
              {adminChecked && isAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    if (!safeCarrier) {
                      alert("請先選擇電信商，再編輯該電信商的產品介紹");
                      return;
                    }
                    if (!isEditing) {
                      setContent(resolveDetailedContent(product, safeCarrier));
                    }
                    setIsEditing(!isEditing);
                  }}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded text-sm font-bold text-white transition-colors ${isEditing ? "bg-red-500 hover:bg-red-600" : "bg-slate-800 hover:bg-slate-700"}`}
                >
                  {isEditing ? (
                    <>
                      <MaterialIcon name="close" size={16} /> 取消編輯
                    </>
                  ) : (
                    <>
                      <MaterialIcon name="edit" size={16} /> 編輯內容
                    </>
                  )}
                </button>
              )}
            </div>

            {isEditing && isAdmin ? (
              <div className="mb-10 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="px-4 py-2.5 bg-amber-50 border-b border-amber-100 text-xs text-amber-900">
                  正在編輯電信商：
                  <strong className="font-bold ml-1">{safeCarrier}</strong>
                  <span className="text-amber-700 ml-2">
                    （各電信商內容獨立儲存，切換電信商前請先儲存）
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-slate-100 p-2 border-b border-gray-200">
                  <button
                    onClick={() => setEditMode("visual")}
                    className={`inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-bold rounded-lg transition-all ${editMode === "visual" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:bg-gray-200"}`}
                  >
                    <MaterialIcon name="visibility" size={16} /> 視覺化編輯
                  </button>
                  <button
                    onClick={() => setEditMode("html")}
                    className={`inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-bold rounded-lg transition-all ${editMode === "html" ? "bg-slate-800 text-white shadow-sm" : "text-gray-500 hover:bg-gray-200"}`}
                  >
                    <MaterialIcon name="code" size={16} /> HTML 原始碼
                  </button>
                </div>
                <div className="relative">
                  {editMode === "visual" ? (
                    <div className="bg-white">
                      <ReactQuill
                        theme="snow"
                        value={content}
                        onChange={setContent}
                        modules={quillModules}
                        className="h-[400px] pb-10"
                      />
                    </div>
                  ) : (
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="w-full h-[442px] p-5 font-mono text-sm leading-relaxed bg-[#1e1e1e] text-[#d4d4d4] focus:outline-none resize-none"
                      placeholder="請在此貼上包含 Tailwind CSS 或自定義 style 的 HTML 原始碼..."
                      spellCheck="false"
                    />
                  )}
                </div>
                <div className="flex justify-end items-center p-4 bg-gray-50 border-t border-gray-200">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="inline-flex items-center gap-1.5 bg-blue-600 text-white px-8 py-2.5 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 shadow-sm"
                  >
                    {isSaving ? (
                      "儲存中..."
                    ) : (
                      <>
                        <MaterialIcon
                          name="save"
                          size={16}
                          className="inline mr-1"
                        />
                        儲存並發布
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="mb-10 text-slate-600 text-sm leading-relaxed">
                <div className="space-y-3 mb-6 bg-slate-50 p-5 rounded-xl border border-gray-100">
                  <h4 className="font-bold text-slate-800 mb-2 inline-flex items-center gap-1.5">
                    <MaterialIcon
                      name="bolt"
                      size={18}
                      className="text-amber-500"
                    />
                    {safeCarrier || "此方案"} 專屬特色：
                  </h4>
                  {introBullets.length > 0 ? (
                    <div className="space-y-4">
                      {introBullets.map((point, idx) => (
                        <div key={idx} className="flex gap-2 items-start">
                          <MaterialIcon
                            name="check_circle"
                            size={16}
                            className="text-blue-500 mt-0.5 shrink-0"
                          />
                          <FeatureBulletText className="text-slate-600 flex-1 min-w-0">
                            {point}
                          </FeatureBulletText>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400 text-sm">
                      {safeCarrier
                        ? "此電信商尚未設定重點特色，請至 Medusa 後台商品頁填寫。"
                        : "請先選擇電信商。"}
                    </p>
                  )}
                </div>

                {sanitizedDisplayHtml ? (
                  <div className="mt-8 pt-8 border-t border-gray-100">
                    <h4 className="font-bold text-slate-800 mb-4">
                      📖 方案詳細說明
                      {safeCarrier ? (
                        <span className="text-gray-400 font-normal text-sm ml-2">
                          （{safeCarrier}）
                        </span>
                      ) : null}
                    </h4>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: sanitizedDisplayHtml,
                      }}
                      className="prose max-w-none product-content-wrapper"
                    />
                  </div>
                ) : (
                  safeCarrier && (
                    <p className="mt-6 text-sm text-slate-400">
                      「{safeCarrier}」尚無產品介紹內容。
                      {isAdmin ? " 點「編輯內容」新增。" : ""}
                    </p>
                  )
                )}
              </div>
            )}
            <div id="product-comparison">
              <ComparisonTable />
            </div>
          </motion.div>
        )}

        {activeTab === "specs" && (
          <motion.div
            id="product-specs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-slate-50 rounded-2xl p-6 md:p-10"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
              {specs.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${item.fullWidth ? "md:col-span-2" : ""}`}
                >
                  <span className="text-sm font-bold text-slate-900 mb-1">
                    {item.label}
                  </span>
                  <span className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "install" && (
          <div id="product-faq" className="text-center py-10 text-gray-500">
            <h4 className="text-lg font-bold mb-4 text-slate-800">安裝步驟</h4>
            <p>1. 下單後檢查 Email 收取 QR Code。</p>
            <p>2. 前往手機「設定」 「行動服務」 「加入 eSIM」。</p>
            <p>3. 掃描 QR Code 並依照指示完成設定。</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 3. Tabelog 風格圖文評論與回覆系統
// ==========================================
const ReviewsSection = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [replies, setReplies] = useState({});

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [media, setMedia] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [replyingTo, setReplyingTo] = useState(null);
  const [replyName, setReplyName] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  const [gallery, setGallery] = useState({
    isOpen: false,
    mediaUrls: [],
    initialSlide: 0,
  });
  const isAdmin = currentUser?.email === ADMIN_EMAIL;

  const fetchReviews = async () => {
    const { data } = await supabase
      .from("product_reviews")
      .select("*")
      .eq("product_id", productId)
      .eq("status", "approved")
      .order("created_at", { ascending: false });
    if (data) {
      const mainReviews = data.filter((r) => !r.parent_id);
      const replyData = data.filter((r) => r.parent_id);
      const replyMap = {};
      replyData.forEach((r) => {
        if (!replyMap[r.parent_id]) replyMap[r.parent_id] = [];
        replyMap[r.parent_id].push(r);
      });
      setReviews(mainReviews);
      setReplies(replyMap);
    }
  };

  useEffect(() => {
    if (productId) fetchReviews();
    const checkRealAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setIsLoggedIn(true);
        setCurrentUser(session.user);
      }
    };
    checkRealAuth();
  }, [productId]);

  useEffect(() => {
    return () => {
      media.forEach((m) => URL.revokeObjectURL(m.previewUrl));
    };
  }, [media]);

  const handleReviewClick = () => {
    if (!isLoggedIn) {
      const email = window.prompt(
        "【測試模式】請輸入您的 Email 來模擬登入狀態：\n(輸入 bob112722761236tom@gmail.com 可測試管理員權限)",
      );
      if (email) {
        setIsLoggedIn(true);
        setCurrentUser({ email: email });
      }
    }
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const validNewFiles = [];
    let hasError = false;

    if (media.length + newFiles.length > 4) {
      alert(
        `⚠️ 最多只能上傳 4 個檔案喔！目前已選擇 ${media.length} 個，再新增 ${newFiles.length} 個會超過限制。`,
      );
      e.target.value = null;
      return;
    }

    newFiles.forEach((file) => {
      const isVideo = file.type.startsWith("video/");
      const maxSize = isVideo ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
      if (file.size > maxSize) {
        alert(
          `⚠️ 檔案 ${file.name} 容量太大！\n\n- 圖片限制：單張 5MB 以內\n- 影片限制：單部 50MB 以內\n\n請壓縮後再上傳。`,
        );
        hasError = true;
      } else {
        validNewFiles.push({
          file: file,
          previewUrl: URL.createObjectURL(file),
        });
      }
    });

    if (!hasError && validNewFiles.length > 0)
      setMedia((prevMedia) => [...prevMedia, ...validNewFiles]);
    e.target.value = null;
  };

  const handleCancelFile = (indexToRemove) => {
    setMedia((prevMedia) => {
      URL.revokeObjectURL(prevMedia[indexToRemove].previewUrl);
      return prevMedia.filter((_, index) => index !== indexToRemove);
    });
  };

  const uploadMedia = async (files) => {
    const urls = [];
    const currentMonth = new Date().toISOString().slice(0, 7);
    for (const file of files) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${productId}/${currentMonth}/${fileName}`;
      const { error: uploadError } = await supabase.storage
        .from("review-media")
        .upload(filePath, file);
      if (uploadError) {
        console.error("Storage upload error:", uploadError);
        alert(`⚠️ 檔案上傳失敗！\n錯誤訊息：${uploadError.message}`);
        continue;
      }
      const { data } = supabase.storage
        .from("review-media")
        .getPublicUrl(filePath);
      urls.push(data.publicUrl);
    }
    return urls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !content || !title) return alert("請填寫暱稱、標題與內容");
    setIsSubmitting(true);

    const filesToUpload = media.map((m) => m.file);
    let mediaUrls = [];
    if (filesToUpload.length > 0) mediaUrls = await uploadMedia(filesToUpload);

    const { error } = await supabase.from("product_reviews").insert([
      {
        product_id: productId,
        user_name: name,
        title: title,
        content: content,
        rating: rating,
        media_urls: mediaUrls,
      },
    ]);

    setIsSubmitting(false);
    if (error) {
      console.error("Insert Review Error:", error);
      alert(`留言失敗: ${error.message}`);
    } else {
      alert("感謝您的評價！");
      setName("");
      setTitle("");
      setContent("");
      setRating(5);
      media.forEach((m) => URL.revokeObjectURL(m.previewUrl));
      setMedia([]);
      fetchReviews();
    }
  };

  const handleReplySubmit = async (e, parentId) => {
    e.preventDefault();
    if (!replyName || !replyContent) return alert("請填寫暱稱與回覆內容");
    setIsReplying(true);
    const { error } = await supabase.from("product_reviews").insert([
      {
        product_id: productId,
        parent_id: parentId,
        user_name: replyName,
        content: replyContent,
        rating: 5,
      },
    ]);
    setIsReplying(false);
    if (error) {
      console.error("Insert Reply Error:", error);
      alert(`回覆失敗: ${error.message}`);
    } else {
      alert("回覆成功！");
      setReplyingTo(null);
      setReplyName("");
      setReplyContent("");
      fetchReviews();
    }
  };

  const handleDelete = async (id, isReply = false, targetMediaUrls = []) => {
    const confirmMsg = isReply
      ? "確定要刪除這則回覆嗎？"
      : "確定要刪除這則留言嗎？\n\n(注意：這將會同步刪除該留言夾帶的所有圖片與影片，並且底下所有的回覆也會一併被清空。)";
    if (!window.confirm(confirmMsg)) return;

    if (targetMediaUrls && targetMediaUrls.length > 0) {
      try {
        const filePaths = targetMediaUrls
          .map((url) => {
            const decodedUrl = decodeURI(url);
            const parts = decodedUrl.split("/review-media/");
            return parts.length > 1 ? parts[1] : null;
          })
          .filter(Boolean);

        if (filePaths.length > 0) {
          const { error: storageError } = await supabase.storage
            .from("review-media")
            .remove(filePaths);
          if (storageError) {
            alert(
              `⚠️ 圖片刪除失敗：${storageError.message}\n(請確認 Supabase Storage 是否有開啟 DELETE 權限！刪除程序已中斷。)`,
            );
            return;
          }
        }
      } catch (err) {
        console.error("解析圖片網址失敗", err);
      }
    }

    const { error: dbError } = await supabase
      .from("product_reviews")
      .delete()
      .eq("id", id);
    if (dbError) alert(`刪除資料庫紀錄失敗: ${dbError.message}`);
    else {
      alert("刪除成功！");
      fetchReviews();
    }
  };

  const openGallery = (mediaUrls, index) => {
    setGallery({ isOpen: true, mediaUrls, initialSlide: index });
  };

  return (
    <div
      id="product-reviews"
      className="mt-16 max-w-[800px] mx-auto pt-10 pb-20 relative"
    >
      <AnimatePresence>
        {gallery.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setGallery({ ...gallery, isOpen: false })}
            className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setGallery({ ...gallery, isOpen: false });
              }}
              className="absolute top-5 right-5 text-white text-4xl w-12 h-12 flex items-center justify-center z-[10000] hover:bg-white/20 rounded-full transition-colors cursor-pointer"
            >
              &times;
            </button>
            <div
              className="w-full max-w-6xl px-12 h-[85vh] relative flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Swiper
                initialSlide={gallery.initialSlide}
                navigation={true}
                modules={[Navigation]}
                className="w-full h-full lightbox-swiper"
              >
                {gallery.mediaUrls.map((url, i) => (
                  <SwiperSlide
                    key={i}
                    className="flex items-center justify-center w-full h-full"
                  >
                    {url.match(VIDEO_REGEX) ? (
                      <video
                        src={url}
                        controls
                        autoPlay
                        playsInline
                        className="max-h-full max-w-full rounded-md shadow-2xl"
                      />
                    ) : (
                      <img
                        src={url}
                        alt={`Gallery image ${i}`}
                        className="max-h-full max-w-full object-contain rounded-md shadow-2xl"
                      />
                    )}
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            <style
              dangerouslySetInnerHTML={{
                __html: ` .lightbox-swiper .swiper-button-next, .lightbox-swiper .swiper-button-prev { color: white; background-color: rgba(255, 255, 255, 0.1); width: 50px; height: 50px; border-radius: 50%; backdrop-filter: blur(4px); transition: background-color 0.2s; } .lightbox-swiper .swiper-button-next:hover, .lightbox-swiper .swiper-button-prev:hover { background-color: rgba(255, 255, 255, 0.3); } `,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-6">
        <h3 className="text-lg font-bold text-slate-800">
          評論 ({reviews.length})
        </h3>
      </div>

      <div className="space-y-6 mb-16">
        {reviews.length === 0 ? (
          <p className="text-slate-500 text-center py-10 bg-slate-50 rounded-sm">
            目前還沒有評價，成為第一個分享體驗的人吧！
          </p>
        ) : (
          reviews.map((r) => (
            <div
              key={r.id}
              className="border border-gray-200 rounded-sm p-5 bg-white shadow-sm flex flex-col"
            >
              <div className="flex justify-between items-start mb-3 border-b border-gray-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center overflow-hidden shrink-0 border border-gray-300">
                    <span className="text-gray-500 font-bold text-sm">
                      {r.user_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-800 flex items-center gap-2">
                      {r.user_name}
                      {r.is_verified_purchase && (
                        <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-sm font-bold">
                          已購買
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 mb-2 mt-1">
                <span className="inline-flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <MaterialIcon
                      key={i}
                      name="star"
                      size={18}
                      filled={i < (r.rating || 5)}
                      className={
                        i < (r.rating || 5) ? "text-[#f56a00]" : "text-gray-300"
                      }
                    />
                  ))}
                </span>
                <div className="text-red-600 font-bold text-xl">
                  {(r.rating || 5).toFixed(1)}
                </div>
              </div>
              <div className="text-xs text-slate-500 mb-4">
                {new Date(r.created_at)
                  .toLocaleDateString()
                  .replace(/\//g, "/")}{" "}
                訪問
              </div>
              <h4 className="font-bold text-base text-slate-900 mb-2 whitespace-pre-wrap leading-relaxed">
                {r.title || "體驗分享"}
              </h4>
              <p className="text-slate-700 font-normal leading-relaxed text-sm mb-4">
                {r.content}
              </p>

              {r.media_urls && r.media_urls.length > 0 && (
                <div className="mt-2 mb-4">
                  <button
                    onClick={() => openGallery(r.media_urls, 0)}
                    className="text-xs text-blue-600 font-bold mb-2 flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    檢查更多
                    <MaterialIcon name="expand_more" size={14} />
                  </button>
                  <div className="grid grid-cols-4 gap-2">
                    {r.media_urls.slice(0, 4).map((url, i) => (
                      <div
                        key={i}
                        onClick={() => openGallery(r.media_urls, i)}
                        className="relative aspect-square rounded-sm overflow-hidden bg-gray-100 border border-gray-200 cursor-pointer group"
                      >
                        {url.match(VIDEO_REGEX) ? (
                          <video
                            src={url}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            muted
                            playsInline
                          />
                        ) : (
                          <img
                            src={url}
                            alt="Review media"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        )}
                        {i === 3 && r.media_urls.length > 4 && (
                          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white">
                            <span className="font-bold text-sm">
                              查看全部 {r.media_urls.length}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-auto">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() =>
                      handleReviewClick() ||
                      setReplyingTo(replyingTo === r.id ? null : r.id)
                    }
                    className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <MaterialIcon name="reply" size={14} />
                    {replyingTo === r.id ? "取消回覆" : "回覆評論"}
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(r.id, false, r.media_urls)}
                      className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors"
                    >
                      <MaterialIcon name="delete" size={14} />
                      刪除
                    </button>
                  )}
                </div>
              </div>

              {replies[r.id] && replies[r.id].length > 0 && (
                <div className="bg-slate-50 border-t border-gray-100 p-4 mt-3 rounded-sm space-y-4">
                  {replies[r.id].map((reply) => (
                    <div key={reply.id} className="text-sm">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800">
                            {reply.user_name}
                          </span>
                          <span className="text-xs text-slate-400">
                            {new Date(reply.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        {isAdmin && (
                          <button
                            onClick={() => handleDelete(reply.id, true)}
                            className="text-xs text-red-500 hover:text-red-700 transition-colors"
                          >
                            刪除
                          </button>
                        )}
                      </div>
                      <p className="text-slate-700 pl-2 border-l-2 border-gray-300 ml-1">
                        {reply.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {replyingTo === r.id && isLoggedIn && (
                <form
                  onSubmit={(e) => handleReplySubmit(e, r.id)}
                  className="mt-3 bg-gray-50 border border-gray-200 p-4 rounded-lg flex flex-col gap-3"
                >
                  <input
                    type="text"
                    placeholder="您的暱稱"
                    value={replyName}
                    onChange={(e) => setReplyName(e.target.value)}
                    className="border border-gray-300 p-2 rounded-md text-sm w-full md:w-1/3 bg-white"
                    required
                  />
                  <textarea
                    placeholder="對這則評論有什麼想法呢？"
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    rows="2"
                    className="border border-gray-300 p-2 rounded-md text-sm w-full bg-white"
                    required
                  ></textarea>
                  <div className="flex justify-end">
                    <button
                      disabled={isReplying}
                      className="bg-blue-600 text-white px-5 py-2 rounded-md text-xs font-bold disabled:opacity-50 hover:bg-blue-700 transition-colors"
                    >
                      {isReplying ? "送出中..." : "送出回覆"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          ))
        )}
      </div>

      <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm mt-10">
        <div className="flex gap-4">
          <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center shrink-0 border border-gray-300">
            <span className="text-gray-500 font-bold text-lg">
              {isLoggedIn ? "我" : "客"}
            </span>
          </div>
          <div className="flex-1">
            {!isLoggedIn ? (
              <div
                onClick={handleReviewClick}
                className="w-full border border-gray-300 rounded-sm p-4 text-gray-500 text-sm cursor-pointer bg-slate-50 hover:bg-gray-100 transition-colors flex items-center"
                style={{ minHeight: "60px" }}
              >
                點擊這裡寫下您的評價...
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      暱稱
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full border border-gray-300 p-2 rounded-sm text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                      placeholder="您的名字"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      評分
                    </label>
                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="w-full border border-gray-300 p-2 rounded-sm text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    >
                      <option value={5}>5 星 - 非常滿意</option>
                      <option value={4}>4 星 - 滿意</option>
                      <option value={3}>3 星 - 普通</option>
                      <option value={2}>2 星 - 稍不滿意</option>
                      <option value={1}>1 星 - 非常不滿意</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    評論標題
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded-sm text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    placeholder="用一句話總結您的體驗（必填）"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    詳細內容
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows="3"
                    className="w-full border border-gray-300 p-2 rounded-sm text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    placeholder="分享您在日本使用時的網速、訊號感受..."
                    required
                  ></textarea>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    上傳照片或影片{" "}
                    <span className="text-gray-400 font-normal">
                      (限 4 份檔案，圖片 5MB / 影片 50MB 內)
                    </span>
                  </label>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={handleFileChange}
                    className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-sm file:border file:border-gray-300 file:text-xs file:font-bold file:bg-white file:text-slate-700 hover:file:bg-gray-50 cursor-pointer"
                  />
                  {media.length > 0 && (
                    <div className="w-full flex gap-3 mt-3 overflow-x-auto pb-2">
                      {media.map((preview, i) => (
                        <div
                          key={i}
                          className="relative w-20 h-20 shrink-0 rounded-md overflow-hidden bg-gray-100 border border-gray-200 shadow-sm"
                        >
                          {preview.file.type.startsWith("video/") ? (
                            <video
                              src={preview.previewUrl}
                              className="w-full h-full object-cover"
                              muted
                              playsInline
                            />
                          ) : (
                            <img
                              src={preview.previewUrl}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          )}
                          <button
                            type="button"
                            onClick={() => handleCancelFile(i)}
                            className="absolute top-1 right-1 w-5 h-5 bg-red-600/90 text-white rounded-full flex items-center justify-center font-bold text-xs hover:bg-red-700 transition-colors shadow-md"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex justify-end mt-2 border-t border-gray-100 pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#f56a00] text-white px-8 py-2.5 rounded-sm text-sm font-bold hover:bg-[#d95a00] disabled:opacity-50 transition-colors shadow-sm"
                  >
                    {isSubmitting ? "上傳中..." : "發布評價"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 🚀 4. Medusa API 資料抓取邏輯 (加上除錯日誌)
// ==========================================
const getMedusaHeaders = () => {
  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";
  return {
    "Content-Type": "application/json",
    ...(publishableKey && { "x-publishable-api-key": publishableKey }),
  };
};

const backendUrl =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";

export async function getStaticPaths() {
  try {
    const res = await fetch(`${backendUrl}/store/products`, {
      headers: getMedusaHeaders(),
    });
    if (!res.ok) throw new Error("無法取得 Medusa 商品");

    const { products } = await res.json();

    const paths = products.map((p) => {
      const categoryHandle = p.categories?.[0]?.handle || "uncategorized";
      return {
        params: { category: categoryHandle, slug: p.handle },
      };
    });

    return { paths, fallback: "blocking" };
  } catch (error) {
    console.error("Medusa getStaticPaths 錯誤:", error);
    return { paths: [], fallback: "blocking" };
  }
}

export async function getStaticProps({ params }) {
  try {
    const { slug } = params;
    const headers = getMedusaHeaders();

    console.log("\n========================================");
    console.log(`🔍 [除錯雷達] 開始抓取商品內頁: /product/.../${slug}`);

    // 🌟 關鍵修復 1：先去抓取 Medusa 的 Region (地區設定)
    // Medusa 需要知道你在哪個「地區」，才肯把該地區的專屬價格算給你！
    let regionId = "";
    try {
      const regionRes = await fetch(`${backendUrl}/store/regions`, { headers });
      if (regionRes.ok) {
        const regionData = await regionRes.json();
        // 自動找出 TWD (台幣) 的 Region，如果沒有就抓第一個
        const region =
          regionData.regions?.find(
            (r) => r.currency_code === "twd" || r.currency_code === "TWD",
          ) || regionData.regions?.[0];
        if (region) {
          regionId = region.id;
          console.log(`✅ 成功取得 Region ID: ${regionId} (${region.name})`);
        }
      }
    } catch (err) {
      console.log("⚠️ 無法取得 Region，將以無地區模式請求商品。");
    }

    // Medusa Store API 預設不回傳 metadata，必須 fields=+metadata
    const query = new URLSearchParams({
      handle: slug,
      fields: "+metadata",
    });
    if (regionId) query.set("region_id", regionId);

    const prodUrl = `${backendUrl}/store/products?${query.toString()}`;

    console.log(`🌐 正在呼叫商品 API: ${prodUrl}`);

    const prodRes = await fetch(prodUrl, { headers });
    const prodData = await prodRes.json();

    // 如果 API 還是報錯，這次我們印出真正原因，不讓他偷偷變 404！
    if (!prodRes.ok) {
      console.log(`❌ API 請求失敗！狀態碼: ${prodRes.status}`);
      console.log("⚠️ Medusa 錯誤訊息:", JSON.stringify(prodData, null, 2));
      return { notFound: true };
    }

    const product = prodData.products?.[0];

    if (!product) {
      return { notFound: true };
    }

    const rawKeyFeatures = product.metadata?.key_features_by_carrier;
    const parsedKeyFeatures = parseKeyFeaturesByCarrier(rawKeyFeatures) || {};

    console.log(
      "📋 key_features_by_carrier:",
      rawKeyFeatures ? "有資料" : "無/空",
      Object.keys(parsedKeyFeatures),
    );

    const rawOverviewNotices = product.metadata?.overview_notices_by_carrier;
    const rawDetailedByCarrier = product.metadata?.detailed_content_by_carrier;

    const formattedProduct = {
      id: product.id,
      name: product.title,
      slug: product.handle,
      description: product.description || "",
      detailed_content: product.metadata?.detailed_content || "",
      detailed_content_by_carrier: parseDetailedContentByCarrier(
        rawDetailedByCarrier,
      ),
      key_features_by_carrier: parsedKeyFeatures,
      overview_notices_by_carrier: parseOverviewNoticesByCarrier(rawOverviewNotices),
      image_url: product.thumbnail || null,
      image_urls: product.images?.map((img) => img.url) || [],
      price: product.variants?.[0]?.prices?.[0]?.amount || null,
    };

    const formattedVariations =
      product.variants?.map((v) => {
        console.log(`\n--- 處理變體: ${v.title} ---`);
        console.log(
          `原始價格 v.calculated_price:`,
          JSON.stringify(v.calculated_price),
        );

        let price = 0;

        // 🌟 價格相容性處理 (完整支援 Medusa V1 / V2 各種回傳格式)
        if (
          v.calculated_price &&
          typeof v.calculated_price.calculated_amount === "number"
        ) {
          price = v.calculated_price.calculated_amount;
        } else if (typeof v.calculated_price === "number") {
          price = v.calculated_price;
        } else if (v.prices && v.prices.length > 0) {
          const twdPrice = v.prices.find(
            (p) =>
              p.currency_code === "twd" ||
              p.currency_code === "TWD" ||
              p.currency_code === "NTD",
          );
          price = twdPrice ? twdPrice.amount : v.prices[0].amount;
        }

        let attrs = {};
        if (v.metadata?.attributes) {
          try {
            attrs =
              typeof v.metadata.attributes === "string"
                ? JSON.parse(v.metadata.attributes)
                : v.metadata.attributes;
          } catch (e) {}
        }
        attrs = { ...v.metadata, ...attrs };

        // 智慧解析選項組合
        v.options?.forEach((opt) => {
          const val = String(opt.value || "").trim();
          if (!val) return;

          if (val.includes("天") || val.includes("Days")) {
            attrs.days = parseInt(val);
          } else if (
            val.includes("流量") ||
            val.includes("GB") ||
            val.includes("MB") ||
            val.includes("吃到飽")
          ) {
            attrs.data_amount = val;
          } else {
            attrs.telecom = val;
          }
        });

        console.log(`解析出的最終價格: ${price}`);

        return {
          id: v.id,
          title: v.title,
          sku: v.sku,
          price: price,
          original_price: v.original_price || price,
          plan_id: v.metadata?.plan_id || "",
          attributes: attrs,
          tags: v.metadata?.tags ? v.metadata.tags.split(",") : [],
        };
      }) || [];

    console.log("========================================\n");

    return {
      props: {
        product: formattedProduct,
        variations: formattedVariations,
      },
      revalidate: 60, // 靜態頁面快取時間
    };
  } catch (e) {
    console.error("❌ Medusa getStaticProps 發生致命錯誤：", e);
    return { notFound: true };
  }
}

// ==========================================
// 5. 主頁面 Component
// ==========================================
export default function ProductPage({
  product: initialProduct,
  variations = [],
}) {
  const { addToCart } = useCart();
  const router = useRouter();
  const [product, setProduct] = useState(initialProduct);
  const [quantity, setQuantity] = useState(1);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [currentVariation, setCurrentVariation] = useState(null);

  const [isCompatOpen, setIsCompatOpen] = useState(false);
  const [isEstimatorOpen, setIsEstimatorOpen] = useState(false);
  const [mainSwiper, setMainSwiper] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [galleryLightboxOpen, setGalleryLightboxOpen] = useState(false);
  const [galleryLightboxIndex, setGalleryLightboxIndex] = useState(0);
  const [featuresOpen, setFeaturesOpen] = useState(true);
  const [mediaTab, setMediaTab] = useState("overview");
  const [copiedCoupon, setCopiedCoupon] = useState(false);

  useEffect(() => {
    setProduct(initialProduct);
  }, [initialProduct]);

  // 進頁即時拉最新 metadata（後台儲存後不用等 ISR）
  useEffect(() => {
    if (!initialProduct?.slug) return;

    fetch(
      `/api/medusa/product-features?handle=${encodeURIComponent(initialProduct.slug)}`,
    )
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) return;
        setProduct((prev) => ({
          ...prev,
          ...(data.key_features_by_carrier
            ? { key_features_by_carrier: data.key_features_by_carrier }
            : {}),
          ...(data.overview_notices_by_carrier
            ? {
                overview_notices_by_carrier: data.overview_notices_by_carrier,
              }
            : {}),
          ...(data.detailed_content_by_carrier
            ? {
                detailed_content_by_carrier: data.detailed_content_by_carrier,
              }
            : {}),
          detailed_content: data.detailed_content || prev.detailed_content,
        }));
      })
      .catch(() => {});
  }, [initialProduct?.slug]);

  // 1. 初始化網址參數與「預設選取」
  useEffect(() => {
    if (router.isReady && variations.length > 0) {
      const initialAttrs = {};
      ["telecom", "days", "data_amount"].forEach((key) => {
        if (router.query[key]) initialAttrs[key] = router.query[key];
      });

      if (Object.keys(initialAttrs).length === 0) {
        const firstTelecom = [
          ...new Set(
            variations.map((v) => v.attributes?.telecom).filter(Boolean),
          ),
        ][0];
        if (firstTelecom) initialAttrs["telecom"] = firstTelecom;

        const firstDataAmount = [
          ...new Set(
            variations.map((v) => v.attributes?.data_amount).filter(Boolean),
          ),
        ][0];
        if (firstDataAmount) initialAttrs["data_amount"] = firstDataAmount;
      }

      setSelectedAttributes(initialAttrs);
    }
  }, [router.isReady, variations]);

  // 2. 匹配變體與價格
  useEffect(() => {
    if (variations.length > 0) {
      const match = variations.find((v) =>
        Object.keys(selectedAttributes).every(
          (key) =>
            v.attributes &&
            String(v.attributes[key]) === String(selectedAttributes[key]),
        ),
      );
      setCurrentVariation(match || null);
    }
  }, [selectedAttributes, variations]);

  // 🌟 嚴格防呆：檢查三個規格是否「全部」都已選取
  const isAllOptionsSelected = !!(
    selectedAttributes.telecom &&
    selectedAttributes.days &&
    selectedAttributes.data_amount
  );

  const availableCarriers = useMemo(
    () => [
      ...new Set(variations.map((v) => v.attributes?.telecom).filter(Boolean)),
    ],
    [variations],
  );

  const availableDays = useMemo(() => {
    const currentTelecom = selectedAttributes["telecom"];
    const filteredVariations = currentTelecom
      ? variations.filter((v) => v.attributes?.telecom === currentTelecom)
      : variations;
    const days = [
      ...new Set(
        filteredVariations.map((v) => v.attributes?.days).filter(Boolean),
      ),
    ];
    return days.sort((a, b) => Number(a) - Number(b));
  }, [variations, selectedAttributes["telecom"]]);

  const availableData = useMemo(() => {
    const currentTelecom = selectedAttributes["telecom"];
    const currentDays = selectedAttributes["days"];
    let filtered = variations;
    if (currentTelecom)
      filtered = filtered.filter(
        (v) => v.attributes?.telecom === currentTelecom,
      );
    if (currentDays)
      filtered = filtered.filter(
        (v) => String(v.attributes?.days) === String(currentDays),
      );
    return [
      ...new Set(
        filtered.map((v) => v.attributes?.data_amount).filter(Boolean),
      ),
    ];
  }, [variations, selectedAttributes["telecom"], selectedAttributes["days"]]);

  const handleAttributeSelect = (name, option) => {
    let newAttrs = { ...selectedAttributes, [name]: option };
    let newQuery = { ...router.query, [name]: option };

    setSelectedAttributes(newAttrs);
    router.push({ pathname: router.pathname, query: newQuery }, undefined, {
      shallow: true,
    });
  };

  const handleAddToCart = () => {
    if (!currentVariation) return;
    const specLabel = [
      selectedAttributes.telecom,
      selectedAttributes.days ? `${selectedAttributes.days}天` : null,
      selectedAttributes.data_amount,
    ]
      .filter(Boolean)
      .join(" · ");

    addToCart({
      id: currentVariation.id,
      variant_id: currentVariation.id,
      parentId: product.id,
      name: currentVariation.title || product.name,
      price: currentVariation.price,
      sku: currentVariation.sku,
      planId: currentVariation.plan_id,
      image: product.image_url || "/default-image.jpg",
      quantity,
      options: specLabel,
      specLabel,
    });
    window.dispatchEvent(new Event("open-cart-sidebar"));
  };

  const carrierName = selectedAttributes["telecom"] || "default";
  const activeCarrierInfo =
    CARRIER_INFO_MAP[carrierName] || CARRIER_INFO_MAP.default;
  const marketingConfig = activeCarrierInfo.marketingBox;
  const introBullets = resolveIntroBullets(product, carrierName);
  const overviewNotices = resolveOverviewNotices(product, carrierName);

  const priceSavings = useMemo(() => {
    if (
      !currentVariation?.original_price ||
      !currentVariation?.price ||
      currentVariation.original_price <= currentVariation.price
    ) {
      return 0;
    }
    return currentVariation.original_price - currentVariation.price;
  }, [currentVariation]);

  const choiceSummary = [
    selectedAttributes.telecom,
    selectedAttributes.days ? `${selectedAttributes.days}天` : null,
    selectedAttributes.data_amount,
  ]
    .filter(Boolean)
    .join(" | ");

  const variantBtnClass = (selected) =>
    selected
      ? "border-2 border-[#00befa] bg-white text-slate-900 font-semibold"
      : "border border-gray-200 bg-white text-slate-700 hover:border-gray-300";

  const discountCode =
    marketingConfig.couponText?.match(/[：:]\s*([A-Za-z0-9]+)/)?.[1] || "";

  const displayPrice =
    isAllOptionsSelected && currentVariation?.price > 0
      ? currentVariation.price
      : null;
  const displayTotal = displayPrice != null ? displayPrice * quantity : null;

  const handleCopyCoupon = async () => {
    if (!discountCode) return;
    try {
      await navigator.clipboard.writeText(discountCode);
      setCopiedCoupon(true);
      setTimeout(() => setCopiedCoupon(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const handleBuyNow = () => {
    if (!canPurchase) return;
    handleAddToCart();
    router.push("/Cart");
  };

  const canPurchase =
    isAllOptionsSelected && currentVariation && currentVariation.price > 0;

  const images = useMemo(() => {
    const imgList = [];
    if (product?.image_url)
      imgList.push({ src: product.image_url, alt: product?.name });
    if (product?.image_urls && Array.isArray(product.image_urls)) {
      product.image_urls.forEach((url) => {
        if (url && url !== product.image_url)
          imgList.push({ src: url, alt: product?.name });
      });
    }
    if (imgList.length === 0)
      imgList.push({
        src: "/default-image.jpg",
        alt: product?.name || "Product Image",
      });
    return imgList;
  }, [product]);

  const openGalleryLightbox = useCallback((index) => {
    setGalleryLightboxIndex(index ?? 0);
    setGalleryLightboxOpen(true);
  }, []);

  const goToGallerySlide = useCallback(
    (idx) => {
      setActiveSlide(idx);
      if (images.length > 1) {
        mainSwiper?.slideToLoop?.(idx, 300) ?? mainSwiper?.slideTo(idx, 300);
      } else {
        mainSwiper?.slideTo(0, 300);
      }
    },
    [mainSwiper, images.length],
  );

  if (router.isFallback || !product) return <Layout>載入中...</Layout>;

  const pageSeo = buildProductSeo(
    product,
    currentVariation,
    router.query.category,
  );

  return (
    <Layout seo={pageSeo}>
      <CompatibilityModal
        isOpen={isCompatOpen}
        onClose={() => setIsCompatOpen(false)}
      />
      <DataEstimatorModal
        isOpen={isEstimatorOpen}
        onClose={() => setIsEstimatorOpen(false)}
      />

      <div className="bg-white">
        <div className="max-w-[1280px] mx-auto py-6 lg:py-10 px-4 sm:px-6">
          <nav className="text-xs text-gray-400 mb-6 tracking-wide">
            首頁 / 商店 / {product.name}
          </nav>
        </div>

        <ProductStickyNav
          productName={currentVariation?.title || product.name}
        />

        <div className="max-w-[1280px] sm:mt-20 mx-auto px-4 sm:px-6 pb-16 lg:pb-20">
          <section
            id="purchase-section"
            className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] gap-8 lg:gap-12 mb-16 lg:mb-20 pt-6"
          >
            {/* ========== 左：媒體畫廊 ========== */}
            <div className="w-full lg:sticky lg:top-24 lg:self-start">
              <div className="relative bg-[#f5f5f5] rounded-2xl overflow-hidden border border-gray-100 group">
                {priceSavings > 0 && (
                  <div
                    className="absolute top-0 left-0 z-20 text-white text-[11px] font-bold leading-tight shadow-md"
                    style={{
                      background: ANKER_BLUE,
                      clipPath: "polygon(0 0, 100% 0, 85% 100%, 0 100%)",
                      padding: "10px 28px 10px 12px",
                    }}
                  >
                    省 NT${priceSavings}
                  </div>
                )}
                {images.length > 1 && (
                  <div className="absolute bottom-3 right-3 z-20 bg-black/50 text-white text-xs font-medium px-2.5 py-1 rounded-md">
                    {activeSlide + 1}/{images.length}
                  </div>
                )}

                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        mainSwiper?.slidePrev();
                      }}
                      aria-label="上一張"
                      className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 shadow-md border border-gray-100 flex items-center justify-center text-gray-600 hover:bg-white transition-colors opacity-0 group-hover:opacity-100 sm:opacity-100"
                    >
                      <MaterialIcon name="chevron_left" size={22} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        mainSwiper?.slideNext();
                      }}
                      aria-label="下一張"
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 shadow-md border border-gray-100 flex items-center justify-center text-gray-600 hover:bg-white transition-colors opacity-0 group-hover:opacity-100 sm:opacity-100"
                    >
                      <MaterialIcon name="chevron_right" size={22} />
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={() => openGalleryLightbox(activeSlide)}
                  className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-white/90 border border-gray-100 shadow-sm flex items-center justify-center text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity sm:opacity-100"
                  aria-label="放大檢視"
                >
                  <MaterialIcon name="fullscreen" size={16} />
                </button>

                <Swiper
                  onSwiper={setMainSwiper}
                  loop={images.length > 1}
                  modules={[Navigation]}
                  slidesPerView={1}
                  spaceBetween={0}
                  centeredSlides={false}
                  watchOverflow
                  onSlideChange={(swiper) => setActiveSlide(swiper.realIndex)}
                  className="w-full product-main-swiper aspect-square sm:aspect-[4/3] max-h-[min(72vh,640px)]"
                >
                  {images.map((img, idx) => (
                    <SwiperSlide key={idx}>
                      <button
                        type="button"
                        onClick={() => openGalleryLightbox(idx)}
                        className="relative block w-full h-full min-h-[280px] sm:min-h-[360px] cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00befa] focus-visible:ring-offset-2"
                        aria-label={`放大檢視第 ${idx + 1} 張圖片`}
                      >
                        <Image
                          src={img.src}
                          alt={img.alt || "product"}
                          fill
                          sizes="(max-width: 1024px) 100vw, 55vw"
                          className="object-contain p-3 sm:p-5 pointer-events-none"
                          priority={idx === 0}
                        />
                      </button>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              {/* 縮圖列（單行） */}
              {images.length > 1 && (
                <div className="mt-4 flex gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => goToGallerySlide(idx)}
                      className={`relative shrink-0 w-[72px] h-[72px] sm:w-[80px] sm:h-[80px] rounded-lg overflow-hidden border-2 transition-all ${
                        activeSlide === idx
                          ? "border-[#00befa]"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                      aria-label={`第 ${idx + 1} 張縮圖`}
                      aria-current={activeSlide === idx ? "true" : undefined}
                    >
                      <Image
                        src={img.src}
                        alt=""
                        fill
                        sizes="80px"
                        className="object-cover bg-white"
                      />
                    </button>
                  ))}
                </div>
              )}

              <ProductImageLightbox
                isOpen={galleryLightboxOpen}
                onClose={(idx) => {
                  setGalleryLightboxOpen(false);
                  if (typeof idx === "number") goToGallerySlide(idx);
                }}
                images={images}
                productName={currentVariation?.title || product.name}
                initialIndex={galleryLightboxIndex}
              />

              <div className="mt-4 inline-flex rounded-full border border-gray-200 p-0.5 bg-white">
                <button
                  type="button"
                  onClick={() => setMediaTab("overview")}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                    mediaTab === "overview"
                      ? "bg-slate-900 text-white"
                      : "text-gray-600 hover:text-slate-900"
                  }`}
                >
                  <MaterialIcon
                    name="view_agenda"
                    size={14}
                    className="opacity-80"
                  />
                  概覽
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMediaTab("specs");
                    document
                      .getElementById("product-tabs")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                    mediaTab === "specs"
                      ? "bg-slate-900 text-white"
                      : "text-gray-600 hover:text-slate-900"
                  }`}
                >
                  <MaterialIcon name="install_mobile" size={14} />
                  安裝說明
                </button>
              </div>

              {mediaTab === "overview" && (
                <ProductOverviewNotices
                  notices={overviewNotices}
                  carrierFallback={marketingConfig}
                />
              )}
            </div>

            {/* ========== 右：商品資訊與選購 ========== */}
            <div className="w-full flex flex-col">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div className="flex flex-wrap gap-2">
                  <span className="inline-block bg-amber-100 text-amber-800 text-[11px] font-bold px-2.5 py-1 rounded-md">
                    eSIM
                  </span>
                  {activeCarrierInfo.badges?.map((b, i) => (
                    <span
                      key={i}
                      className="inline-block bg-slate-100 text-slate-700 text-[11px] font-bold px-2.5 py-1 rounded-md"
                    >
                      {b.text} {b.type}
                    </span>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setIsCompatOpen(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 whitespace-nowrap"
                >
                  <MaterialIcon name="phonelink_setup" size={16} />
                  檢查相容性
                </button>
              </div>

              <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-slate-900 leading-tight tracking-tight mb-3">
                {currentVariation?.title || product.name}
              </h1>

              <a
                href="#product-reviews"
                className="inline-flex items-center gap-1.5 text-sm text-[#00befa] font-semibold hover:underline mb-5 w-fit"
              >
                <span className="inline-flex items-center gap-0.5 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <MaterialIcon key={i} name="star" size={16} filled />
                  ))}
                </span>
                查看用戶評論
              </a>

              {/* 價格區 */}
              <div className="flex flex-wrap items-center gap-3 mb-4 pb-5 border-b border-gray-100">
                <p
                  className={`text-3xl sm:text-4xl font-bold tracking-tight ${
                    isAllOptionsSelected && currentVariation?.price > 0
                      ? "text-slate-900"
                      : "text-gray-300"
                  }`}
                >
                  {isAllOptionsSelected && currentVariation ? (
                    currentVariation.price > 0 ? (
                      `NT$${currentVariation.price}`
                    ) : (
                      <span className="inline-flex items-center gap-1.5">
                        <MaterialIcon name="warning" size={20} />
                        尚未定價
                      </span>
                    )
                  ) : (
                    "請選擇規格"
                  )}
                </p>
                {priceSavings > 0 && (
                  <span className="inline-block bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-md">
                    省 NT${priceSavings}
                  </span>
                )}
              </div>
              <p className="text-sm mb-5 -mt-2">
                <a
                  href="/login"
                  className="inline-flex items-center gap-1 font-semibold hover:underline"
                  style={{ color: ANKER_BLUE }}
                >
                  登入會員享更多優惠
                  <MaterialIcon name="arrow_forward" size={16} />
                </a>
              </p>

              {marketingConfig.couponText && (
                <div
                  className={`flex items-stretch rounded-xl border border-dashed overflow-hidden mb-6 ${marketingConfig.borderColor} ${marketingConfig.bgColor}`}
                >
                  <div
                    className="text-white px-5 py-4 flex flex-col items-center justify-center font-bold shrink-0 min-w-[88px] border-r border-dashed border-white/30"
                    style={{ background: ANKER_BLUE }}
                  >
                    <span className="text-lg leading-none">優惠</span>
                  </div>
                  <div className="flex-1 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-slate-800">
                    <span className="font-medium leading-relaxed">
                      {marketingConfig.couponText}
                    </span>
                    {discountCode && (
                      <button
                        type="button"
                        onClick={handleCopyCoupon}
                        className="shrink-0 text-sm font-bold hover:underline w-fit"
                        style={{ color: ANKER_BLUE }}
                      >
                        {copiedCoupon ? "已複製！" : "複製折扣碼"}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Key Features */}
              <div className="mb-6 border-b border-gray-100 pb-5">
                <button
                  type="button"
                  onClick={() => setFeaturesOpen((v) => !v)}
                  className="flex w-full items-center justify-between text-left font-bold text-slate-900 mb-3"
                >
                  <span>重點特色</span>
                  <span
                    className={`text-gray-400 transition-transform inline-flex ${featuresOpen ? "rotate-180" : ""}`}
                  >
                    <MaterialIcon name="expand_more" size={22} />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {featuresOpen && (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-2.5 text-sm text-slate-600 leading-relaxed overflow-hidden"
                    >
                      {introBullets.length > 0 ? (
                        introBullets.map((line, i) => (
                          <li
                            key={i}
                            className="flex gap-2 items-start list-none"
                          >
                            <span className="text-[#00befa] shrink-0 mt-0.5">
                              •
                            </span>
                            <FeatureBulletText className="flex-1 min-w-0">
                              {line}
                            </FeatureBulletText>
                          </li>
                        ))
                      ) : (
                        <li className="text-gray-400 text-sm list-none">
                          {carrierName && carrierName !== "default"
                            ? "此電信商尚未設定重點特色。"
                            : "請先選擇電信商以查看重點特色。"}
                        </li>
                      )}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>

              {/* 規格選擇（Anker Choice） */}
              <h2 className="text-sm font-bold text-slate-900 mb-4">
                方案選擇
                {choiceSummary ? (
                  <span className="font-normal text-gray-500 ml-1">
                    ：{choiceSummary}
                  </span>
                ) : null}
              </h2>

              {availableCarriers.length > 0 && (
                <div className="mb-5">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-3">
                    電信商
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {availableCarriers.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleAttributeSelect("telecom", opt)}
                        className={`px-4 py-3 text-sm rounded-xl transition-all text-left ${variantBtnClass(selectedAttributes["telecom"] === opt)}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {availableDays.length > 0 && (
                <div className="mb-5">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-3">
                    天數
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {availableDays.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleAttributeSelect("days", opt)}
                        className={`px-4 py-3 text-sm rounded-xl transition-all ${variantBtnClass(String(selectedAttributes["days"]) === String(opt))}`}
                      >
                        {opt} 天
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {availableData.length > 0 && (
                <div className="mb-5">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-3">
                    數據量
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {availableData.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() =>
                          handleAttributeSelect("data_amount", opt)
                        }
                        className={`px-4 py-3 text-sm rounded-xl transition-all text-left ${variantBtnClass(selectedAttributes["data_amount"] === opt)}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentVariation?.tags && currentVariation.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 my-4">
                  {currentVariation.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-sky-50 text-sky-700 border border-sky-100 px-2.5 py-1 rounded-full text-xs font-bold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <AnimatePresence mode="wait">
                {currentVariation && (
                  <motion.div
                    key={currentVariation.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="my-5 p-4 rounded-xl grid grid-cols-2 gap-y-3 gap-x-4 text-sm bg-slate-50 border border-gray-100"
                  >
                    <div className="flex items-center gap-2.5">
                      <MaterialIcon
                        name="public"
                        size={20}
                        className="text-slate-500"
                      />
                      <span className="font-semibold text-slate-700">
                        {currentVariation.attributes?.ip_type || "日本 IP"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <MaterialIcon
                        name="diamond"
                        size={20}
                        className="text-slate-500"
                      />
                      <span className="font-semibold text-slate-700">
                        {currentVariation.attributes?.route_type || "日本原生"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <MaterialIcon
                        name="signal_cellular_alt"
                        size={20}
                        className="text-slate-500"
                      />
                      <span className="font-semibold text-slate-700">
                        {currentVariation.attributes?.network || "4G / LTE"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <MaterialIcon
                        name="bolt"
                        size={20}
                        className="text-slate-500"
                      />
                      <span className="font-semibold text-slate-700">
                        {currentVariation.attributes?.speed_rule ||
                          "依 FUP 規範限制"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 col-span-2 pt-3 border-t border-gray-100">
                      <MaterialIcon
                        name="check_circle"
                        size={20}
                        className="text-emerald-600 shrink-0"
                      />
                      <span className="font-semibold text-slate-600 text-xs leading-relaxed">
                        支援：{" "}
                        {currentVariation.attributes?.apps ||
                          "Google, IG, FB, Line, 熱點分享"}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 數量 */}
              <div className="mb-6">
                <p className="text-sm font-bold text-slate-900 mb-3">數量</p>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white w-[140px]">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-11 h-11 flex items-center justify-center text-gray-500 hover:bg-gray-50"
                    aria-label="減少數量"
                  >
                    <MaterialIcon name="remove" size={20} />
                  </button>
                  <div className="flex-1 h-11 flex items-center justify-center font-bold text-slate-800 border-x border-gray-100">
                    {quantity}
                  </div>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-11 h-11 flex items-center justify-center text-gray-500 hover:bg-gray-50"
                    aria-label="增加數量"
                  >
                    <MaterialIcon name="add" size={20} />
                  </button>
                </div>
              </div>

              {/* 確認您的選擇（Anker Review Your Selections） */}
              <div className="rounded-xl bg-[#f5f5f5] p-4 sm:p-5 mb-5">
                <p className="text-sm font-bold text-slate-900 mb-4">
                  確認您的選擇
                </p>
                <div className="flex gap-3 sm:gap-4">
                  <div className="relative w-16 h-16 sm:w-[72px] sm:h-[72px] shrink-0 rounded-lg overflow-hidden bg-white border border-gray-200">
                    <Image
                      src={images[0]?.src || "/default-image.jpg"}
                      alt=""
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                      {currentVariation?.title || product.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {choiceSummary || "請選擇方案規格"}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-gray-500 shrink-0">
                    ×{quantity}
                  </span>
                </div>
                <p
                  className="text-sm font-semibold mt-4"
                  style={{ color: ANKER_BLUE }}
                >
                  •{" "}
                  {canPurchase
                    ? "現貨供應 — 下單後 Email 寄送 eSIM QR Code"
                    : "請先選擇完整規格以查看供貨狀態"}
                </p>
              </div>

              {/* 價格與雙 CTA（Anker Add to Cart + Buy Now） */}
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <p
                  className={`text-3xl sm:text-[34px] font-bold tracking-tight ${
                    displayPrice != null ? "text-slate-900" : "text-gray-300"
                  }`}
                >
                  {displayTotal != null
                    ? `NT$${displayTotal}`
                    : displayPrice != null
                      ? `NT$${displayPrice}`
                      : "請選擇規格"}
                </p>
                {priceSavings > 0 && (
                  <span className="inline-block bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded">
                    省 NT${priceSavings}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!canPurchase}
                  className={`h-[52px] font-bold rounded-lg text-[15px] border-2 transition-all ${
                    canPurchase
                      ? "bg-white hover:bg-sky-50"
                      : "border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50"
                  }`}
                  style={
                    canPurchase
                      ? { borderColor: ANKER_BLUE, color: ANKER_BLUE }
                      : undefined
                  }
                >
                  {!isAllOptionsSelected
                    ? "請選規格"
                    : currentVariation?.price > 0
                      ? "加入購物車"
                      : "尚未定價"}
                </button>
                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={!canPurchase}
                  className={`h-[52px] font-bold rounded-lg text-[15px] text-white transition-all ${
                    canPurchase
                      ? "hover:opacity-90 shadow-md"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                  style={canPurchase ? { background: ANKER_BLUE } : undefined}
                >
                  立即購買
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsEstimatorOpen(true)}
                className="mt-4 w-full inline-flex items-center justify-center gap-1 text-xs font-semibold text-gray-500 hover:text-[#00befa] transition-colors"
              >
                <MaterialIcon name="calculate" size={16} />
                不確定流量？開啟流量試算器
                <MaterialIcon name="arrow_forward" size={14} />
              </button>

              <ServiceBenefits />
            </div>
          </section>

          <ProductTabs
            product={product}
            selectedCarrier={carrierName}
            onProductUpdate={(patch) =>
              setProduct((prev) => ({ ...prev, ...patch }))
            }
          />
          <ReviewsSection productId={product.id} />
        </div>
      </div>
    </Layout>
  );
}
