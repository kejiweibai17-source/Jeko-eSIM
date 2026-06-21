"use client";

import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Layout from "./Layout";
import FeatureCarousel from "../components/FeatureCarousel.jsx";
import AccordionEsim from "../components/AccordionEsim.jsx";
import Carousel from "../components/EmblaCarouselTravel/index.jsx";
import Project from "../components/ServiceSection.jsx";
import SvgCard from "../components/SvgHoverCard.jsx";
import { ArrowRight } from "lucide-react";
import Image from "next/image.js";
import MaskText from "../components/MaskText.jsx";
import Slider from "../components/Slider.jsx";
// GSAP & Lenis Imports
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import InfiniteCarousel from "@/components/InfiniteCarousel"; // 🌟 引入剛剛建好的組件
import CarRentalCharterSection from "../components/CarRentalCharterSection.jsx";
import AccommodationRecommendSection from "../components/AccommodationRecommendSection.jsx";
const VuckoScroll = dynamic(() => import("@/components/CodegridScroll"), {
  ssr: false,
});

// 輔助組件：快速連結按鈕
function QuickLinkButton({ text, active = false, link = "#" }) {
  return (
    <a href={link} className="group block">
      <div className="flex justify-center lg:justify-end items-center">
        <div
          className={`py-2 lg:py-2 flex items-center px-5 rounded-[30px] w-full lg:w-auto shadow-sm transition-all duration-200 ${
            active ? "bg-white" : "bg-white lg:bg-transparent lg:hover:bg-white"
          }`}
        >
          <div
            className={`w-[8px] h-[8px] rounded-full shrink-0 transition-all duration-300 ${
              active
                ? "bg-[#2d7ee7]"
                : "bg-[#2d7ee7] lg:hidden lg:group-hover:block"
            }`}
          ></div>
          <div className="ml-3 tracking-widest font-bold text-[14px] text-slate-700 group-hover:text-[#147AD7]">
            {text}
          </div>
        </div>
      </div>
    </a>
  );
}

export default function Home() {
  const containerRef = useRef(null);

  // ★ Notification 區塊狀態
  const [activeTab, setActiveTab] = useState(0);
  const newsContainerRef = useRef(null);

  // ★ 安裝教學區塊狀態 (iOS/Android 切換)
  const [activeSystem, setActiveSystem] = useState("ios");

  // ★ Banner 輪播狀態設定 (停留再滑動版本)
  const bannerImages = [
    "/images/優惠折扣.png",
    "/images/出國必備.png",
    "/images/立即租車.png",
  ];
  // 為了讓輪播能無縫循環，我們將陣列複製一次變成 6 張 [1, 2, 3, 1, 2, 3]
  const loopedBanners = [...bannerImages, ...bannerImages];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);

  // 自動輪播計時器 (每 3.5 秒滑動一次)
  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true); // 開啟滑動過渡動畫
      setCurrentIndex((prev) => prev + 1);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  // 當滑動動畫結束時觸發
  const handleTransitionEnd = () => {
    // 如果滑到了第二組的第一張 (index === 3)
    if (currentIndex >= bannerImages.length) {
      // 關閉過渡動畫，瞬間切回第一組的第一張 (index === 0)
      setIsTransitioning(false);
      setCurrentIndex(currentIndex - bannerImages.length);
    }
  };

  // --- 資料數據 (Notification) ---
  const newsItems = [
    {
      id: 1,
      date: "2025.09.26",
      tag: "購買流程",
      title: "Jeko eSIM 的購買流程到使用方式",
      link: "#",
    },
    {
      id: 2,
      date: "2025.04.16",
      tag: "實體辦公處",
      title: "目前有實體辦公處，有問題或者合作意願可親洽或者聯絡我們",
      link: "#",
    },
    {
      id: 3,
      date: "2025.03.27",
      tag: "退貨相關",
      title: "eSIM無法安裝/使用？",
      link: "#",
    },
    {
      id: 4,
      date: "2025.02.23",
      tag: "支付方式",
      title: "Jeko 提供街口支付、Line pay  等等主流付款方式 ",
      link: "#",
    },
    {
      id: 5,
      date: "2025.02.11",
      tag: "新着情報",
      title:
        "（採用）LINE公式アカウント・Lステップ構築の制作実績を追加しました。",
      link: "#",
    },
  ];

  const promoItems = [
    {
      id: 101,
      date: "2025.10.01",
      tag: "限時優惠",
      title: "【秋季旅展】日本 eSIM 買一送一，限時 3 天搶購！",
      link: "#",
    },
    {
      id: 102,
      date: "2025.09.15",
      tag: "會員專屬",
      title: "加入官方 LINE 好友，即刻領取 $50 折扣碼",
      link: "#",
    },
    {
      id: 103,
      date: "2025.08.30",
      tag: "新品上市",
      title: "歐洲 33 國通用 eSIM 全新上線，早鳥優惠價實施中",
      link: "#",
    },
  ];

  const filters = ["最新消息/公告", "特價/優惠"];
  const displayItems = activeTab === 0 ? newsItems : promoItems;

  // --- 資料數據 (安裝步驟) ---
  const iosSteps = [
    {
      step: 1,
      title: "進入設定",
      desc: "前往「設定」>「行動服務」> 點擊「加入 eSIM」。",
    },
    {
      step: 2,
      title: "掃描 QR Code",
      desc: "選擇「使用行動條碼」，掃描我們寄給您的 QR Code。若無法掃描，可手動輸入啟用碼。",
    },
    {
      step: 3,
      title: "設定標籤",
      desc: "將此 eSIM 標籤設為「旅遊」或「Jeko」，並將其設為「行動數據」的預設號碼 (僅在抵達目的地後切換)。",
    },
    {
      step: 4,
      title: "抵達後啟用",
      desc: "抵達目的地後，開啟此 eSIM 的「數據漫遊」，即可開始上網。",
    },
  ];

  const androidSteps = [
    {
      step: 1,
      title: "進入設定",
      desc: "前往「設定」>「網路和網際網路」>「SIM 卡」> 點擊「下載 SIM 卡」。",
    },
    {
      step: 2,
      title: "掃描 QR Code",
      desc: "掃描我們寄給您的 QR Code。若無法掃描，點擊「需要協助」手動輸入啟用碼。",
    },
    {
      step: 3,
      title: "下載並確認",
      desc: "確認下載 Jeko eSIM，下載過程需保持網路連線。",
    },
    {
      step: 4,
      title: "抵達後啟用",
      desc: "抵達目的地後，開啟此 eSIM 並開啟「數據漫遊」，將其設為上網專用卡。",
    },
  ];

  const currentSteps = activeSystem === "ios" ? iosSteps : androidSteps;

  const ArrowIcon = () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      className="transition-transform group-hover:translate-x-[2px]"
    >
      <path
        d="M8 5l8 7-8 7"
        stroke="#fff"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  // --- 動畫邏輯 (Hero Scroll) ---
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const lenis = new Lenis();
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);

      const windowContainer = document.querySelector(".jesko-window-container");
      const skyContainer = document.querySelector(".jesko-sky-container");
      const handContainer = document.querySelector(".jesko-hand-container");

      if (!windowContainer || !skyContainer) return;

      const skyContainerHeight = skyContainer.offsetHeight;
      const viewportHeight = window.innerHeight;
      const skyMoveDistance = skyContainerHeight - viewportHeight;

      ScrollTrigger.create({
        trigger: ".jesko-hero",
        start: "top top",
        // 🌟 核心修正：把原本的 window.innerHeight * 3 縮短成 150% (1.5倍)
        // 這樣就不會再有長長的空白間距，而且下個區塊會緊接而上！
        end: "+=150%",
        pin: true,
        pinSpacing: true,
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;

          // 讓視窗穩定放大
          let windowScale;
          if (progress <= 0.6) {
            windowScale = 1 + (progress / 0.6) * 4; // 放大 5 倍確保穿梭過去
          } else {
            windowScale = 5;
          }
          gsap.set(windowContainer, { scale: windowScale });

          // 天空背景平滑往下
          gsap.set(skyContainer, {
            y: -progress * skyMoveDistance * 0.8,
          });

          // 手部往左滑並淡出
          if (handContainer) {
            gsap.set(handContainer, {
              x: -progress * window.innerWidth * 1.5,
              opacity: 1 - progress * 2,
            });
          }

          // 🌟 (已把會讓文字消失的錯誤程式碼刪除，保留原始設計)
        },
      });
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  // --- 動畫邏輯 (Notification List Switch) ---
  useLayoutEffect(() => {
    if (!newsContainerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".news-item",
        {
          y: 30,
          opacity: 0,
          filter: "blur(4px)",
        },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.5,
          stagger: 0.08,
          ease: "power2.out",
          clearProps: "all",
        },
      );
    }, newsContainerRef);

    return () => ctx.revert();
  }, [activeTab]);

  return (
    <Layout>
      <div ref={containerRef} className="bg-[#f6f6f6] pb-20">
        <style jsx global>{`
          @import url("https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap");

          .jesko-hero {
            position: relative;
            width: 100%;
            height: 100vh;
            overflow: hidden;
            perspective: 1000px;
            color: #fff;
            font-family: "Instrument Serif", sans-serif;
            background-color: #000;
          }

          .jesko-sky-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 350vh;
            z-index: 1;
            will-change: transform;
          }

          .jesko-sky-bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            z-index: 1;
          }

          .jesko-cloud-container {
            position: absolute;
            top: -15%;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 2;
            overflow: hidden;
            pointer-events: none;
          }

          .jesko-cloud-track {
            display: flex;
            width: 200%;
            height: 100%;
            will-change: transform;
            animation: jeskoMarquee 60s linear infinite;
          }

          .jesko-cloud-track img {
            width: 50%;
            height: 100%;
            object-fit: cover;
            opacity: 0.9;
            -webkit-mask-image: linear-gradient(
              to right,
              transparent,
              black 10%,
              black 90%,
              transparent
            );
            mask-image: linear-gradient(
              to right,
              transparent,
              black 10%,
              black 90%,
              transparent
            );
          }

          .jesko-hero-copy {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 3;
            text-align: center;
            will-change: transform;
          }

          .jesko-window-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            z-index: 4;
            pointer-events: none;
            will-change: transform;
          }

          .jesko-window-container img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .jesko-hero-header {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            padding: 2rem;
            display: flex;
            transform-style: preserve-3d;
            z-index: 5;
            pointer-events: none;
            will-change: transform;
          }

          .jesko-hero-header h1 {
            font-size: clamp(3rem, 5vw, 6rem);
            line-height: 0.9;
            font-weight: 500;
          }

          .jesko-hero-header p {
            font-size: 1.2rem;
            width: 60%;
          }

          .jesko-hero-copy h1 {
            width: 85%;
            font-size: clamp(2rem, 4vw, 5rem);
            font-weight: 500;
            line-height: 1.1;
          }

          @keyframes jeskoMarquee {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }

          /* ★ 新增：控制 Banner 停留再滑動的 CSS */
          .slider-track {
            transform: translateX(calc(var(--current-index) * -100%));
            will-change: transform;
          }
          @media (min-width: 768px) {
            .slider-track {
              /* 桌面版一次顯示 3 張，所以每次滑動是 33.333% 的父容器寬度 */
              transform: translateX(calc(var(--current-index) * -33.333333%));
            }
          }

          @media (max-width: 1000px) {
            .jesko-hero-header h1 {
              font-size: 2.5rem;
            }
            .jesko-hero-copy h1 {
              font-size: 2rem;
            }
          }
        `}</style>
        <section className="mb-0">
          <Slider />
          {/* <InfiniteCarousel /> */}
        </section>

        {/* 
        <section className="jesko-hero relative h-sreen">
          <div className="jesko-hand-container will-change-transform absolute max-w-[700px] md:h-[60vh] h-[50vh] xl:h-screen z-[99999] left-[-30%] md:left-0 top-[60%] md:top-0 md:w-[80vw] w-[80vw] xl:w-[40vw]">
            <div className="relative h-full">
              <div className="hand absolute left-[60%] top-[23%] -translate-y-1/2 z-[999]">
                <Image
                  src="/即買即用.png"
                  className="w-[230px]"
                  width={1000}
                  height={1000}
                  alt="即買即用"
                />
              </div>
              <div className="hand absolute left-[25%] top-[18%] -translate-y-1/2 z-[999]">
                <Image
                  src="/掃qrcode.png"
                  className="w-[230px]"
                  width={1000}
                  height={1000}
                  alt="掃qrcode"
                />
              </div>
              <div className="hand absolute left-0 bottom-0 z-50">
                <Image
                  src="/hand01.png"
                  className="w-[600px]"
                  width={1000}
                  height={1000}
                  alt="hand"
                />
              </div>
            </div>
          </div>

          <div className="logo-txt absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-50">
            <div className="flex flex-col items-center">
              <p className="text-[40px]">Jeko eSIM</p>
              <AlertBtn />
              <div className="group relative inline-flex cursor-default mt-4">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-400 to-white opacity-0 transition-all duration-300 group-hover:translate-x-1.5 group-hover:translate-y-1.5 group-hover:opacity-100 shadow-inner" />
                <div className="relative z-10 inline-flex items-center justify-center overflow-hidden rounded-full bg-[#e46e2a] px-4 py-2 text-md text-gray-50 shadow-sm shadow-stone-600 transition-all duration-300 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-hover:shadow-none">
                  <span className="relative inline-flex overflow-hidden">
                    <span className="translate-x-0 skew-x-0 transition-transform duration-500 group-hover:translate-x-[150%] group-hover:skew-x-12">
                      出國旅遊的好夥伴
                    </span>
                    <span className="absolute inset-0 -translate-x-[150%] skew-x-12 transition-transform duration-500 group-hover:translate-x-0 group-hover:skew-x-0">
                      出國旅遊的好夥伴
                    </span>
                  </span>
                </div>
              </div>
              <div className="flex mt-4 justify-center items-center">
                <span>方便 ｜</span>
                <span>快速 ｜</span>
                <span>即買即用 </span>
              </div>
            </div>
          </div>

          <div className="jesko-sky-container">
            <img src="/sky.jpg" alt="Sky Background" className="jesko-sky-bg" />
            <div className="jesko-cloud-container">
              <div className="jesko-cloud-track">
                <img src="/cloud.png" alt="Clouds" />
                <img src="/cloud.png" alt="Clouds" />
              </div>
            </div>
          </div>

          <div className="jesko-window-container">
            <img src="/window.png" alt="Plane Window" />
          </div>

          <div className="jesko-hero-header"></div>
        </section> */}

        <section className=" rounded-br-[60px] mt-20 rounded-bl-[60px] lg:rounded-br-[130px] lg:rounded-bl-[130px] pb-10  ">
          <div className="flex flex-col pt-4 lg:flex-row max-w-[1250px] mx-auto justify-between px-6 lg:px-0">
            <div className="txt">
              <MaskText blockColor="#30AE99">
                <h2 className="text-stone-900 tracking-widest text-xl lg:text-5xl font-normal ">
                  快速找到您想去的<br></br> <br></br>{" "}
                  <span className="block text-stone-900 tracking-widest mt-0 md:mt-5 text-3xl lg:text-6xl !font-extrabold ml-0  ">
                    旅遊 eSIM
                  </span>
                </h2>
              </MaskText>
              <MaskText blockColor="#30AE99">
                <p className="text-stone-800 font-normal text-[14px] lg:text-[16px] mt-4 md:mt-6  ">
                  在 Jeko 探索 經濟高效的旅遊數據方案
                  <br className="hidden lg:block"></br>
                  隨時隨地無縫連接 告別昂貴的國際漫遊費
                </p>
              </MaskText>
            </div>
            <div className="flex  items-end">
              <div>
                <span className=" rounded-full px-3 py-1  mx-2  text-[14px]">
                  . 旅遊eSIM
                </span>
                <span className=" rounded-full px-3 py-1  mx-2  text-[14px]">
                  . 商務留學用eSIM
                </span>
                <span className=" rounded-full px-3 py-1  mx-2  text-[14px]">
                  . 各國旅遊eSIM方案
                </span>
              </div>
            </div>
          </div>
          <Project />
        </section>

        <CarRentalCharterSection />
        <AccommodationRecommendSection />
        {/*       
        <section className="relative w-full     overflow-hidden ">
          <div className="z-[9999] relative ">
            <div className="max-w-[1400px]   w-full mx-auto   relative z-[9999] overflow-hidden px-4 md:px-0 pb-10">
              <div
                className="flex slider-track"
                style={{
                  "--current-index": currentIndex,
                  transition: isTransitioning
                    ? "transform 0.5s ease-in-out"
                    : "none",
                }}
                onTransitionEnd={handleTransitionEnd}
              >
                {loopedBanners.map((src, index) => (
                  <div
                    key={index}
                    
                    className="relative shrink-0 w-full md:w-[33.333333%] px-2 lg:px-4 group cursor-pointer"
                  >
                    <div className="relative w-full aspect-[1920/790] rounded-[8px] lg:rounded-[9px] overflow-hidden shadow-lg border border-slate-100/50">
                      <Image
                        src={src}
                        alt={`活動 Banner ${index + 1}`}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        priority={index < 3}
                      />
                      <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300"></div>
                    </div>
                  </div>
                ))}
              </div>

      
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                {bannerImages.map((_, dotIndex) => (
                  <button
                    key={dotIndex}
                    onClick={() => {
                      setIsTransitioning(true);
                      setCurrentIndex(dotIndex);
                    }}
                    aria-label={`切換至第 ${dotIndex + 1} 張輪播圖`}
                    className={`h-2 md:h-2.5 rounded-full transition-all duration-300 shadow-sm ${
                      currentIndex % bannerImages.length === dotIndex
                        ? "bg-[#0BAFD7] w-8 md:w-10"
                        : "bg-gray-300 w-2 md:w-2.5 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            </div>

            <FeatureCarousel />
          </div>
 
        </section> */}

        <section className="relative rounded-[32px] z-[99] bg-white/40 border border-white/30 backdrop-blur-[25px] shadow-[0_30px_80px_rgba(36,57,69,0.15)] px-4 sm:px-10 mx-auto mt-[50px] w-[95%] lg:w-[96%] pt-[30px] lg:py-[100px]">
          <MaskText blockColor="#30AE99">
            <div className="main-title max-w-[1000px] mx-auto flex justify-center flex-col items-center text-center">
              <h2 className="text-3xl lg:text-5xl font-bold">如何使用 eSIM?</h2>
              <p className="text-slate-700 text-lg mt-3">
                How to use / Installation
              </p>
            </div>
          </MaskText>
          <div className="rounded-2xl bg-[#EBEEEF] py-10 lg:py-20 max-w-[1500px] mx-auto flex justify-center flex-col items-center mt-8">
            <div className="mb-10 w-full flex justify-around">
              <div className="flex flex-col lg:flex-row w-[90%] lg:w-[80%] mx-auto gap-8 lg:gap-0">
                <div className="w-full lg:w-1/2 flex lg:pr-10 items-center flex-col text-center lg:text-left">
                  <div>
                    <div className="max-w-full lg:max-w-[280px] mx-auto lg:mx-0">
                      <div className="bg-[#30ae99] p-2 rounded-[8px] text-white text-[16px] font-bold inline-block lg:block">
                        無論你去哪裡旅行，保持連線不斷網
                      </div>
                      <h3 className="text-2xl lg:text-3xl font-bold mt-4 lg:mt-2">
                        什麼是 eSIM？
                      </h3>
                    </div>
                    <p className="text-center lg:text-left font-bold mt-2">
                      告別實體 SIM 卡的束縛
                    </p>
                    <p className="mt-4 leading-relaxed text-gray-700 text-sm lg:text-base">
                      eSIM（嵌入式 SIM
                      卡）是新一代的網路技術。無需抽換實體卡片，只需掃描 QR Code
                      設定，抵達目的地後開啟數據漫遊，即可立即連接當地高速網路，省去保管實體卡片的麻煩。
                    </p>
                  </div>
                </div>
                <div className="w-full lg:w-1/2 lg:pr-10">
                  <img
                    src="/images/如何使用esim.png"
                    className="w-full rounded-xl shadow-md"
                    alt="eSIM使用說明"
                  />
                </div>
              </div>
            </div>

            <div className="border-t lg:border-t-0 lg:border-l-4 border-[#147AD7] w-full flex justify-around pt-10 lg:pt-0">
              <div className="flex flex-col lg:flex-row w-[90%] lg:w-[80%] mx-auto gap-8 lg:gap-0">
                <div className="w-full lg:w-1/2 flex items-center flex-col text-center lg:text-left">
                  <div>
                    <h3 className="text-2xl lg:text-3xl font-bold leading-snug">
                      請確保您的手機
                      <br className="hidden lg:block" />
                      已解鎖且支援 eSIM
                    </h3>
                    <p className="text-center lg:text-left font-bold mt-2 text-[#147AD7]">
                      Before You Buy
                    </p>
                    <p className="mt-4 leading-relaxed text-gray-700 text-sm lg:text-base">
                      在購買前，請務必確認您的裝置支援 eSIM
                      功能且未被電信商鎖定（Sim-Lock Free）。 目前市面上新款
                      iPhone （XR/XS 以後機型）及多數 Android 旗艦機種皆已支援。
                    </p>
                  </div>
                </div>
                <div className="w-full lg:w-1/2">
                  <div className="flex flex-col gap-3">
                    <QuickLinkButton text="查看支援裝置列表" active />
                    <QuickLinkButton text="產品相關政策及規範" />
                    <QuickLinkButton
                      text="蝦皮訂單編號快速兌換"
                      link="/shopee-qrcode"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[20px] w-[90%] lg:w-[80%] mx-auto p-6 lg:p-10 mt-16 shadow-sm border border-slate-100">
              <div className="flex justify-center mb-10">
                <div className="bg-[#EBEEEF] p-1 rounded-full inline-flex">
                  <button
                    onClick={() => setActiveSystem("ios")}
                    className={`px-8 py-3 rounded-full font-bold transition-all duration-300 ${activeSystem === "ios" ? "bg-[#147AD7] text-white shadow-md" : "text-gray-500 hover:text-gray-700"}`}
                  >
                    iOS (iPhone)
                  </button>
                  <button
                    onClick={() => setActiveSystem("android")}
                    className={`px-8 py-3 rounded-full font-bold transition-all duration-300 ${activeSystem === "android" ? "bg-[#30ae99] text-white shadow-md" : "text-gray-500 hover:text-gray-700"}`}
                  >
                    Android
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                {currentSteps.map((item, index) => (
                  <div
                    key={index}
                    className="step group border-b border-gray-100 py-4 lg:py-6 last:border-b-0 transition-all duration-300 hover:bg-slate-50 rounded-xl px-2 lg:px-4"
                  >
                    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-8">
                      <div
                        className={`w-[40px] h-[40px] lg:w-[50px] lg:h-[50px] rounded-full text-white flex justify-center items-center font-bold text-lg lg:text-xl shrink-0 transition-colors duration-300 ${activeSystem === "ios" ? "bg-[#428aef]" : "bg-[#30ae99]"}`}
                      >
                        {item.step}
                      </div>
                      <div className="flex flex-col justify-center w-full">
                        <h3 className="text-lg lg:text-xl font-bold text-slate-800 mb-1 group-hover:text-[#147AD7] transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-sm lg:text-base text-slate-600 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                      <div className="hidden lg:block text-gray-300 group-hover:text-[#147AD7] group-hover:translate-x-2 transition-all">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M5 12h14" />
                          <path d="m12 5 7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-lg">
                  <svg
                    className="w-6 h-6 text-[#147AD7] shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    <span className="font-bold text-[#147AD7]">貼心提醒：</span>
                    請務必在有 WiFi 或網路的環境下掃描安裝。掃描後請勿刪除 eSIM
                    方案，一旦刪除將無法再次掃描使用。如果在安裝過程遇到問題，請截圖並聯繫客服。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <img
          src="https://storage.googleapis.com/studio-design-asset-files/projects/8dO8NkVvan/s-1300x100_2d2c9e2f-293f-4f46-8b79-fed8dc5fa5bb.svg"
          alt=""
          className="w-full relative  mt-[-130px] z-10"
        />

        <section className="bg-[#147AD7]  p-6 lg:p-20 relative z-0">
          <div className="max-w-[1400px] mx-auto   w-full">
            <div className="main-title text-center lg:text-left">
              <h2 className="text-white text-4xl lg:text-5xl font-bold tracking-widest">
                Features
              </h2>
              <p className="text-slate-50">特色</p>
            </div>
            <div className="main pt-6 lg:pt-10">
              <div>
                <div className="title flex flex-col lg:flex-row w-full lg:w-[70%] justify-between items-center lg:items-start">
                  <div className="flex flex-col">
                    <h3 className="text-white text-2xl lg:text-3xl">
                      精選全球 eSIM
                    </h3>
                  </div>
                  <div className="flex mt-4 lg:mt-0 flex-wrap justify-center gap-2">
                    <div className="bg-white flex tracking-wider items-center justify-center font-bold rounded-[20px] px-3 py-1 text-[12px] lg:text-[14px]">
                      超快物流
                    </div>
                    <div className="bg-white flex tracking-wider items-center justify-center font-bold rounded-[20px] px-3 py-1 text-[12px] lg:text-[14px]">
                      即時客服
                    </div>
                    <div className="bg-white flex tracking-wider items-center justify-center font-bold rounded-[20px] px-3 py-1 text-[12px] lg:text-[14px]">
                      攻略分享
                    </div>
                  </div>
                </div>
                <div className="w-full lg:w-[30%]"></div>
              </div>
              <div className="chat p-6 lg:p-8 bg-white relative flex flex-col-reverse lg:flex-row rounded-[20px] mt-8 lg:mt-4 overflow-hidden lg:overflow-visible">
                <div className="absolute bottom-[-20px] lg:bottom-[-30px] z-30 left-6 lg:left-10 w-[30px] h-[30px] lg:w-[40px] lg:h-[40px]">
                  <img
                    src="https://storage.googleapis.com/studio-design-asset-files/projects/8dO8NkVvan/s-43x30_bff1345c-8a45-4eed-ad55-45a1705d21db.svg"
                    alt=""
                    className="w-full"
                  />
                </div>
                <div className="left w-full lg:w-[70%] mt-4 lg:mt-0">
                  <AccordionEsim />
                </div>
                <div className="phone w-full lg:w-[30%] relative flex justify-center lg:justify-between items-end h-[200px] lg:h-auto">
                  <img
                    src="https://storage.googleapis.com/studio-design-asset-files/projects/8dO8NkVvan/s-464x928_v-fs_webp_26a92258-9a41-4f50-af8c-624012999e60_small.webp"
                    className="w-[120px] lg:w-[60%] lg:absolute h-auto z-30 lg:left-1/2 lg:-translate-x-1/2 bottom-0"
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#147AD7] w-full overflow-hidden py-2 sm:py-20">
          <div className="mt-8 lg:mt-5">
            <Carousel />
          </div>
          <section className="relative h-auto">
            <SvgCard />
          </section>
        </section>
        <img
          src="https://storage.googleapis.com/studio-design-asset-files/projects/8dO8NkVvan/s-1300x100_2d2c9e2f-293f-4f46-8b79-fed8dc5fa5bb.svg"
          alt=""
          className="w-full rotate-180 mt-[0px] relative z-10"
        />

        <section className="pt-[60px] max-w-[1450px]    w-[93%]  mx-auto  lg:pt-[150px] rounded-[32px] bg-white/40 border border-white/30 backdrop-blur-[25px] shadow-[0_30px_80px_rgba(36,57,69,0.15)] px-4 sm:px-10 mx-auto mt-[-80px] lg:mt-[-220px]  lg:w-[96%] py-[60px] lg:py-[100px] relative z-20 overflow-hidden">
          <div className="flex flex-col max-w-[1450px] mx-auto lg:flex-row gap-12 lg:gap-20">
            <div className="w-full lg:w-1/4 flex flex-col justify-between">
              <div>
                <h2 className="text-6xl font-serif font-bold text-[#0F356B] mb-10 tracking-wide">
                  Notification
                </h2>
                <ul className="space-y-5 mb-10">
                  {filters.map((filter, index) => (
                    <li
                      key={index}
                      onClick={() => setActiveTab(index)}
                      className={`cursor-pointer text-sm font-bold tracking-wide transition-all duration-300 ${activeTab === index ? "text-[#0F356B] translate-x-2" : "text-gray-500 hover:text-[#0F356B] hover:translate-x-1"}`}
                    >
                      <span className="relative inline-block pb-1">
                        {filter}
                        <span
                          className={`absolute bottom-0 left-0 h-[2px] bg-[#0F356B] transition-all duration-300 ${activeTab === index ? "w-full" : "w-0"}`}
                        ></span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-8 flex">
                <a
                  href="/category/all-product/"
                  className="group relative inline-flex items-center justify-center"
                >
                  <div className="absolute inset-0 h-full w-full rounded-full bg-[#0891b2] opacity-0 transition-all duration-300 group-hover:translate-x-1.5 group-hover:translate-y-1.5 group-hover:opacity-100" />
                  <div className="relative z-10 inline-flex items-center justify-center overflow-hidden rounded-full bg-[#2E68C0] px-8 py-3.5 font-bold text-white shadow-lg shadow-[#384a72] first-letter:transition-all duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:shadow-[#0960c3]">
                    <span className="relative inline-flex overflow-hidden">
                      <div className="flex items-center gap-3 transition-transform duration-500 group-hover:translate-x-[150%] group-hover:skew-x-12">
                        聯絡我們
                        <span className="grid h-6 w-6 place-items-center rounded-full bg-white/20">
                          <ArrowIcon />
                        </span>
                      </div>
                      <div className="absolute inset-0 flex items-center gap-3 transition-transform duration-500 -translate-x-[150%] skew-x-12 group-hover:translate-x-0 group-hover:skew-x-0">
                        聯絡我們
                        <span className="grid h-6 w-6 place-items-center rounded-full bg-white/20">
                          <ArrowIcon />
                        </span>
                      </div>
                    </span>
                  </div>
                </a>
              </div>
            </div>
            <div
              ref={newsContainerRef}
              className="w-full lg:w-3/4 flex flex-col gap-4 min-h-[400px]"
            >
              {displayItems.map((item) => (
                <a
                  key={item.id}
                  href={item.link}
                  className="news-item group relative flex flex-col md:flex-row items-start md:items-center bg-[#F2F2F2] border border-transparent hover:border-gray-200 hover:bg-white transition-colors duration-300 rounded-xl p-6 cursor-pointer"
                >
                  <div className="flex items-center gap-4 mb-3 md:mb-0 md:w-[220px] flex-shrink-0">
                    <span className="text-[#2E68C0] font-bold text-sm font-sans tracking-wider">
                      {item.date}
                    </span>
                    <span className="text-[10px] text-[#2E68C0] border border-[#2E68C0]/30 px-2 py-1 rounded bg-white font-bold">
                      {item.tag}
                    </span>
                  </div>
                  <div className="flex-grow pr-12">
                    <h3 className="text-gray-800 font-medium text-sm md:text-base leading-relaxed group-hover:text-[#0F356B] transition-colors">
                      {item.title}
                    </h3>
                  </div>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 transform translate-x-[-10px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-out">
                    <div className="w-10 h-10 rounded-full bg-[#2E68C0] flex items-center justify-center shadow-md">
                      <ArrowRight className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="cta-btn bg-[#1C82E0] max-w-[1450px]    w-[93%]  mx-auto rounded-[20px] lg:rounded-[33px] p-6 lg:p-10 mt-10">
          <div className="w-full lg:w-[90%] flex mx-auto flex-col">
            <div className="title flex flex-col lg:flex-row justify-between items-start lg:items-center gap-2 lg:gap-0">
              <h3 className="text-white font-bold tracking-wider text-xl lg:text-[26px]">
                遇到問題需要協助？
              </h3>
              <span className="text-white text-sm lg:text-[14px] opacity-80 lg:opacity-100">
                歡迎聯繫我們客服，馬上為你解決
              </span>
            </div>
            <div className="cta-btn-wrapper w-full">
              <div className="cta-btn group bg-[#0069CA] mt-6 lg:mt-4 rounded-[10px] p-2 cursor-pointer w-full">
                <div className="inner group-hover:bg-white bg-transparent duration-500 p-6 lg:p-8 rounded-[10px] flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-0">
                  <div className="w-full lg:w-1/2">
                    <h3 className="text-white group-hover:ml-0 lg:group-hover:ml-6 group-hover:text-[#0069CA] duration-300 font-bold text-xl lg:text-2xl">
                      LINE 官方客服
                    </h3>
                  </div>
                  <div className="border-t lg:border-t-0 lg:border-l-1 w-full lg:w-[55%] flex justify-start lg:justify-end !group-hover:w-full lg:!group-hover:w-[55%] duration-300 border-gray-50/30 lg:border-gray-50 pt-4 lg:pt-0 pl-0 lg:pl-5 group-hover:border-[#0069CA]">
                    <span className="text-white group-hover:mr-0 lg:group-hover:mr-10 duration-500 w-full lg:w-[300px] group-hover:text-[#0069CA] text-sm lg:text-[14px] leading-relaxed">
                      直接使用 LINE
                      與我們聯繫，真人客服即時在線。如有使用問題請直接加入好友詢問。
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="cta-btn-wrapper w-full">
              <div className="cta-btn group bg-[#0069CA] mt-6 lg:mt-4 rounded-[10px] p-2 cursor-pointer w-full">
                <div className="inner group-hover:bg-white bg-transparent duration-500 p-6 lg:p-8 rounded-[10px] flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-0">
                  <div className="w-full lg:w-1/2">
                    <h3 className="text-white group-hover:ml-0 lg:group-hover:ml-6 group-hover:text-[#0069CA] duration-300 font-bold text-xl lg:text-2xl">
                      LINE 官方客服
                    </h3>
                  </div>
                  <div className="border-t lg:border-t-0 lg:border-l-1 w-full lg:w-[55%] flex justify-start lg:justify-end !group-hover:w-full lg:!group-hover:w-[55%] duration-300 border-gray-50/30 lg:border-gray-50 pt-4 lg:pt-0 pl-0 lg:pl-5 group-hover:border-[#0069CA]">
                    <span className="text-white group-hover:mr-0 lg:group-hover:mr-10 duration-500 w-full lg:w-[300px] group-hover:text-[#0069CA] text-sm lg:text-[14px] leading-relaxed">
                      直接使用 LINE
                      與我們聯繫，真人客服即時在線。如有使用問題請直接加入好友詢問。
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="relative">
          <div className="absolute w-[300px] h-[400px]"></div>
        </div>
      </div>
    </Layout>
  );
}
