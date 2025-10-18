"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Heart,
  ChevronLeft,
  ChevronRight,
  CalendarPlus,
} from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import { ko } from "date-fns/locale";
import { CeremonyInfo } from "@/types";

interface CountdownTimerProps {
  targetDate: string; // YYYY-MM-DD 형식
  groomName: string;
  brideName: string;
  ceremony: CeremonyInfo;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  daysPassed?: number;
}

export const CountdownTimer = ({
  targetDate,
  groomName,
  brideName,
  ceremony,
}: CountdownTimerProps) => {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  const [currentMonth, setCurrentMonth] = useState(new Date(ceremony.date));

  // 날짜 기준 D-day 계산 (메시지용)
  const calculateDaysUntilWedding = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weddingDay = new Date(ceremony.date);
    weddingDay.setHours(0, 0, 0, 0);

    const diffTime = weddingDay.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  const generateCalendarDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 }); // 일요일 시작
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

    return eachDayOfInterval({ start: startDate, end: endDate });
  };

  const calculateTimeRemaining = (target: Date): TimeRemaining => {
    const now = new Date();
    const targetTime = target.getTime();
    const difference = targetTime - now.getTime();

    if (difference <= 0) {
      // 날짜가 지난 경우 경과한 일수 계산 (날짜 기준)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const weddingDay = new Date(target);
      weddingDay.setHours(0, 0, 0, 0);

      const daysPassed = Math.ceil(
        Math.abs(weddingDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: true,
        daysPassed: daysPassed,
      };
    }

    // 정확한 시간 차이로 카운터 계산 (일/시/분/초)
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      ),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
      isExpired: false,
    };
  };

  useEffect(() => {
    // 결혼식 날짜와 시간을 합쳐서 정확한 target 만들기
    const targetDateTime = new Date(`${targetDate}T16:20:00`); // 오후 4시 20분

    const updateTimer = () => {
      setTimeRemaining(calculateTimeRemaining(targetDateTime));
    };

    // 즉시 업데이트
    updateTimer();

    // 1초마다 업데이트
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const ceremonyDate = new Date(ceremony.date);
  const formattedDate = format(ceremonyDate, "yyyy.MM.dd", { locale: ko });
  const formattedDayOfWeek = format(ceremonyDate, "EEEE", { locale: ko });

  const timeUnits = [
    {
      label: "DAYS",
      value: timeRemaining.days,
      color: "from-gray-800 via-gray-700 to-gray-800",
    },
    {
      label: "HOURS",
      value: timeRemaining.hours,
      color: "from-gray-800 via-gray-700 to-gray-800",
    },
    {
      label: "MINUTES",
      value: timeRemaining.minutes,
      color: "from-gray-800 via-gray-700 to-gray-800",
    },
    {
      label: "SECONDS",
      value: timeRemaining.seconds,
      color: "from-gray-800 via-gray-700 to-gray-800",
    },
  ];

  if (timeRemaining.isExpired) {
    const daysPassed = timeRemaining.daysPassed || 0;

    return (
      <section className="py-16 px-6 bg-gradient-to-br from-rose-50 via-pink-100 to-purple-50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="space-y-8"
          >
            <Heart className="w-16 h-16 mx-auto mb-6 text-pink-500" />
            <h2
              className="text-3xl font-bold text-gray-800 mb-4"
              style={{
                fontFamily:
                  "Gowun Dodum, var(--font-gowun-dodum), system-ui, -apple-system, sans-serif",
              }}
            >
              {daysPassed === 0 ? (
                <>🎉 결혼식 당일입니다! 🎉</>
              ) : (
                <>
                  결혼식이 <span className="text-pink-500">{daysPassed}</span>일
                  지났습니다 💕
                </>
              )}
            </h2>
            <p
              className="text-lg text-gray-600"
              style={{
                fontFamily:
                  "Gowun Dodum, var(--font-gowun-dodum), system-ui, -apple-system, sans-serif",
              }}
            >
              {groomName} ♥ {brideName}
              {daysPassed === 0
                ? "의 행복한 시작을 축하해주세요!"
                : "의 행복한 결혼 생활을 응원해주세요!"}
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  const calendarDays = generateCalendarDays();
  const weddingDate = new Date(ceremony.date);

  // Google Calendar 링크 생성
  const addToGoogleCalendar = () => {
    const startDateTime = `${ceremony.date.replace(/-/g, "")}T162000`;
    const endDateTime = `${ceremony.date.replace(/-/g, "")}T182000`; // 2시간 후

    const title = `${groomName} ❤️ ${brideName} 결혼식`;
    const venueName = ceremony.hall
      ? `${ceremony.venue} ${ceremony.floor ? ceremony.floor + " " : ""}${
          ceremony.hall
        }`
      : ceremony.venue;
    const details = `${groomName}과 ${brideName}의 결혼식에 초대합니다.\n\n장소: ${venueName}\n주소: ${ceremony.address}`;
    const location = `${venueName}, ${ceremony.address}`;

    // 1440분 = 24시간 (하루 전)
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      title
    )}&dates=${startDateTime}/${endDateTime}&details=${encodeURIComponent(
      details
    )}&location=${encodeURIComponent(location)}&add=1440`;

    // 모바일 감지
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    if (isMobile) {
      // 모바일에서는 Google Calendar 앱 열기 시도
      const isAndroid = /Android/i.test(navigator.userAgent);

      if (isAndroid) {
        // Android: Google Calendar 앱 인텐트 시도
        const intentUrl = `intent://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
          title
        )}&dates=${startDateTime}/${endDateTime}&details=${encodeURIComponent(
          details
        )}&location=${encodeURIComponent(
          location
        )}&add=1440#Intent;scheme=https;package=com.google.android.calendar;end`;

        window.location.href = intentUrl;
      } else {
        // iOS: 웹 URL (사파리에서 Google Calendar 웹 열림)
        window.location.href = googleCalendarUrl;
      }
    } else {
      // 데스크톱: 새 탭에서 열기
      window.open(googleCalendarUrl, "_blank");
    }
  };

  // .ics 파일 다운로드 (Apple Calendar, Outlook 등)
  const downloadICSFile = () => {
    const startDateTime = `${ceremony.date.replace(/-/g, "")}T162000`;
    const endDateTime = `${ceremony.date.replace(/-/g, "")}T182000`;
    const venueName = ceremony.hall
      ? `${ceremony.venue} ${ceremony.floor ? ceremony.floor + " " : ""}${
          ceremony.hall
        }`
      : ceremony.venue;
    const location = `${venueName}, ${ceremony.address}`;

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Wedding Invitation//Calendar//KO",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `DTSTART:${startDateTime}`,
      `DTEND:${endDateTime}`,
      `SUMMARY:${groomName} ❤️ ${brideName} 결혼식`,
      `DESCRIPTION:${groomName}과 ${brideName}의 결혼식에 초대합니다.\\n\\n장소: ${venueName}\\n주소: ${ceremony.address}`,
      `LOCATION:${location}`,
      "STATUS:CONFIRMED",
      "SEQUENCE:0",
      "BEGIN:VALARM",
      "TRIGGER:-P1D",
      "DESCRIPTION:내일 결혼식이 있습니다",
      "ACTION:DISPLAY",
      "END:VALARM",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], {
      type: "text/calendar;charset=utf-8",
    });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `${groomName}_${brideName}_wedding.ics`;
    link.click();
  };

  return (
    <section className="py-16 px-6 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 섹션 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Calendar className="w-6 h-6 text-pink-500" />
            <span
              className="text-2xl font-bold text-gray-800"
              style={{
                fontFamily:
                  "Gowun Dodum, var(--font-gowun-dodum), system-ui, -apple-system, sans-serif",
              }}
            >
              {formattedDate}
            </span>
          </div>
          <div className="flex items-center justify-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-gray-600" />
            <span
              className="text-lg text-gray-600"
              style={{
                fontFamily:
                  "Gowun Dodum, var(--font-gowun-dodum), system-ui, -apple-system, sans-serif",
              }}
            >
              {formattedDayOfWeek} {ceremony.time}
            </span>
          </div>
          <div className="text-center mb-8">
            <p
              className="text-lg text-gray-700 mb-2"
              style={{
                fontFamily:
                  "Gowun Dodum, var(--font-gowun-dodum), system-ui, -apple-system, sans-serif",
              }}
            >
              <span className="font-semibold text-pink-500">{groomName}</span>
              <Heart className="w-5 h-5 inline mx-2 text-pink-500" />
              <span className="font-semibold text-pink-500">{brideName}</span>의
              결혼식이
            </p>
            <p
              className="text-3xl font-bold text-gray-800"
              style={{
                fontFamily:
                  "Gowun Dodum, var(--font-gowun-dodum), system-ui, -apple-system, sans-serif",
              }}
            >
              <span className="text-pink-400">
                {calculateDaysUntilWedding()}
              </span>
              일 남았습니다.
            </p>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* 달력 섹션 */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="space-y-4"
          >
            {/* 달력 헤더 */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                className="p-2 hover:bg-rose-100 rounded-full transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h3
                className="text-xl font-bold text-gray-800"
                style={{
                  fontFamily:
                    "Gowun Dodum, var(--font-gowun-dodum), system-ui, -apple-system, sans-serif",
                }}
              >
                {format(currentMonth, "yyyy년 MM월", { locale: ko })}
              </h3>
              <button
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="p-2 hover:bg-rose-100 rounded-full transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* 요일 헤더 */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
                <div
                  key={day}
                  className="w-10 text-center text-sm font-semibold text-gray-500 py-2"
                  style={{
                    fontFamily:
                      "Gowun Dodum, var(--font-gowun-dodum), system-ui, -apple-system, sans-serif",
                  }}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* 달력 그리드 */}
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((day, index) => {
                const isCurrentMonth = isSameMonth(day, currentMonth);
                const isWeddingDay = isSameDay(day, weddingDate);
                const isToday = isSameDay(day, new Date());

                return (
                  <motion.div
                    key={day.toISOString()}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.01, duration: 0.3 }}
                    className={`
                      relative h-10 w-10 flex items-center justify-center text-sm rounded-lg transition-all
                      ${!isCurrentMonth ? "text-gray-300" : "text-gray-700"}
                      ${
                        isWeddingDay
                          ? "bg-pink-500 text-white font-bold shadow-lg ring-2 ring-rose-200"
                          : ""
                      }
                      ${
                        isToday && !isWeddingDay
                          ? "bg-gray-200 font-semibold"
                          : ""
                      }
                      ${
                        isCurrentMonth && !isWeddingDay && !isToday
                          ? "hover:bg-gray-100"
                          : ""
                      }
                    `}
                    style={{
                      fontFamily:
                        "Gowun Dodum, var(--font-gowun-dodum), system-ui, -apple-system, sans-serif",
                    }}
                  >
                    {format(day, "d")}
                    {isWeddingDay && (
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 rounded-lg bg-rose-400 opacity-30"
                      />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* 카운트다운 섹션 */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-4 gap-3 sm:gap-6">
              {timeUnits.map((unit, index) => (
                <motion.div
                  key={unit.label}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                  className="text-center"
                >
                  <motion.div
                    key={unit.value}
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="mb-2"
                  >
                    <span
                      className={`text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-br ${unit.color} bg-clip-text text-transparent`}
                      style={{
                        fontFamily:
                          "Gowun Dodum, var(--font-gowun-dodum), system-ui, -apple-system, sans-serif",
                      }}
                    >
                      {unit.value.toString().padStart(2, "0")}
                    </span>

                    {/* 펄스 효과 (초에만) */}
                    {unit.label === "SECONDS" && (
                      <motion.div
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="absolute inset-0 pointer-events-none"
                      />
                    )}
                  </motion.div>
                  <p
                    className="text-xs sm:text-sm font-semibold text-gray-500 tracking-wider"
                    style={{
                      fontFamily:
                        "Gowun Dodum, var(--font-gowun-dodum), system-ui, -apple-system, sans-serif",
                    }}
                  >
                    {unit.label}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="text-center pt-6 border-t border-rose-200"
            >
              <p
                //줄바꿈 없이
                className="text-lg text-gray-600 mb-4 break-keep"
                style={{
                  fontFamily:
                    "Gowun Dodum, var(--font-gowun-dodum), system-ui, -apple-system, sans-serif",
                }}
              >
                함께 축하해주실 여러분을
                <br />
                기다리고 있습니다 💕
              </p>

              {/* 일정 추가 버튼 */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={addToGoogleCalendar}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
                  style={{
                    fontFamily:
                      "Gowun Dodum, var(--font-gowun-dodum), system-ui, -apple-system, sans-serif",
                  }}
                >
                  <CalendarPlus className="w-5 h-5" />
                  Google 캘린더에 추가
                </motion.button>

                {/* <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={downloadICSFile}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
                  style={{
                    fontFamily:
                      "Gowun Dodum, var(--font-gowun-dodum), system-ui, -apple-system, sans-serif",
                  }}
                >
                  <CalendarPlus className="w-5 h-5" />
                  캘린더 파일 다운로드
                </motion.button> */}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
