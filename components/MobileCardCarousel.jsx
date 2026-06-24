"use client";

import { useCallback, useEffect, useState, Children, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

/**
 * 手機版橫向輪播：自動播放 + 無限循環
 * md 以上由父層自行顯示 grid
 */
export default function MobileCardCarousel({
  children,
  slideClassName = "min-w-0 flex-[0_0_85%]",
  gap = 16,
  slidesToScroll = 1,
  showArrows = true,
  showDots = true,
  autoplay = true,
  autoplayDelay = 4000,
  loop = true,
  className = "",
}) {
  const slides = Children.toArray(children);
  const autoplayPlugin = useRef(
    Autoplay({ delay: autoplayDelay, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  const plugins = autoplay ? [autoplayPlugin.current] : [];

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop,
      align: "start",
      containScroll: loop ? false : "trimSnaps",
      dragFree: false,
      slidesToScroll,
    },
    plugins
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    onSelect();
    emblaApi.on("select", onSelect).on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (index) => emblaApi?.scrollTo(index),
    [emblaApi]
  );

  const scrollPrev = useCallback(() => {
    autoplayPlugin.current?.reset?.();
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    autoplayPlugin.current?.reset?.();
    emblaApi?.scrollNext();
  }, [emblaApi]);

  if (slides.length === 0) return null;

  const dotCount = scrollSnaps.length > 0 ? scrollSnaps.length : slides.length;
  const activeDot =
    dotCount > 0 ? ((selectedIndex % dotCount) + dotCount) % dotCount : 0;

  return (
    <div className={className}>
      <div className="relative">
        {showArrows && slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={scrollPrev}
              aria-label="上一張"
              className="absolute left-0 top-1/2 z-10 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 shadow-md border border-gray-100 text-gray-700 active:scale-95"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              aria-label="下一張"
              className="absolute right-0 top-1/2 z-10 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 shadow-md border border-gray-100 text-gray-700 active:scale-95"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </>
        )}

        <div className="overflow-hidden px-1" ref={emblaRef}>
          <div
            className="flex touch-pan-y"
            style={{ marginLeft: -gap / 2, marginRight: -gap / 2 }}
          >
            {slides.map((slide, index) => (
              <div
                key={index}
                className={slideClassName}
                style={{ paddingLeft: gap / 2, paddingRight: gap / 2 }}
              >
                {slide}
              </div>
            ))}
          </div>
        </div>
      </div>

      {showDots && dotCount > 1 && (
        <div className="mt-4 flex justify-center gap-1.5">
          {Array.from({ length: dotCount }).map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`第 ${index + 1} 張`}
              onClick={() => scrollTo(index)}
              className={[
                "h-1.5 rounded-full transition-all duration-200",
                index === activeDot ? "w-5 bg-[#0A6CD0]" : "w-1.5 bg-gray-300",
              ].join(" ")}
            />
          ))}
        </div>
      )}
    </div>
  );
}
