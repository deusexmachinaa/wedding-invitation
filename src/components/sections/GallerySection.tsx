"use client";

import { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight, X, Play, Pause } from "lucide-react";
import type { Image } from "@/types";
import { SectionHeader } from "../ui/SectionHeader";
import NextImage from "next/image";

interface GallerySectionProps {
  images: Image[];
}

export const GallerySection = ({ images }: GallerySectionProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set([0]));
  const [isTransitioning, setIsTransitioning] = useState(false);

  // 드래그/스와이프 관련 상태
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // 현재 보이는 이미지 주변만 미리 로드 (최적화)
  const imagesToPreload = useMemo(() => {
    const toLoad = new Set<number>();
    // 현재 이미지
    toLoad.add(currentIndex);
    // 이전 이미지
    toLoad.add((currentIndex - 1 + images.length) % images.length);
    // 다음 이미지
    toLoad.add((currentIndex + 1) % images.length);
    // 다다음 이미지 (미리 로드)
    toLoad.add((currentIndex + 2) % images.length);
    return toLoad;
  }, [currentIndex, images.length]);

  // 이미지 미리 로드
  useEffect(() => {
    setLoadedImages((prev) => new Set([...prev, ...imagesToPreload]));
  }, [imagesToPreload]);

  // 라이트박스 이미지 미리 로드
  useEffect(() => {
    if (!isLightboxOpen) return;

    // 현재 라이트박스 이미지 주변 3장 미리 로드
    const preloadIndexes = [
      lightboxIndex,
      (lightboxIndex - 1 + images.length) % images.length,
      (lightboxIndex + 1) % images.length,
      (lightboxIndex + 2) % images.length,
    ];

    preloadIndexes.forEach((index) => {
      const img = new Image();
      img.src = images[index]?.url;
    });
  }, [lightboxIndex, isLightboxOpen, images]);

  // 자동 재생 기능
  useEffect(() => {
    if (!isAutoPlay || !images || images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [isAutoPlay, images]);

  const nextSlide = () => {
    if (!images || images.length === 0 || isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setTimeout(() => setIsTransitioning(false), 200);
  };

  const prevSlide = () => {
    if (!images || images.length === 0 || isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setTimeout(() => setIsTransitioning(false), 200);
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
    setIsAutoPlay(false);

    // 라이트박스 열릴 때 주변 이미지 즉시 프리로드
    const preloadIndexes = [
      index,
      (index - 1 + images.length) % images.length,
      (index + 1) % images.length,
      (index + 2) % images.length,
      (index - 2 + images.length) % images.length,
    ];

    preloadIndexes.forEach((i) => {
      const img = new Image();
      img.src = images[i]?.url;
    });
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setIsAutoPlay(true);
  };

  const nextLightbox = () => {
    if (!images || images.length === 0 || isTransitioning) return;
    setIsTransitioning(true);
    setLightboxIndex((prev) => (prev + 1) % images.length);
    setTimeout(() => setIsTransitioning(false), 150);
  };

  const prevLightbox = () => {
    if (!images || images.length === 0 || isTransitioning) return;
    setIsTransitioning(true);
    setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
    setTimeout(() => setIsTransitioning(false), 150);
  };

  // 드래그/스와이프 핸들러 (메인 슬라이더)
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const minSwipeDistance = 50; // 최소 스와이프 거리
    const distance = touchStart - touchEnd;

    if (Math.abs(distance) < minSwipeDistance) return;

    if (distance > 0) {
      // 왼쪽으로 스와이프 (다음)
      nextSlide();
    } else {
      // 오른쪽으로 스와이프 (이전)
      prevSlide();
    }
  };

  // 마우스 드래그 핸들러 (데스크톱)
  const handleMouseDown = (e: React.MouseEvent) => {
    setTouchStart(e.clientX);
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setTouchEnd(e.clientX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const minSwipeDistance = 50;
    const distance = touchStart - touchEnd;

    if (Math.abs(distance) < minSwipeDistance) return;

    if (distance > 0) {
      nextSlide();
    } else {
      prevSlide();
    }
  };

  // 라이트박스 드래그 핸들러
  const handleLightboxTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setIsDragging(true);
  };

  const handleLightboxTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleLightboxTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const minSwipeDistance = 50;
    const distance = touchStart - touchEnd;

    if (Math.abs(distance) < minSwipeDistance) return;

    if (distance > 0) {
      nextLightbox();
    } else {
      prevLightbox();
    }
  };

  const handleLightboxMouseDown = (e: React.MouseEvent) => {
    setTouchStart(e.clientX);
    setIsDragging(true);
  };

  const handleLightboxMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setTouchEnd(e.clientX);
  };

  const handleLightboxMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const minSwipeDistance = 50;
    const distance = touchStart - touchEnd;

    if (Math.abs(distance) < minSwipeDistance) return;

    if (distance > 0) {
      nextLightbox();
    } else {
      prevLightbox();
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
      <section className="py-16 px-6 bg-gradient-to-b from-white to-rose-50">
        <div className="max-w-4xl mx-auto">
          <SectionHeader englishTitle="GALLERY" koreanTitle="우리의 순간" />

          {/* 메인 슬라이더 - 드래그 가능 */}
          <div className="relative mb-8">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-white">
              <div className="aspect-[4/3] relative">
                {/* 메인 이미지 - Next.js Image 최적화 + 드래그 */}
                <div
                  className="w-full h-full cursor-grab active:cursor-grabbing overflow-hidden group relative select-none"
                  onClick={() => !isDragging && openLightbox(currentIndex)}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  <NextImage
                    src={images[currentIndex]?.url}
                    alt={images[currentIndex]?.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                    className="object-cover transition-all duration-150 group-hover:scale-105"
                    priority={currentIndex === 0}
                    quality={85}
                    loading={currentIndex === 0 ? "eager" : "lazy"}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-end justify-center pb-4">
                    <p className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm bg-black/50 px-4 py-2 rounded-full">
                      클릭하여 크게 보기
                    </p>
                  </div>
                </div>

                {/* 자동재생 컨트롤 - 터치 피드백 */}
                <button
                  onClick={() => setIsAutoPlay(!isAutoPlay)}
                  className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 hover:scale-110 active:scale-95 active:bg-rose-500 transition-all duration-200 touch-manipulation"
                >
                  {isAutoPlay ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </button>

                {/* 네비게이션 버튼 - 투명도 개선 */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevSlide}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/50 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white/80 hover:scale-110 active:scale-95 active:bg-rose-100 transition-all duration-200 touch-manipulation"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-700" />
                    </button>
                    <button
                      onClick={nextSlide}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/50 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white/80 hover:scale-110 active:scale-95 active:bg-rose-100 transition-all duration-200 touch-manipulation"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-700" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* 도트 인디케이터 - 터치 피드백 */}
            {images.length > 1 && (
              <div className="flex justify-center mt-6 gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 active:scale-110 touch-manipulation ${
                      index === currentIndex
                        ? "bg-rose-400 w-8"
                        : "bg-gray-300 hover:bg-gray-400 active:bg-rose-300"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* 썸네일 그리드 - Lazy Loading 최적화 */}
          <div className="grid grid-cols-4 gap-3">
            {images.map((image, index) => (
              <div
                key={image.id}
                onClick={() => {
                  setCurrentIndex(index);
                  openLightbox(index);
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
                  fill
                  sizes="(max-width: 768px) 25vw, 200px"
                  className="object-cover transition-transform duration-200 group-hover:scale-110"
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
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <div
            className="relative max-w-4xl max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 닫기 버튼 - 터치 피드백 */}
            <button
              onClick={closeLightbox}
              className="absolute top-1 right-1 bg-white/20 text-white p-2 rounded-full hover:bg-white/30 hover:scale-110 active:scale-95 active:bg-red-500/50 transition-all duration-200 z-10 touch-manipulation"
            >
              <X className="w-6 h-6" />
            </button>

            {/* 라이트박스 이미지 - 최적화 + 드래그 */}
            <div
              className="bg-white rounded-xl overflow-hidden shadow-2xl max-w-4xl max-h-[80vh] cursor-grab active:cursor-grabbing select-none"
              onTouchStart={handleLightboxTouchStart}
              onTouchMove={handleLightboxTouchMove}
              onTouchEnd={handleLightboxTouchEnd}
              onMouseDown={handleLightboxMouseDown}
              onMouseMove={handleLightboxMouseMove}
              onMouseUp={handleLightboxMouseUp}
              onMouseLeave={handleLightboxMouseUp}
            >
              <div className="relative w-full h-full">
                <NextImage
                  src={images[lightboxIndex]?.url}
                  alt={images[lightboxIndex]?.alt}
                  width={1200}
                  height={900}
                  className="w-full h-auto max-h-[80vh] object-contain pointer-events-none"
                  quality={90}
                  priority
                  loading="eager"
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI5MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2YzZjRmNiIvPjwvc3ZnPg=="
                />
                {/* 이미지 카운터 */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
                  {lightboxIndex + 1} / {images.length}
                </div>
              </div>
            </div>

            {/* 라이트박스 네비게이션 - 터치 피드백 추가 */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevLightbox}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 text-white p-3 rounded-full hover:bg-white/30 hover:scale-110 active:scale-95 active:bg-rose-500/50 transition-all duration-200 touch-manipulation"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextLightbox}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 text-white p-3 rounded-full hover:bg-white/30 hover:scale-110 active:scale-95 active:bg-rose-500/50 transition-all duration-200 touch-manipulation"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* 라이트박스 도트 - 터치 피드백 */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setLightboxIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 hover:scale-125 active:scale-110 touch-manipulation ${
                    index === lightboxIndex
                      ? "bg-white w-6"
                      : "bg-white/50 hover:bg-white/75 active:bg-rose-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
