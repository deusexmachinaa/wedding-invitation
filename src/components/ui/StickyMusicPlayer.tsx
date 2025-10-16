"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  ChevronUp,
  ChevronDown,
  SkipForward,
  X,
  ArrowUp,
} from "lucide-react";
import { BackgroundMusic } from "../../types";

interface StickyMusicPlayerProps {
  backgroundMusic?: BackgroundMusic;
}

const formatTime = (time: number): string => {
  if (!isFinite(time) || isNaN(time)) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const HIDE_ZONE_RATIO = 0.85; // 화면 하단 15% 영역에서 숨김

export const StickyMusicPlayer: React.FC<StickyMusicPlayerProps> = ({
  backgroundMusic,
}: StickyMusicPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isDragging, setIsDragging] = useState(false);
  const [showHideZone, setShowHideZone] = useState(false);
  const [isVolumeDragging, setIsVolumeDragging] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  // 🎯 간단한 진행바 상태
  const [isProgressDragging, setIsProgressDragging] = useState(false);
  const [tempProgressPercent, setTempProgressPercent] = useState(0);

  const [currentSongIndex, setCurrentSongIndex] = useState(() => {
    return backgroundMusic?.currentSongIndex || 0;
  });

  // 드래그 컨트롤
  const dragControls = useDragControls();

  // 현재 노래 정보 가져오기 (안전하게)
  const currentSong = backgroundMusic?.songs?.[currentSongIndex];
  const totalSongs = backgroundMusic?.songs?.length || 0;

  // 🎯 간단한 진행바 핸들러들 (마우스/터치 X 좌표 기반)
  const getProgressFromClientX = (element: HTMLElement, clientX: number) => {
    const rect = element.getBoundingClientRect();
    const x = clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, x / rect.width));
    return ratio * 100;
  };

  const handleProgressClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (duration === 0) return;

    const progressPercent = getProgressFromClientX(
      e.currentTarget as HTMLElement,
      e.clientX
    );
    const newTime = (progressPercent / 100) * duration;

    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleProgressMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (duration === 0) return;

    setIsProgressDragging(true);
    const progressPercent = getProgressFromClientX(
      e.currentTarget as HTMLElement,
      e.clientX
    );
    setTempProgressPercent(progressPercent);
  };

  const handleProgressMouseMove = (e: React.MouseEvent) => {
    if (!isProgressDragging || duration === 0) return;

    const progressPercent = getProgressFromClientX(
      e.currentTarget as HTMLElement,
      e.clientX
    );
    setTempProgressPercent(progressPercent);
  };

  // 🎯 터치 이벤트 핸들러들
  const handleProgressTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();

    if (duration === 0) return;

    setIsProgressDragging(true);
    const progressPercent = getProgressFromClientX(
      e.currentTarget as HTMLElement,
      e.touches[0].clientX
    );
    setTempProgressPercent(progressPercent);
  };

  const handleProgressTouchMove = (e: React.TouchEvent) => {
    if (!isProgressDragging || duration === 0) return;

    // preventDefault 제거하여 스크롤 방지하지 않음
    e.stopPropagation();

    const progressPercent = getProgressFromClientX(
      e.currentTarget as HTMLElement,
      e.touches[0].clientX
    );
    setTempProgressPercent(progressPercent);
  };

  const handleProgressTouchEnd = (e: React.TouchEvent) => {
    if (!isProgressDragging) return;

    e.stopPropagation();

    const newTime = (tempProgressPercent / 100) * duration;
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = newTime;
      setCurrentTime(newTime);

      // 재생 중이었다면 재생 상태 유지 (상태 변경 완료 후 실행)
      if (isPlaying) {
        setTimeout(() => {
          audio.play().catch(console.error);
        }, 0);
      }
    }

    setIsProgressDragging(false);
    setTempProgressPercent(0);
  };

  const handleProgressMouseUp = () => {
    if (!isProgressDragging) return;

    const newTime = (tempProgressPercent / 100) * duration;
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = newTime;
      setCurrentTime(newTime);

      // 재생 중이었다면 재생 상태 유지 (상태 변경 완료 후 실행)
      if (isPlaying) {
        setTimeout(() => {
          audio.play().catch(console.error);
        }, 0);
      }
    }

    setIsProgressDragging(false);
    setTempProgressPercent(0);
  };

  // 오디오 이벤트 설정
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong?.url) return;

    const handleLoadedMetadata = () => {
      if (!isNaN(audio.duration) && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handleTimeUpdate = () => {
      // 드래그 중일 때는 timeupdate 무시
      if (isProgressDragging) return;

      if (!isNaN(audio.currentTime) && isFinite(audio.currentTime)) {
        setCurrentTime(audio.currentTime);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);

      // 다음 곡 자동 재생
      if (totalSongs > 1) {
        setTimeout(() => {
          try {
            handleNextSong();
          } catch (error) {
            // 다음 곡 자동 재생 실패
            console.log("다음 곡 자동 재생 실패:", error);
          }
        }, 100);
      }
    };

    // 오디오 소스 설정
    if (audio.src !== currentSong.url) {
      audio.src = currentSong.url;
      audio.load();
    }

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSong?.url, totalSongs]);

  // 볼륨 및 음소거 설정
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = isMuted ? 0 : volume;
      audio.muted = isMuted;
    }
  }, [volume, isMuted]);

  // 스크롤 방향 감지 및 버튼 표시/숨김
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // 스크롤 방향 감지
      const isScrollingUp = currentScrollY < lastScrollY;

      // 버튼 표시 조건: 위로 스크롤 중이고 300px 이상 스크롤했을 때
      setShowScrollToTop(isScrollingUp && currentScrollY > 300);

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // 스크롤 투 탑 함수
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // 자동 재생 설정
  useEffect(() => {
    const audio = audioRef.current;
    if (audio && backgroundMusic?.autoPlay && currentSong?.url) {
      const playAudio = async () => {
        try {
          await audio.play();
          setIsPlaying(true);
        } catch (error) {
          // 자동 재생 실패
          console.log("자동 재생 실패:", error);
        }
      };
      playAudio();
    }
  }, [backgroundMusic?.autoPlay, currentSong?.url]);

  // 재생/일시정지
  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      // 재생 오류
      console.log("재생 오류:", error);
    }
  };

  // 음소거 토글
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // 볼륨 변경
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0) {
      setIsMuted(false);
    }
  };

  // 다음 곡
  const handleNextSong = useCallback(() => {
    if (totalSongs <= 1) return;

    const newIndex =
      currentSongIndex < totalSongs - 1 ? currentSongIndex + 1 : 0;
    setCurrentSongIndex(newIndex);
    setCurrentTime(0);

    // 재생 중이었다면 새 곡도 자동 재생
    if (isPlaying) {
      setTimeout(() => {
        const audio = audioRef.current;
        if (audio) {
          audio.play().catch(console.error);
        }
      }, 100);
    }
  }, [totalSongs, currentSongIndex, isPlaying]);

  // 드래그 시작
  const handleDragStart = () => {
    setIsDragging(true);
  };

  // 드래그 중
  const handleDrag = (_: unknown, info: { point: { y: number } }) => {
    const screenHeight = window.innerHeight;
    const hideZone = screenHeight * HIDE_ZONE_RATIO;
    const currentY = info.point.y - window.scrollY; // 뷰포트 기준 좌표로 변환
    const showZone = hideZone - screenHeight * 0.15; // hideZone보다 위쪽에서부터 표시

    if (currentY > showZone && !showHideZone) {
      setShowHideZone(true);
    } else if (currentY <= showZone && showHideZone) {
      setShowHideZone(false);
    }
  };

  // 드래그 종료
  const handleDragEnd = (_: unknown, info: { point: { y: number } }) => {
    setIsDragging(false);

    const screenHeight = window.innerHeight;
    const hideZone = screenHeight * HIDE_ZONE_RATIO;
    const dropY = info.point.y - window.scrollY; // 뷰포트 기준 좌표로 변환

    if (dropY > hideZone) {
      setIsHidden(true);
      setShowHideZone(false);
    }
  };

  // 플레이어 표시/숨김
  const showPlayer = () => {
    setIsHidden(false);
  };

  // 볼륨 드래그 상태 전역 관리
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsVolumeDragging(false);
    };

    if (isVolumeDragging) {
      document.addEventListener("mouseup", handleGlobalMouseUp);
      return () => {
        document.removeEventListener("mouseup", handleGlobalMouseUp);
      };
    }
  }, [isVolumeDragging]);

  // 배경음악이 없으면 렌더링하지 않음
  if (!backgroundMusic?.songs?.length) {
    return null;
  }

  return (
    <>
      <AnimatePresence>
        {/* 숨김 영역 표시 */}
        {showHideZone && (
          <motion.div
            key="hide-zone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 h-20 bg-red-500/20 backdrop-blur-sm border-t-2 border-red-500 flex items-center justify-center z-30"
          >
            <div className="flex items-center gap-2 text-red-600">
              <X className="w-5 h-5" />
              <span className="text-sm font-medium">
                여기에 놓으면 플레이어가 숨겨집니다
              </span>
            </div>
          </motion.div>
        )}

        {/* 숨겨진 상태의 표시 버튼 */}
        {isHidden && (
          <motion.button
            key="show-button"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            onClick={showPlayer}
            className="fixed top-4 right-4 w-12 h-12 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform z-40"
          >
            <Play className="w-6 h-6" />
          </motion.button>
        )}

        {/* 메인 플레이어 */}
        {!isHidden && (
          <motion.div
            key="main-player"
            initial={{ opacity: 0, y: 100 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: isDragging ? 1.05 : 1,
            }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-6 right-6 z-40"
            drag={!isVolumeDragging && !isProgressDragging}
            dragControls={dragControls}
            dragConstraints={false}
            dragElastic={0.1}
            dragMomentum={false}
            onDragStart={handleDragStart}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex flex-col gap-2">
              {/* 작은 상태 플레이어 */}
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-4 min-w-[280px]"
              >
                <div className="flex items-center justify-between gap-3">
                  {/* 음소거 버튼 */}
                  <button
                    onClick={toggleMute}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    title={isMuted ? "음소거 해제" : "음소거"}
                  >
                    {isMuted ? (
                      <VolumeX className="w-4 h-4 text-gray-600" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                  {/* 노래 정보 */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-900 truncate font-gowun-dodum">
                      {currentSong?.title}
                    </div>
                    <div className="text-xs text-gray-500 font-gowun-dodum">
                      {currentSong?.artist}
                    </div>
                    <div className="text-xs text-gray-400 font-gowun-dodum">
                      {currentSongIndex + 1} / {totalSongs}
                    </div>
                  </div>

                  {/* 재생 버튼 */}
                  <button
                    onClick={togglePlay}
                    className="w-10 h-10 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 flex items-center justify-center text-white shadow-md transition-all duration-200 hover:scale-105"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5 ml-0.5" />
                    )}
                  </button>

                  {/* 다음곡 버튼 */}
                  {totalSongs > 1 && (
                    <button
                      onClick={handleNextSong}
                      className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                      title="다음 곡"
                    >
                      <SkipForward className="w-3 h-3 text-gray-600" />
                    </button>
                  )}

                  {/* 확장 버튼 */}
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-600" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                </div>
              </motion.div>

              {/* 확장된 컨트롤 */}
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-6 min-w-[280px]"
                >
                  {/* 볼륨 조절 */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 font-gowun-dodum">
                        볼륨
                      </span>
                      <span className="text-xs text-gray-500 font-gowun-dodum">
                        {Math.round((isMuted ? 0 : volume) * 100)}%
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={toggleMute}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        {isMuted ? (
                          <VolumeX className="w-4 h-4" />
                        ) : (
                          <Volume2 className="w-4 h-4" />
                        )}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        onMouseDown={() => setIsVolumeDragging(true)}
                        onTouchStart={() => setIsVolumeDragging(true)}
                        className="flex-1 slider accent-rose-500"
                      />
                    </div>
                  </div>

                  {/* 플레이리스트 */}
                  <div className="mt-4">
                    <div className="text-sm font-medium text-gray-700 mb-2 font-gowun-dodum">
                      플레이리스트
                    </div>
                    <div
                      className="max-h-32 overflow-y-auto space-y-1"
                      style={{ overscrollBehavior: "contain" }}
                      onTouchStart={(e) => e.stopPropagation()}
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      {backgroundMusic?.songs?.map((song, index) => (
                        <button
                          key={song.id}
                          onClick={() => setCurrentSongIndex(index)}
                          className={`w-full text-left p-2 rounded-lg transition-colors ${
                            index === currentSongIndex
                              ? "bg-gradient-to-r from-rose-100 to-pink-100 border border-rose-200"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <div
                                className={`text-sm truncate ${
                                  index === currentSongIndex
                                    ? "font-semibold text-rose-600"
                                    : "text-gray-700"
                                } font-gowun-dodum`}
                              >
                                {song.title}
                              </div>
                              <div className="text-xs text-gray-500 font-gowun-dodum">
                                {song.artist}
                              </div>
                            </div>
                            {index === currentSongIndex && (
                              <div className="flex items-center gap-1">
                                {isPlaying && (
                                  <div className="w-1 h-1 bg-rose-500 rounded-full animate-pulse"></div>
                                )}
                                <span className="text-xs text-rose-500 font-medium">
                                  재생 중
                                </span>
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 진행 표시 - 간단한 인라인 방식 */}
                  <div className="mt-4">
                    <div
                      className={`w-full bg-gray-200 rounded-full cursor-pointer transition-all duration-200 ${
                        isProgressDragging ? "h-4" : "h-3 hover:h-4"
                      }`}
                      onClick={handleProgressClick}
                      onMouseDown={handleProgressMouseDown}
                      onMouseMove={handleProgressMouseMove}
                      onMouseUp={handleProgressMouseUp}
                      onMouseLeave={handleProgressMouseUp}
                      onTouchStart={handleProgressTouchStart}
                      onTouchMove={handleProgressTouchMove}
                      onTouchEnd={handleProgressTouchEnd}
                    >
                      <div
                        className="bg-gradient-to-r from-rose-400 to-pink-400 h-full rounded-full relative"
                        style={{
                          width: `${
                            isProgressDragging
                              ? tempProgressPercent
                              : duration > 0
                              ? (currentTime / duration) * 100
                              : 0
                          }%`,
                          transition: isProgressDragging
                            ? "none"
                            : "width 0.3s ease-out",
                        }}
                      >
                        {/* 재생 위치 핸들 */}
                        {duration > 0 && (
                          <div
                            className={`absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 bg-white border-2 border-rose-500 rounded-full pointer-events-none transition-all duration-200 ${
                              isProgressDragging
                                ? "w-4 h-4 shadow-lg"
                                : "w-3 h-3 shadow-md"
                            }`}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>
                      {formatTime(
                        isProgressDragging
                          ? (tempProgressPercent / 100) * duration
                          : currentTime
                      )}
                    </span>
                    <span>
                      {duration > 0 && !isNaN(duration) && isFinite(duration)
                        ? formatTime(duration)
                        : "로딩 중..."}
                    </span>
                  </div>
                  <div className="text-center text-xs text-gray-400 mt-1">
                    플레이어를 아래로 드래그하면 숨길 수 있어요
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 스크롤 투 탑 버튼 */}
      <AnimatePresence>
        {showScrollToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-40 backdrop-blur-md bg-white/20 border border-white/30 text-gray-700 p-3 rounded-full shadow-xl hover:bg-white/30 hover:border-white/50 transition-all duration-300 hover:scale-110 active:scale-95"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* 숨겨진 오디오 엘리먼트 */}
      <audio ref={audioRef} preload="auto" crossOrigin="anonymous" />

      {/* 커스텀 슬라이더 스타일 */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          background: #f472b6;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          background: #f472b6;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </>
  );
};
