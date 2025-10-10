"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Heart,
  ChevronLeft,
  ChevronRight,
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

interface CountdownTimerProps {
  targetDate: string; // YYYY-MM-DD 형식
  groomName: string;
  brideName: string;
  ceremony: {
    time: string;
    date: string;
  };
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
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

  const generateCalendarDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 }); // 일요일 시작
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

    return eachDayOfInterval({ start: startDate, end: endDate });
  };

  const calculateTimeRemaining = (target: Date): TimeRemaining => {
    const now = new Date().getTime();
    const targetTime = target.getTime();
    const difference = targetTime - now;

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: true,
      };
    }

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
    return (
      <section className="py-16 px-6 bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
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
              🎉 결혼식 당일입니다! 🎉
            </h2>
            <p
              className="text-lg text-gray-600"
              style={{
                fontFamily:
                  "Gowun Dodum, var(--font-gowun-dodum), system-ui, -apple-system, sans-serif",
              }}
            >
              {groomName} ♥ {brideName}의 행복한 시작을 축하해주세요!
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  const calendarDays = generateCalendarDays();
  const weddingDate = new Date(ceremony.date);

  return (
    <section className="py-16 px-6 bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
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
              <span className="text-pink-400">{timeRemaining.days}</span>일
              남았습니다.
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
                className="text-lg text-gray-600 mb-4"
                style={{
                  fontFamily:
                    "Gowun Dodum, var(--font-gowun-dodum), system-ui, -apple-system, sans-serif",
                }}
              >
                함께 축하해주실 여러분을 기다리고 있습니다 💕
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
