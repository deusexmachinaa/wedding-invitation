"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { PersonInfo, CeremonyInfo } from "@/types";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { useRef } from "react";

interface HeaderSectionProps {
  groom: PersonInfo;
  bride: PersonInfo;
  ceremony: CeremonyInfo;
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

  // 마우스 위치 추적
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // 부드러운 애니메이션을 위한 스프링 설정
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), {
    stiffness: 400,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), {
    stiffness: 400,
    damping: 30,
  });

  // 마우스 움직임 핸들러
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXPos = e.clientX - rect.left;
    const mouseYPos = e.clientY - rect.top;

    // -0.5에서 0.5 범위로 정규화
    const xPct = mouseXPos / width - 0.5;
    const yPct = mouseYPos / height - 0.5;

    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
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
      <div className="text-center z-10 px-6">
        {/* 유리 효과 배경 카드 */}
        <motion.div
          ref={cardRef}
          className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-2xl px-8 py-12 sm:px-12 sm:py-16 cursor-grab active:cursor-grabbing"
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          drag
          dragElastic={0.1}
          dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* 웨딩 타이틀 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-2xl sm:text-3xl font-light text-gray-700 mb-2">
              Wedding Invitation
              {/* 사진으로 수정해야함 */}
            </h1>
            <div className="w-24 h-0.5 bg-gradient-to-r from-rose-300 to-pink-300 mx-auto"></div>
          </motion.div>

          {/* 신랑 신부 이름 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-12"
          >
            <div className="flex items-end justify-center gap-6 sm:gap-8">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-2">GROOM</div>
                <h2 className="text-3xl sm:text-4xl font-serif text-gray-900">
                  {groom.name}
                </h2>
              </div>

              <div className="w-8 h-8 sm:w-10 sm:h-10 mb-1 rounded-full bg-gradient-to-br from-rose-300 to-pink-300 flex items-center justify-center flex-shrink-0">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full"></div>
              </div>

              <div className="text-center">
                <div className="text-sm text-gray-600 mb-2">BRIDE</div>
                <h2 className="text-3xl sm:text-4xl font-serif text-gray-900">
                  {bride.name}
                </h2>
              </div>
            </div>
          </motion.div>

          {/* 날짜 및 시간 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-8"
          >
            <p className="text-lg sm:text-xl text-gray-800 mb-2 font-light">
              {formattedDate}
            </p>
            <p className="text-lg sm:text-xl text-gray-800 font-light">
              {ceremony.time}
            </p>
          </motion.div>

          {/* 장소 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <p className="text-base sm:text-lg text-gray-700 font-light">
              {ceremony.venue} {ceremony.floor && ceremony.floor}
              {","} {ceremony.hall && ceremony.hall}
            </p>
            <p className="text-sm text-gray-600 mt-1">{ceremony.address}</p>
          </motion.div>
        </motion.div>
        {/* 유리 효과 배경 카드 끝 */}

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
    </div>
  );
};
