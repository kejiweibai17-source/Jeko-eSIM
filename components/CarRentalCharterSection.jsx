"use client";

import Link from "next/link";
import MobileCardCarousel from "./MobileCardCarousel";

/** 假資料 — 之後可改 CMS / 聯盟 API */
const CAR_TYPES = [
  {
    label: "SUV",
    image:
      "https://images.unsplash.com/photo-1519641471654-76ecead13aef?w=400&q=80",
    href: "#",
  },
  {
    label: "七人座",
    image: "/images/fv_img01.webp",
    href: "#",
  },
  {
    label: "商務車",
    image:
      "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=400&q=80",
    href: "#",
  },
  {
    label: "電動車",
    image:
      "https://images.unsplash.com/photo-1593941707882-a5bba14938bc?w=400&q=80",
    href: "#",
  },
];

function DecoDot({ className, color = "white" }) {
  return (
    <span
      className={`absolute rounded-full opacity-90 ${className}`}
      style={{ backgroundColor: color }}
    />
  );
}

/** 卡片 1：藍底圖文促銷 */
function PromoCard() {
  return (
    <Link
      href="#"
      className="group relative flex min-h-[200px] sm:min-h-[220px] lg:min-h-[240px] flex-col items-center justify-center overflow-hidden rounded-[20px] bg-[#2B6CE8] p-6 text-center text-white shadow-sm transition-transform duration-300 hover:scale-[1.01] hover:shadow-md"
    >
      {/* 裝飾圖形 */}
      <DecoDot className="top-4 left-6 h-2 w-2" color="#FFD43A" />
      <DecoDot className="top-8 right-10 h-1.5 w-1.5" color="#7DD3FC" />
      <DecoDot className="bottom-10 left-12 h-2.5 w-2.5" color="#F9A8D4" />
      <DecoDot className="bottom-6 right-8 h-2 w-2" color="#86EFAC" />
      <span className="absolute top-5 right-6 text-lg opacity-80">✦</span>
      <span className="absolute bottom-8 left-8 text-sm opacity-70">〜</span>
      <span className="absolute top-1/2 left-4 text-xs opacity-50 rotate-12">
        ★
      </span>

      <p className="relative z-10 text-[11px] sm:text-xs font-bold tracking-wide opacity-95">
        出國移動更輕鬆
      </p>
      <p
        className="relative z-10 mt-2 text-[56px] sm:text-[64px] lg:text-[72px] font-black leading-none tracking-tight"
        style={{
          fontFamily: "system-ui, sans-serif",
          textShadow: "2px 2px 0 rgba(0,0,0,0.08)",
          letterSpacing: "-0.02em",
        }}
      >
        <span className="inline-block border-b-4 border-dotted border-white/40 pb-1">
          24H
        </span>
      </p>
      <p className="relative z-10 mt-3 text-[11px] sm:text-xs font-bold leading-relaxed px-2">
        機場接送・包車觀光
        <br />
        預約即享專屬優惠！
      </p>
    </Link>
  );
}

/** 卡片 2：左文 + 右側車型網格 */
function VehicleTypesCard() {
  return (
    <div className="flex min-h-[200px] sm:min-h-[220px] lg:min-h-[240px] overflow-hidden rounded-[20px] bg-[#2B6CE8] shadow-sm transition-transform duration-300 hover:scale-[1.01] hover:shadow-md">
      <div className="flex w-[38%] sm:w-[36%] flex-col justify-center px-4 sm:px-5 py-4 text-white shrink-0">
        <p className="text-xl sm:text-2xl font-black leading-tight tracking-tight">
          多元
          <br />
          車型
        </p>
        <p className="mt-3 text-[10px] sm:text-[11px] font-medium leading-relaxed opacity-90">
          自駕租車
          <br />
          專業包車
        </p>
      </div>
      <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-1.5 p-2 sm:p-2.5 bg-[#2563c7]">
        {CAR_TYPES.map((car) => (
          <Link
            key={car.label}
            href={car.href}
            className="group/cell relative overflow-hidden rounded-xl bg-slate-900/20"
          >
            <img
              src={car.image}
              alt={car.label}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover/cell:scale-105"
            />
            <span className="absolute bottom-1.5 right-1.5 rounded-md bg-white/95 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold text-gray-800 shadow-sm">
              {car.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

/** 卡片 3：全幅圖片 + 置中框線標題 */
function CharterPhotoCard() {
  return (
    <Link
      href="#"
      className="group relative flex min-h-[200px] sm:min-h-[220px] lg:min-h-[240px] overflow-hidden rounded-[20px] shadow-sm transition-transform duration-300 hover:scale-[1.01] hover:shadow-md"
    >
      <img
        src="/images/01_main_visual_PC_2-720x405.jpg.webp"
        alt="包車旅遊"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-black/10" />

      <p className="absolute top-4 left-0 right-0 text-center text-[11px] sm:text-xs font-bold text-white/95 tracking-wide z-10">
        家庭出遊・商務接送・一日遊包車
      </p>

      <div className="absolute inset-0 flex items-center justify-center z-10 px-6">
        <div className="rounded-lg border-2 border-white px-6 py-4 sm:px-8 sm:py-5 text-center bg-black/10 backdrop-blur-[2px]">
          <p className="text-lg sm:text-xl font-black text-white tracking-widest leading-tight">
            Jeko
          </p>
          <p className="text-sm sm:text-base font-bold text-white mt-1 tracking-[0.2em]">
            包車服務
          </p>
        </div>
      </div>
    </Link>
  );
}

export default function CarRentalCharterSection() {
  return (
    <section
      id="car-rental-charter"
      className="w-full bg-[#f0f1f3] pt-12 lg:pt-14 pb-4 scroll-mt-28"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* 標題列：大標 + 右側副標（同參考圖） */}
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-6 lg:mb-8">
          <h2 className="text-2xl sm:text-[28px] font-black text-gray-900 tracking-tight">
            租車包車服務
          </h2>
          <p className="text-sm text-gray-500 font-medium">
            機場接送・包車觀光・自駕租車，一站式預約
          </p>
        </div>

        {/* 手機版輪播 */}
        <div className="md:hidden">
          <MobileCardCarousel slideClassName="min-w-0 flex-[0_0_88%]">
            <PromoCard />
            <VehicleTypesCard />
            <CharterPhotoCard />
          </MobileCardCarousel>
        </div>

        {/* 桌面版三欄 */}
        <div className="hidden md:grid grid-cols-3 gap-4 lg:gap-5">
          <PromoCard />
          <VehicleTypesCard />
          <CharterPhotoCard />
        </div>

        <p className="mt-4 text-center text-[11px] text-gray-400">
          包車合作夥伴預約連結
        </p>
      </div>
    </section>
  );
}
