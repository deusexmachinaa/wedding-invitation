"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { PersonInfo, CeremonyInfo } from "@/types";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Keyboard, EffectCards } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import {
  Heart,
  Mail,
  Camera,
  MapPin,
  PenTool,
  Gift,
  Presentation,
  Calendar,
  Phone,
  Clock,
  Info,
  Home,
} from "lucide-react";

// Swiper CSS import
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-cards";

interface HeaderSectionProps {
  groom: PersonInfo;
  bride: PersonInfo;
  ceremony: CeremonyInfo;
}

interface SectionCard {
  id: string;
  englishTitle: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  targetSection: string;
}

export const HeaderSection = ({
  groom,
  bride,
  ceremony,
}: HeaderSectionProps) => {
  const ceremonyDate = new Date(ceremony.date);
  const formattedDate = format(ceremonyDate, "yyyy년 M월 d일 EEEE", {
    locale: ko,
  });

  // D-day 계산
  const calculateDday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weddingDay = new Date(ceremony.date);
    weddingDay.setHours(0, 0, 0, 0);

    const diffTime = weddingDay.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "D-Day";
    if (diffDays > 0) return `D-${diffDays}`;
    return `D+${Math.abs(diffDays)}`;
  };

  // 섹션 카드 데이터
  const sectionCards: SectionCard[] = [
    {
      id: "main",
      englishTitle: "WEDDING INVITATION",
      title: "Wedding Invitation",
      subtitle: `${groom.name} ♥ ${bride.name}`,
      icon: <Heart className="w-16 h-16 text-rose-400" />,
      targetSection: "header",
    },
    {
      id: "invitation",
      englishTitle: "INVITATION",
      title: "초대합니다",
      subtitle: "소중한 분들을 초대드립니다",
      icon: <Mail className="w-16 h-16 text-rose-400" />,
      targetSection: "invitation",
    },
    {
      id: "info",
      englishTitle: "WEDDING INFO",
      title: "예식 정보",
      subtitle: "예식 장소와 시간을 안내드립니다",
      icon: <Info className="w-16 h-16 text-rose-400" />,
      targetSection: "info",
    },
    {
      id: "contact",
      englishTitle: "CONTACT",
      title: "연락처",
      subtitle: "신랑신부 연락처를 안내드립니다",
      icon: <Phone className="w-16 h-16 text-rose-400" />,
      targetSection: "contact",
    },
    {
      id: "countdown",
      englishTitle: "D-DAY",
      title: calculateDday(),
      subtitle: "결혼식까지 남은 날입니다",
      icon: <Calendar className="w-16 h-16 text-rose-400" />,
      targetSection: "countdown",
    },
    {
      id: "gallery",
      englishTitle: "GALLERY",
      title: "갤러리",
      subtitle: "우리의 순간을 담았습니다",
      icon: <Camera className="w-16 h-16 text-rose-400" />,
      targetSection: "gallery",
    },
    {
      id: "location",
      englishTitle: "LOCATION",
      title: "오시는 길",
      subtitle: "예식장 위치를 안내드립니다",
      icon: <MapPin className="w-16 h-16 text-rose-400" />,
      targetSection: "location",
    },
    {
      id: "photobooth",
      englishTitle: "PHOTO BOOTH",
      title: "포토부스",
      subtitle: "특별한 추억을 만들어드립니다",
      icon: <Presentation className="w-16 h-16 text-rose-400" />,
      targetSection: "photobooth",
    },
    {
      id: "guestbook",
      englishTitle: "GUESTBOOK",
      title: "방명록",
      subtitle: "축하 메시지 남겨주세요",
      icon: <PenTool className="w-16 h-16 text-rose-400" />,
      targetSection: "guestbook",
    },
    {
      id: "account",
      englishTitle: "THANK YOU",
      title: "마음 전하실 곳",
      subtitle: "참석이 어려우신 분들을 위해 계좌번호를 기재하였습니다",
      icon: <Gift className="w-16 h-16 text-rose-400" />,
      targetSection: "account",
    },
    // {
    //   id: "footer",
    //   title: "마무리",
    //   subtitle: "감사 인사와 마무리",
    //   icon: <Home className="w-16 h-16 text-rose-400" />,
    //   targetSection: "footer",
    // },
  ];

  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  // 섹션으로 스크롤
  const scrollToSection = (sectionId: string) => {
    if (sectionId === "header") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // 타이머를 사용하여 섹션을 찾음 (렌더링 대기)
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        const yOffset = -80; // 헤더 높이만큼 오프셋
        const y =
          element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* 배경 이미지 */}
      <div
        className="absolute inset-0 bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/cover.jpg')",
          backgroundSize: "auto 100%", // 높이를 꽉 채우고 가로는 비율 유지
          // 배경 이미지가 없으면 그라데이션 사용
          backgroundColor: "#fff1f2",
        }}
      >
        {/* 오버레이 - 이미지 위에 반투명 레이어 추가 */}
        <div className="absolute inset-0 bg-gradient-to-br from-rose-100/40 via-pink-50/40 to-rose-100/40"></div>
      </div>

      {/* 배경 장식 */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-rose-200 rounded-full blur-xl"></div>
        <div className="absolute top-32 right-16 w-16 h-16 bg-pink-200 rounded-full blur-lg"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-rose-300 rounded-full blur-2xl"></div>
        <div className="absolute bottom-40 right-10 w-18 h-18 bg-pink-300 rounded-full blur-lg"></div>
      </div>

      {/* 배경음악 컨트롤은 sticky 플레이어로 이동됨 */}

      {/* 메인 컨텐츠 */}
      <div className="text-center z-10 px-6 sm:px-8 w-full">
        {/* 슬라이드 카드 컨테이너 */}
        <div className="relative header-card-swiper max-w-112 mx-auto">
          <Swiper
            modules={[Pagination, Keyboard]}
            spaceBetween={30}
            slidesPerView={1}
            centeredSlides={true}
            loop={true}
            keyboard={{ enabled: true }}
            width={320}
            breakpoints={{
              640: {
                width: 400,
              },
            }}
            pagination={{
              el: ".swiper-pagination-header",
              clickable: true,
              bulletClass: "swiper-pagination-bullet-header",
              bulletActiveClass: "swiper-pagination-bullet-active-header",
            }}
            onSwiper={setSwiper}
            onSlideChange={(swiper) => {
              setCurrentCardIndex(swiper.realIndex);
            }}
            className="pb-4"
          >
            {sectionCards.map((card, index) => (
              <SwiperSlide key={card.id}>
                <div
                  className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-2xl px-6 py-10 sm:px-8 sm:py-12 cursor-pointer h-[420px] sm:h-[450px] flex flex-col justify-center w-full"
                  onClick={() => scrollToSection(card.targetSection)}
                >
                  {index === 0 ? (
                    // 메인 카드 (기존 디자인)
                    <div>
                      {/* 웨딩 타이틀 */}
                      <div className="mb-6">
                        <h1 className="text-2xl sm:text-3xl font-light text-gray-700 mb-2">
                          Wedding Invitation
                        </h1>
                        <div className="w-24 h-0.5 bg-gradient-to-r from-rose-300 to-pink-300 mx-auto"></div>
                      </div>

                      {/* 신랑 신부 이름 */}
                      <div className="mb-8">
                        <div className="flex items-end justify-center gap-6 sm:gap-8">
                          <div className="text-center">
                            <div className="text-sm text-gray-600 mb-2">
                              GROOM
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-serif text-gray-900">
                              {groom.name}
                            </h2>
                          </div>

                          <div className="w-8 h-8 sm:w-10 sm:h-10 mb-1 rounded-full bg-gradient-to-br from-rose-300 to-pink-300 flex items-center justify-center flex-shrink-0">
                            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full"></div>
                          </div>

                          <div className="text-center">
                            <div className="text-sm text-gray-600 mb-2">
                              BRIDE
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-serif text-gray-900">
                              {bride.name}
                            </h2>
                          </div>
                        </div>
                      </div>

                      {/* 날짜 및 시간 */}
                      <div className="mb-6">
                        <p className="text-lg sm:text-xl text-gray-800 mb-2 font-light">
                          {formattedDate}
                        </p>
                        <p className="text-lg sm:text-xl text-gray-800 font-light">
                          {ceremony.time}
                        </p>
                      </div>

                      {/* 장소 */}
                      <div>
                        <p className="text-base sm:text-lg text-gray-700 font-light">
                          {ceremony.venue} {ceremony.floor && ceremony.floor}
                          {","} {ceremony.hall && ceremony.hall}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {ceremony.address}
                        </p>
                      </div>
                    </div>
                  ) : (
                    // 네비게이션 카드
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="mb-8 flex items-center justify-center">
                        {card.icon}
                      </div>
                      <p className="text-xs font-semibold tracking-[0.25em] text-rose-400 uppercase mb-2 opacity-90">
                        {card.englishTitle}
                      </p>
                      <h2 className="text-3xl sm:text-4xl font-serif text-gray-900 mb-6">
                        {card.title}
                      </h2>
                      <p className="text-lg sm:text-xl text-gray-700 mb-8 break-keep font-gowun-dodum">
                        {card.subtitle}
                      </p>
                      <div className="text-sm text-gray-600 flex items-center justify-center gap-2 mt-4">
                        <span>클릭하여 이동하기</span>
                        <span className="text-rose-400">→</span>
                      </div>
                    </div>
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* 페이지 인디케이터 */}
          <div className="swiper-pagination-header flex justify-center mt-6 gap-2"></div>
        </div>
        {/* 슬라이드 카드 끝 */}

        {/* 스크롤 안내 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-6 h-10 border-2 border-rose-300 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-1 h-3 bg-rose-300 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </div>

      <style jsx global>{`
        .swiper-pagination-bullet-header {
          width: 8px;
          height: 8px;
          background: rgba(255, 255, 255, 0.4);
          opacity: 1;
          transition: all 0.1s;
          border-radius: 9999px;
        }

        .swiper-pagination-bullet-header:hover {
          background: rgba(255, 255, 255, 0.6);
        }

        .swiper-pagination-bullet-active-header {
          width: 32px;
          height: 8px;
          background: rgb(251 113 133);
          border-radius: 9999px;
        }

        .header-card-swiper .swiper-slide {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
        }

        .header-card-swiper .swiper-wrapper {
          align-items: center;
        }

        .header-card-swiper .swiper-slide > div {
          width: 100%;
          max-width: 100%;
        }

        /* 스와이프 영역을 카드 크기에 맞게 조정 */
        .header-card-swiper .swiper {
          width: 100%;
          max-width: 320px;
        }

        @media (min-width: 640px) {
          .header-card-swiper .swiper {
            max-width: 400px;
          }
        }

        .header-card-swiper .swiper-wrapper {
          width: 100%;
        }

        .header-card-swiper .swiper-slide {
          width: 100% !important;
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
};
