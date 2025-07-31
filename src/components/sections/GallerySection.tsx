"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X, Play, Pause } from "lucide-react";
import { Image } from "@/types";
import { SectionHeader } from "../ui/SectionHeader";

interface GallerySectionProps {
  images: Image[];
}

export const GallerySection = ({ images }: GallerySectionProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // 자동 재생 기능
  useEffect(() => {
    if (!isAutoPlay || !images || images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [isAutoPlay, images]);

  const nextSlide = () => {
    if (!images || images.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    if (!images || images.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
    setIsAutoPlay(false);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setIsAutoPlay(true);
  };

  const nextLightbox = () => {
    if (!images || images.length === 0) return;
    setLightboxIndex((prev) => (prev + 1) % images.length);
  };

  const prevLightbox = () => {
    if (!images || images.length === 0) return;
    setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
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

          {/* 메인 슬라이더 */}
          <div className="relative mb-8">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-white">
              <div className="aspect-[4/3] relative">
                {/* 이미지 영역 (현재는 플레이스홀더) */}
                <div
                  className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105"
                  onClick={() => openLightbox(currentIndex)}
                >
                  <div className="text-center">
                    <div className="text-6xl mb-4">📸</div>
                    <p className="text-lg font-medium text-gray-600">
                      {images[currentIndex]?.alt}
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      클릭하여 크게 보기
                    </p>
                  </div>
                </div>

                {/* 자동재생 컨트롤 */}
                <button
                  onClick={() => setIsAutoPlay(!isAutoPlay)}
                  className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-all duration-200"
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
                    <button
                      onClick={prevSlide}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all duration-200"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-700" />
                    </button>
                    <button
                      onClick={nextSlide}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all duration-200"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-700" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* 도트 인디케이터 */}
            {images.length > 1 && (
              <div className="flex justify-center mt-6 gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? "bg-rose-400 w-8"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* 썸네일 그리드 */}
          <div className="grid grid-cols-4 gap-3">
            {images.map((image, index) => (
              <div
                key={image.id}
                onClick={() => openLightbox(index)}
                className={`aspect-square rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${
                  index === currentIndex
                    ? "ring-2 ring-rose-400 ring-offset-2"
                    : "hover:ring-2 hover:ring-gray-300 hover:ring-offset-1"
                }`}
              >
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <span className="text-xs text-gray-500">{image.alt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 라이트박스 모달 */}
      {isLightboxOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            {/* 닫기 버튼 */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 bg-white/20 text-white p-2 rounded-full hover:bg-white/30 transition-all duration-200 z-10"
            >
              <X className="w-6 h-6" />
            </button>

            {/* 라이트박스 이미지 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-2xl">
              <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-8xl mb-6">📸</div>
                  <p className="text-2xl font-medium text-gray-700">
                    {images[lightboxIndex]?.alt}
                  </p>
                  <p className="text-gray-500 mt-2">
                    {lightboxIndex + 1} / {images.length}
                  </p>
                </div>
              </div>
            </div>

            {/* 라이트박스 네비게이션 */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevLightbox}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 text-white p-3 rounded-full hover:bg-white/30 transition-all duration-200"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextLightbox}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 text-white p-3 rounded-full hover:bg-white/30 transition-all duration-200"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* 라이트박스 도트 */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setLightboxIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === lightboxIndex
                      ? "bg-white w-6"
                      : "bg-white/50 hover:bg-white/75"
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
