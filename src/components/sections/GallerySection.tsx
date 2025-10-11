"use client";

import { useState, useEffect, useRef } from "react";
import { X, Play, Pause } from "lucide-react";
import type { Image } from "@/types";
import { SectionHeader } from "../ui/SectionHeader";
import NextImage from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, Keyboard } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

// Swiper CSS import
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface GallerySectionProps {
  images: Image[];
}

export const GallerySection = ({ images }: GallerySectionProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(false); // 초기값 false로 변경
  const [mainSwiper, setMainSwiper] = useState<SwiperType | null>(null);
  const [lightboxSwiper, setLightboxSwiper] = useState<SwiperType | null>(null);
  const [showLightboxControls, setShowLightboxControls] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);
  const hasStartedAutoPlay = useRef(false); // 자동재생 시작 여부 추적

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setIsLightboxOpen(true);
    setIsAutoPlay(false);
    setShowLightboxControls(true);

    // 메인 슬라이더 자동재생 중지
    if (mainSwiper?.autoplay) {
      mainSwiper.autoplay.stop();
    }
  };

  const toggleLightboxControls = () => {
    setShowLightboxControls(!showLightboxControls);
  };

  // 버튼이 다시 나타날 때 Swiper 네비게이션 재연결
  useEffect(() => {
    if (lightboxSwiper && showLightboxControls) {
      // 다음 렌더 사이클에서 실행
      const timer = setTimeout(() => {
        if (lightboxSwiper.navigation) {
          lightboxSwiper.navigation.destroy();
          lightboxSwiper.navigation.init();
          lightboxSwiper.navigation.update();
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [showLightboxControls, lightboxSwiper]);

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    // 자동재생이 이미 시작된 적이 있으면 true로 설정
    if (hasStartedAutoPlay.current) {
      setIsAutoPlay(true);
    }

    // 메인 슬라이더 자동재생 재개
    if (mainSwiper?.autoplay && hasStartedAutoPlay.current) {
      mainSwiper.autoplay.start();
    }
  };

  // Intersection Observer로 갤러리가 화면에 보일 때 자동재생 시작
  useEffect(() => {
    if (!sectionRef.current || hasStartedAutoPlay.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // 갤러리 섹션이 50% 이상 보이면 자동재생 시작
          if (entry.isIntersecting && !hasStartedAutoPlay.current) {
            hasStartedAutoPlay.current = true;
            setIsAutoPlay(true);

            // Swiper가 준비되면 자동재생 시작
            if (mainSwiper?.autoplay) {
              mainSwiper.autoplay.start();
            }
          }
        });
      },
      {
        threshold: 0.3, // 30% 이상 보이면 트리거
        rootMargin: "0px",
      }
    );

    observer.observe(sectionRef.current);

    return () => {
      observer.disconnect();
    };
  }, [mainSwiper]);

  const toggleAutoPlay = () => {
    if (mainSwiper?.autoplay) {
      if (isAutoPlay) {
        mainSwiper.autoplay.stop();
      } else {
        mainSwiper.autoplay.start();
      }
      setIsAutoPlay(!isAutoPlay);
    }
  };

  if (!images || images.length === 0) {
    return (
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <SectionHeader englishTitle="GALLERY" koreanTitle="우리의 순간" />
          <div className="text-center text-gray-500">
            갤러리 이미지가 없습니다.
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section
        ref={sectionRef}
        className="py-16 px-6 bg-gradient-to-b from-white to-rose-50"
      >
        <div className="max-w-4xl mx-auto">
          <SectionHeader englishTitle="GALLERY" koreanTitle="우리의 순간" />

          {/* 메인 슬라이더 - Swiper */}
          <div className="relative mb-8">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-white">
              <div
                className="aspect-[4/3] relative gallery-main-swiper"
                style={{ height: "400px", minHeight: "300px" }}
              >
                <Swiper
                  modules={[Navigation, Pagination, Autoplay, Keyboard]}
                  direction="horizontal"
                  slidesPerView={1}
                  spaceBetween={0}
                  navigation={{
                    nextEl: ".swiper-button-next-custom",
                    prevEl: ".swiper-button-prev-custom",
                  }}
                  pagination={{
                    el: ".swiper-pagination-custom",
                    clickable: true,
                    bulletClass: "swiper-pagination-bullet-custom",
                    bulletActiveClass: "swiper-pagination-bullet-active-custom",
                  }}
                  autoplay={
                    isAutoPlay
                      ? {
                          delay: 4000,
                          disableOnInteraction: false,
                          pauseOnMouseEnter: true,
                          reverseDirection: false,
                          stopOnLastSlide: false,
                        }
                      : false
                  }
                  keyboard={{
                    enabled: true,
                  }}
                  loop={images.length > 1}
                  speed={300}
                  touchRatio={1.2}
                  threshold={5}
                  resistance={true}
                  preventInteractionOnTransition={true}
                  onSwiper={setMainSwiper}
                  onSlideChange={(swiper) => {
                    setCurrentIndex(swiper.realIndex);
                  }}
                  className="h-full w-full"
                  style={{ height: "100%", width: "100%" }}
                >
                  {images.map((image, index) => (
                    <SwiperSlide key={image.id}>
                      <div
                        className="w-full h-full cursor-pointer overflow-hidden group relative select-none"
                        onClick={() => openLightbox(index)}
                      >
                        <NextImage
                          src={image.url}
                          alt={image.alt}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                          className="object-cover transition-all duration-300 group-hover:scale-105"
                          priority={index === 0}
                          quality={85}
                          loading={index === 0 ? "eager" : "lazy"}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-end justify-center pb-4">
                          <p className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm bg-black/50 px-4 py-2 rounded-full">
                            클릭하여 크게 보기
                          </p>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* 자동재생 컨트롤 */}
                <button
                  onClick={toggleAutoPlay}
                  className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 hover:scale-110 active:scale-95 active:bg-rose-500 transition-all duration-200 touch-manipulation z-10"
                >
                  {isAutoPlay ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </button>

                {/* 네비게이션 버튼 */}
                {images.length > 1 && (
                  <>
                    <button className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 bg-white/50 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white/80 hover:scale-110 active:scale-95 active:bg-rose-100 transition-all duration-200 touch-manipulation z-10">
                      <svg
                        className="w-5 h-5 text-gray-700"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                    <button className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 bg-white/50 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white/80 hover:scale-110 active:scale-95 active:bg-rose-100 transition-all duration-200 touch-manipulation z-10">
                      <svg
                        className="w-5 h-5 text-gray-700"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* 도트 인디케이터 */}
            {images.length > 1 && (
              <div className="swiper-pagination-custom flex justify-center mt-6 gap-2"></div>
            )}
          </div>

          {/* 썸네일 그리드 */}
          <div className="grid grid-cols-4 gap-3">
            {images.map((image, index) => (
              <div
                key={image.id}
                onClick={() => {
                  if (index === currentIndex) {
                    // 현재 표시 중인 이미지면 라이트박스 열기
                    openLightbox(index);
                  } else {
                    // 다른 이미지면 해당 이미지로 이동
                    setCurrentIndex(index);
                    if (mainSwiper) {
                      mainSwiper.slideTo(index);
                    }
                  }
                }}
                className={`aspect-square rounded-lg overflow-hidden cursor-pointer transition-all duration-300 group relative hover:scale-105 active:scale-95 touch-manipulation ${
                  index === currentIndex
                    ? "ring-2 ring-rose-400 ring-offset-2"
                    : "hover:ring-2 hover:ring-gray-300 hover:ring-offset-1"
                }`}
              >
                <NextImage
                  src={image.url}
                  alt={image.alt}
                  width={200}
                  height={200}
                  sizes="(max-width: 768px) 25vw, 200px"
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-110"
                  loading="lazy"
                  quality={70}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 라이트박스 모달 */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center md:p-4"
          onClick={closeLightbox}
        >
          <div
            className="relative w-full max-w-4xl max-h-full flex flex-col items-center md:gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 닫기 버튼 */}
            {showLightboxControls && (
              <button
                onClick={closeLightbox}
                className="absolute top-2 right-2 bg-white/10 backdrop-blur-xs text-white p-3 rounded-full hover:bg-white/20 hover:scale-110 active:scale-95 active:bg-red-500/30 transition-all duration-150 z-40 touch-manipulation shadow-xl"
              >
                <X className="w-7 h-7" />
              </button>
            )}

            {/* 라이트박스 Swiper */}
            <div className="relative w-full gallery-lightbox-swiper">
              <Swiper
                modules={[Navigation, Pagination, Keyboard]}
                direction="horizontal"
                slidesPerView={1}
                spaceBetween={0}
                navigation={{
                  nextEl: ".lightbox-button-next",
                  prevEl: ".lightbox-button-prev",
                }}
                pagination={{
                  el: ".lightbox-pagination",
                  clickable: true,
                  bulletClass: "swiper-pagination-bullet-lightbox",
                  bulletActiveClass: "swiper-pagination-bullet-active-lightbox",
                }}
                keyboard={{
                  enabled: true,
                }}
                loop={images.length > 1}
                speed={200}
                initialSlide={currentIndex}
                touchRatio={1.5}
                threshold={5}
                resistance={true}
                preventInteractionOnTransition={true}
                onSwiper={setLightboxSwiper}
                onSlideChange={(swiper) => {
                  setCurrentIndex(swiper.realIndex);
                  mainSwiper?.slideTo(swiper.realIndex);
                }}
                className="max-h-[80vh] w-full"
              >
                {images.map((image) => (
                  <SwiperSlide key={image.id}>
                    <div
                      className="relative w-full h-full flex items-center justify-center cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLightboxControls();
                      }}
                      onTouchStart={(e) => e.stopPropagation()}
                    >
                      <NextImage
                        src={image.url}
                        alt={image.alt}
                        width={1200}
                        height={900}
                        className="w-full h-auto max-h-[100vh] md:max-h-[80vh] object-contain md:rounded-lg pointer-events-none"
                        quality={90}
                        priority
                        loading="eager"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* 이미지 카운터 - 항상 표시 */}
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-xs text-white px-4 py-2 rounded-full text-xs z-10 shadow-xl">
                {currentIndex + 1} / {images.length}
              </div>

              {/* 라이트박스 네비게이션 버튼 - Swiper 안에 배치 */}
              {images.length > 1 && showLightboxControls && (
                <>
                  <button
                    className="lightbox-button-prev absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-xs text-white p-4 rounded-full hover:bg-white/20 hover:scale-110 active:scale-95 active:bg-rose-500/30 transition-all duration-300 touch-manipulation z-30 shadow-xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <svg
                      className="w-7 h-7"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <button
                    className="lightbox-button-next absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-xs text-white p-4 rounded-full hover:bg-white/20 hover:scale-110 active:scale-95 active:bg-rose-500/30 transition-all duration-300 touch-manipulation z-30 shadow-xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <svg
                      className="w-7 h-7"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </>
              )}
            </div>

            {/* 라이트박스 도트 - 사진 아래에 배치, 항상 표시 */}
            <div className="lightbox-pagination flex justify-center gap-2 mt-2"></div>
          </div>
        </div>
      )}

      <style jsx global>{`
        /* 메인 슬라이더 pagination 스타일 */
        .swiper-pagination-bullet-custom {
          width: 12px;
          height: 12px;
          background: #d1d5db;
          border-radius: 9999px;
          opacity: 1;
          transition: all 0.3s;
          cursor: pointer;
        }

        .swiper-pagination-bullet-custom:hover {
          background: #9ca3af;
          transform: scale(1.25);
        }

        .swiper-pagination-bullet-active-custom {
          width: 32px;
          background: #fb7185;
        }

        /* 라이트박스 pagination 스타일 */
        .swiper-pagination-bullet-lightbox {
          width: 8px;
          height: 8px;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 9999px;
          opacity: 1;
          transition: all 0.3s;
          cursor: pointer;
        }

        .swiper-pagination-bullet-lightbox:hover {
          background: rgba(255, 255, 255, 0.75);
          transform: scale(1.25);
        }

        .swiper-pagination-bullet-active-lightbox {
          width: 24px;
          background: white;
        }

        /* Swiper 최적화 */
        .gallery-main-swiper {
          height: 100% !important;
          width: 100% !important;
          overflow: hidden;
        }

        .gallery-main-swiper .swiper-wrapper {
          height: 100% !important;
          width: 100% !important;
          display: flex !important;
          flex-direction: row !important;
          transition-timing-function: ease-out !important;
        }

        .gallery-main-swiper .swiper-slide {
          height: 100% !important;
          width: 100% !important;
          overflow: hidden;
          flex-shrink: 0 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }

        .gallery-main-swiper .swiper-slide > div {
          height: 100% !important;
          width: 100% !important;
          position: relative !important;
        }

        .gallery-lightbox-swiper .swiper-slide {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
        }
      `}</style>
    </>
  );
};
