"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Link from "next/link";
// 🌟 確保這裡正確引入你的 hook 檔案路徑
import { usePWAInstall } from "./usePWAInstall";

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

function FadeUp({
  children,
  className = "",
  delay = 0,
  distance = 96,
  amount = 0.3,
}) {
  const prefersReduced = useReducedMotion();
  if (prefersReduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: distance, filter: "blur(6px)" }}
      whileInView={{
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { ease: [0.16, 1, 0.3, 1], duration: 1.05, delay },
      }}
      viewport={{ once: true, amount, margin: "0px 0px -10% 0px" }}
    >
      {children}
    </motion.div>
  );
}

const slides = [
  { image: "/images/location/fcc7e825-9136-4c9d-8312-3309fe189b4c.png" },
  { image: "/images/location/korea-02.png" },
  { image: "/images/location/thailand-01.png" },
];

export default function Slider() {
  const containerRef = useRef(null);
  const imagesRef = useRef([]);
  const titleRef = useRef(null);
  const indicatorsRef = useRef([]);
  const timerRef = useRef(null);

  // 🌟 1. 取得 PWA 的全套狀態與方法
  const {
    isInstallable,
    installPWA,
    deviceType,
    isStandalone,
    subscribeToPush,
  } = usePWAInstall();
  const [showPrompt, setShowPrompt] = useState(false);

  // 🌟 2. 智慧按鈕點擊攔截邏輯
  const handleActionClick = (e) => {
    if (isStandalone) {
      // 階段 A：已經是桌面 APP 模式了 ➔ 觸發推播訂閱
      e.preventDefault();
      subscribeToPush();
    } else if (isInstallable) {
      // 階段 B：Android/PC 可以一鍵安裝 ➔ 觸發安裝原生提示
      e.preventDefault();
      installPWA();
    } else if (deviceType === "ios" || deviceType === "mac") {
      // 階段 C：蘋果設備 ➔ 顯示對應的安裝教學彈窗
      e.preventDefault();
      setShowPrompt(true);
    }
    // 階段 D：如果以上皆非，不呼叫 preventDefault，讓 Link 正常跳轉到 /product
  };

  useGSAP(
    () => {
      let currentIndex = 0;
      let isAnimating = false;

      const slideDuration = 4;
      const transitionDuration = 1.5;
      const scaleDuration = 12;
      const scaleStart = 1.08;

      function animateSlide(nextIndex) {
        if (isAnimating || nextIndex === currentIndex) return;
        isAnimating = true;

        const currentImg = imagesRef.current[currentIndex];
        const nextImg = imagesRef.current[nextIndex];

        const tl = gsap.timeline({
          onComplete: () => {
            isAnimating = false;
            currentIndex = nextIndex;
            startAutoplay();
          },
        });

        gsap.set(nextImg, { zIndex: 2 });
        gsap.set(currentImg, { zIndex: 1 });

        tl.to(
          currentImg,
          { opacity: 0, duration: transitionDuration, ease: "power2.inOut" },
          0,
        );

        gsap.set(nextImg, { scale: scaleStart, opacity: 0 });
        tl.to(
          nextImg,
          { opacity: 1, duration: transitionDuration, ease: "power2.inOut" },
          0,
        );

        gsap.to(nextImg, { scale: 1, duration: scaleDuration, ease: "none" });

        if (titleRef.current) {
          const currentTitle = titleRef.current.querySelector(
            `div[data-index="${currentIndex}"]`,
          );
          const nextTitle = titleRef.current.querySelector(
            `div[data-index="${nextIndex}"]`,
          );

          const allTitleDivs =
            titleRef.current.querySelectorAll(".title-group");
          gsap.set(allTitleDivs, { zIndex: 1 });
          gsap.set(nextTitle, { zIndex: 2 });

          tl.to(
            currentTitle,
            {
              autoAlpha: 0,
              duration: transitionDuration,
              ease: "power2.inOut",
            },
            0,
          );
          gsap.set(nextTitle, { autoAlpha: 0 });
          tl.to(
            nextTitle,
            {
              autoAlpha: 1,
              duration: transitionDuration,
              ease: "power2.inOut",
            },
            0,
          );
        }

        indicatorsRef.current.forEach((ind, i) => {
          const ring = ind.querySelector(".ring");
          if (i === nextIndex) {
            gsap.to(ind, { opacity: 1, duration: 0.3 }, 0);
            gsap.to(
              ring,
              { scale: 1, opacity: 1, duration: 0.5, ease: "power2.out" },
              0,
            );
          } else {
            gsap.to(ind, { opacity: 0.4, duration: 0.3 }, 0);
            gsap.to(ring, { scale: 0, opacity: 0, duration: 0.3 }, 0);
          }
        });
      }

      function startAutoplay() {
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          animateSlide((currentIndex + 1) % slides.length);
        }, slideDuration * 1000);
      }

      gsap.set(imagesRef.current, { opacity: 0 });
      gsap.set(imagesRef.current[0], {
        opacity: 1,
        scale: scaleStart,
        zIndex: 2,
      });
      gsap.to(imagesRef.current[0], {
        scale: 1,
        duration: scaleDuration,
        ease: "none",
      });

      indicatorsRef.current.forEach((ind, i) => {
        const ring = ind.querySelector(".ring");
        if (i === 0) {
          gsap.set(ind, { opacity: 1 });
          gsap.set(ring, { scale: 1, opacity: 1 });
        } else {
          gsap.set(ind, { opacity: 0.4 });
          gsap.set(ring, { scale: 0, opacity: 0 });
        }
      });

      if (titleRef.current) {
        const allTitleDivs = titleRef.current.querySelectorAll(".title-group");
        gsap.set(allTitleDivs, { autoAlpha: 0 });
        gsap.set(allTitleDivs[0], { autoAlpha: 1, zIndex: 2 });
      }

      startAutoplay();

      return () => {
        clearTimeout(timerRef.current);
      };
    },
    { scope: containerRef },
  );

  return (
    <>
      <style>{`
        .hero-container { position: relative; width: 100%; height: 100svh; overflow: hidden; background-color: #000; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; color: #fff; }
        .slide-image { position: absolute; top: 0; left: 0; width: 100%; height: 100%; will-change: transform, opacity; }
        .slide-image img { width: 100%; height: 100%; object-fit: cover; }
        .overlay { position: absolute; inset: 0; background: rgba(0, 0, 0, 0.25); z-index: 10; pointer-events: none; }
        .top-left-logo { position: absolute; top: 2.5rem; left: 3rem; z-index: 20; display: flex; flex-direction: column; gap: 2px; }
        .top-left-logo .logo-main { font-size: 1.25rem; font-weight: 900; letter-spacing: 0.05em; }
        .top-left-logo .logo-sub { font-size: 0.6rem; letter-spacing: 0.15em; opacity: 0.8; }
        .top-right-badge { position: absolute; top: 2.5rem; right: 0; z-index: 20; background-color: #2b65f6; padding: 0.6rem 1.5rem; font-size: 0.65rem; font-weight: 700; letter-spacing: 0.1em; }
        .center-title { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 20; text-align: center; width: 100%; }
        .title-group { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 100%; }
        .bottom-left-text { position: absolute; bottom: 2.5rem; left: 3rem; z-index: 20; font-size: 0.75rem; letter-spacing: 0.05em; }
        .bottom-left-text .underline { border-bottom: 1px solid #fff; padding-bottom: 2px; margin-right: 6px; }
        .bottom-right-scroll { position: absolute; bottom: 2.5rem; right: 3rem; z-index: 20; display: flex; align-items: center; gap: 1rem; font-size: 0.65rem; font-weight: 600; letter-spacing: 0.1em; opacity: 0.8; }
        .bottom-right-scroll .arrow-circle { width: 24px; height: 24px; border: 1px solid rgba(255, 255, 255, 0.6); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.5rem; }
        .side-indicators { position: absolute; right: 3rem; top: 50%; transform: translateY(-50%); z-index: 20; display: flex; flex-direction: column; gap: 1.2rem; }
        .indicator-item { position: relative; width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; }
        .indicator-item .dot { width: 3px; height: 3px; background-color: #fff; border-radius: 50%; }
        .indicator-item .ring { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 1px solid rgba(255, 255, 255, 0.8); border-radius: 50%; }
        @media (max-width: 768px) { .top-left-logo { top: 1.5rem; left: 1.5rem; } .top-right-badge { top: 1.5rem; padding: 0.4rem 1rem; } .bottom-left-text { bottom: 1.5rem; left: 1.5rem; font-size: 0.65rem; } .bottom-right-scroll { display: none; } .side-indicators { right: 1.5rem; } }
      `}</style>

      {/* 🌟 智慧教學彈出視窗 (含 iOS 跳動防呆箭頭) */}
      <AnimatePresence>
        {showPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-end bg-black/80 pb-12 px-4"
            onClick={() => setShowPrompt(false)}
          >
            <motion.div
              initial={{ y: "100%", scale: 0.9 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: "100%", scale: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white text-black p-6 rounded-3xl w-full max-w-sm flex flex-col items-center text-center shadow-2xl relative mb-4"
              onClick={(e) => e.stopPropagation()}
            >
              {deviceType === "ios" ? (
                <>
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 text-blue-500">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2.5l5 5h-3v7h-4v-7H7l5-5zM19 13v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6h2v6h10v-6h2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">只需兩步，安裝完成</h3>
                  <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                    1. 點擊螢幕正下方的{" "}
                    <span className="font-bold text-blue-500">分享按鈕</span>
                    <br />
                    2. 往下滑，選擇「
                    <span className="font-bold text-black bg-gray-100 px-2 py-1 rounded">
                      加入主畫面
                    </span>
                    」
                  </p>
                </>
              ) : (
                <div className="py-2">
                  <h3 className="text-xl font-bold mb-4">安裝至 Mac Dock</h3>
                  <p className="text-gray-600 mb-6 text-sm">
                    請點擊螢幕左上角的「
                    <span className="font-bold text-black">
                      檔案
                    </span>」選單 <br />
                    並選擇「
                    <span className="font-bold text-blue-500">
                      加入 Dock 中
                    </span>
                    」
                  </p>
                </div>
              )}

              <button
                onClick={() => setShowPrompt(false)}
                className="w-full bg-gray-100 text-gray-800 py-3 rounded-xl font-bold hover:bg-gray-200 transition"
              >
                我知道了
              </button>
            </motion.div>

            {/* iOS 專屬防呆跳動箭頭 */}
            {deviceType === "ios" && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: [0, 15, 0] }}
                transition={{
                  opacity: { duration: 0.3 },
                  y: { repeat: Infinity, duration: 1.2, ease: "easeInOut" },
                }}
                className="text-white flex flex-col items-center pointer-events-none"
              >
                <span className="text-sm font-bold tracking-widest mb-1 shadow-black drop-shadow-md">
                  點擊這裡
                </span>
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="drop-shadow-lg"
                >
                  <path d="M12 5v14M19 12l-7 7-7-7" />
                </svg>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <section className="hero-container" ref={containerRef}>
        <div className="images-wrapper">
          {slides.map((slide, idx) => (
            <div
              key={`img-${idx}`}
              className="slide-image"
              ref={(el) => (imagesRef.current[idx] = el)}
            >
              <img src={slide.image} alt="Hero Banner" />
            </div>
          ))}
        </div>
        <div className="overlay"></div>

        <div className="top-left-logo">
          <span className="logo-main">連結您與世界的街口</span>
          <span className="logo-sub">街口eSIM</span>
        </div>

        <div className="top-right-badge mt-[-40px] hidden lg:block">
          Global eSIM
        </div>

        <div className="center-title" ref={titleRef}>
          {slides.map((slide, idx) => (
            <div key={`title-${idx}`} className="title-group" data-index={idx}>
              <span className="text-[50px] tracking-widest !font-normal">
                Jeko eSIM
              </span>
              <br></br>
              <span className="text-[32px] tracking-widest !font-normal">
                {" "}
                連接您於世界的距離.
              </span>

              {/* 🌟 核心 CTA 按鈕區塊 */}
              <FadeUp delay={0.12}>
                <div className="mt-8 flex items-center justify-center">
                  <Link
                    href="/product"
                    onClick={handleActionClick} // 綁定攔截點擊事件
                    className="group relative inline-flex items-center justify-center"
                  >
                    <div className="absolute inset-0 h-full w-full rounded-full bg-[#efefef] opacity-0 transition-all duration-300 group-hover:translate-x-1.5 group-hover:translate-y-1.5 group-hover:opacity-100" />

                    <div className="relative z-10 inline-flex items-center justify-center overflow-hidden rounded-full bg-[#1879c8] px-8 py-3.5 font-bold text-white shadow-lg shadow-[#0BAFD7]/30 transition-all duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:shadow-[#099EC3]/40">
                      <span className="relative inline-flex overflow-hidden">
                        <div className="flex items-center gap-3 transition-transform duration-500 group-hover:translate-x-[150%] group-hover:skew-x-12">
                          {/* 🌟 第一層動態文字 */}
                          {isStandalone
                            ? "開啟推播通知"
                            : isInstallable || deviceType !== "none"
                              ? "安裝 APP 享受服務"
                              : "了解更多服務"}
                          <span className="grid h-6 w-6 place-items-center rounded-full bg-white/20">
                            <ArrowIcon />
                          </span>
                        </div>

                        <div className="absolute inset-0 flex items-center gap-3 transition-transform duration-500 -translate-x-[150%] skew-x-12 group-hover:translate-x-0 group-hover:skew-x-0">
                          {/* 🌟 第二層動態文字 (Hover時顯示) */}
                          {isStandalone
                            ? "接收最新優惠"
                            : isInstallable || deviceType !== "none"
                              ? "立即加到桌面"
                              : "查看詳細內容"}
                          <span className="grid h-6 w-6 place-items-center rounded-full bg-white/20">
                            <ArrowIcon />
                          </span>
                        </div>
                      </span>
                    </div>
                  </Link>
                </div>
              </FadeUp>
            </div>
          ))}
        </div>

        <div className="bottom-left-text">
          <span className="underline">NEW WORK STYLE</span>
          <span>
            from <strong> by Kesh</strong>
          </span>
        </div>

        <div className="bottom-right-scroll">
          SCROLL FOR CONTENTS
          <div className="arrow-circle">↓</div>
        </div>

        <div className="side-indicators">
          {slides.map((_, idx) => (
            <div
              key={`ind-${idx}`}
              className="indicator-item"
              ref={(el) => (indicatorsRef.current[idx] = el)}
            >
              <div className="dot"></div>
              <div className="ring"></div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
