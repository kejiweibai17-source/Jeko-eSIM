"use client";

import Image from "next/image";
import MobileCardCarousel from "./MobileCardCarousel";

const RECOMMEND_SLIDES = [
  "/images/九州01.png",
  "/images/中國.png",
  "/images/優惠banner04.png",
  "/images/韓國01.png",
  "/images/九州01.png",
  "/images/中國.png",
  "/images/韓國01.png",
];

function RecommendSlide({ src, index, sizes }) {
  return (
    <div className="relative w-full aspect-[16/9] sm:aspect-[16/8] overflow-hidden rounded-[15px] bg-black">
      <Image
        src={src}
        alt={`Jeko 推薦 ${index + 1}`}
        fill
        className="object-cover object-center"
        sizes={sizes}
        priority={index < 2}
      />
    </div>
  );
}

export default function JekoRecommendSection() {
  const renderSlides = () =>
    RECOMMEND_SLIDES.map((src, index) => (
      <RecommendSlide
        key={`recommend-${index}`}
        src={src}
        index={index}
        sizes="(max-width: 768px) 88vw, 50vw"
      />
    ));

  return (
    <section
      id="jeko-recommend"
      className="w-full bg-[#f0f1f3] pt-12 lg:pt-14 pb-4 scroll-mt-28"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-4 lg:mb-6">
          <h2 className="text-2xl sm:text-[28px] font-black text-gray-900 tracking-tight">
            Jeko 推薦專區
          </h2>
          <p className="text-sm text-gray-500 font-medium">
            精選 eSIM 方案・旅遊優惠・出國必備
          </p>
        </div>

        {/* 手機版：與租車包車區相同，單張 88% 露出下一張 */}
        <div className="md:hidden">
          <MobileCardCarousel slideClassName="min-w-0 flex-[0_0_88%]">
            {renderSlides()}
          </MobileCardCarousel>
        </div>

        {/* 桌面版：可視區兩張，每次滑動兩張 */}
        <div className="hidden md:block">
          <MobileCardCarousel
            slideClassName="min-w-0 flex-[0_0_50%]"
            slidesToScroll={2}
            autoplayDelay={5000}
            loop
          >
            {renderSlides()}
          </MobileCardCarousel>
        </div>
      </div>
    </section>
  );
}
