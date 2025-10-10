"use client";

import { useEffect, useState } from "react";

interface KakaoStatic {
  init: (key: string) => void;
  isInitialized: () => boolean;
  Share: {
    sendDefault: (settings: {
      objectType: string;
      content: {
        title: string;
        description: string;
        imageUrl: string;
        link: {
          mobileWebUrl: string;
          webUrl: string;
        };
      };
      buttons: Array<{
        title: string;
        link: {
          mobileWebUrl: string;
          webUrl: string;
        };
      }>;
    }) => void;
  };
}

declare global {
  interface Window {
    Kakao: KakaoStatic;
  }
}

export const FooterSection = () => {
  const [isKakaoReady, setIsKakaoReady] = useState(false);
  const [kakaoError, setKakaoError] = useState<string>("");

  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 50; // 5초 동안 시도

    const initKakao = () => {
      try {
        if (window.Kakao && !window.Kakao.isInitialized()) {
          const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;

          if (!kakaoKey) {
            console.error("❌ 카카오 JavaScript 키가 설정되지 않았습니다.");
            console.error(
              "📝 .env.local 파일에 NEXT_PUBLIC_KAKAO_JS_KEY를 설정해주세요."
            );
            setKakaoError("카카오 키가 설정되지 않았습니다.");
            return false;
          }

          window.Kakao.init(kakaoKey);
          console.log("✅ 카카오 SDK 초기화 완료");
          setIsKakaoReady(true);
          return true;
        } else if (window.Kakao && window.Kakao.isInitialized()) {
          console.log("✅ 카카오 SDK 이미 초기화됨");
          setIsKakaoReady(true);
          return true;
        }
      } catch (error) {
        console.error("❌ 카카오 SDK 초기화 오류:", error);
        setKakaoError("카카오 SDK 초기화 실패");
        return false;
      }
      return false;
    };

    // SDK가 로드될 때까지 기다림
    if (window.Kakao) {
      initKakao();
    } else {
      const timer = setInterval(() => {
        attempts++;

        if (window.Kakao) {
          const success = initKakao();
          if (success) {
            clearInterval(timer);
          }
        } else if (attempts >= maxAttempts) {
          console.error("❌ 카카오 SDK 로드 시간 초과");
          setKakaoError("카카오 SDK를 불러올 수 없습니다.");
          clearInterval(timer);
        }
      }, 100);

      return () => clearInterval(timer);
    }
  }, []);

  const handleShareKakao = () => {
    if (kakaoError) {
      alert(
        `카카오톡 공유를 사용할 수 없습니다.\n\n${kakaoError}\n\n개발자 콘솔(F12)을 확인해주세요.\n대신 '초대장 공유하기' 버튼을 사용해주세요.`
      );
      return;
    }

    if (!isKakaoReady || !window.Kakao) {
      alert(
        "카카오톡 공유 기능을 불러오는 중입니다. 잠시 후 다시 시도해주세요."
      );
      return;
    }

    try {
      window.Kakao.Share.sendDefault({
        objectType: "feed",
        content: {
          title: "이태훈 ♥ 정혜원 결혼합니다",
          description:
            "2025년 12월 20일 토요일 오후 4시 20분\n퀸벨호텔 9F 퀸즈가든홀",
          imageUrl:
            "https://wedding-invitation-roan-omega.vercel.app/cover.jpg",
          link: {
            mobileWebUrl: "https://wedding-invitation-roan-omega.vercel.app/",
            webUrl: "https://wedding-invitation-roan-omega.vercel.app/",
          },
        },
        buttons: [
          {
            title: "청첩장 보기",
            link: {
              mobileWebUrl: "https://wedding-invitation-roan-omega.vercel.app/",
              webUrl: "https://wedding-invitation-roan-omega.vercel.app/",
            },
          },
        ],
      });
    } catch (error) {
      console.error("❌ 카카오톡 공유 오류:", error);
      alert(
        "카카오톡 공유에 실패했습니다.\n대신 '초대장 공유하기' 버튼을 사용해주세요."
      );
    }
  };

  const handleShareWeb = () => {
    const url = "https://wedding-invitation-roan-omega.vercel.app/";
    const title = "이태훈 ♥ 정혜원 결혼합니다";
    const text =
      "2025년 12월 20일 토요일 오후 4시 20분\n퀸벨호텔 9F 퀸즈가든홀";

    // Web Share API 지원 확인
    if (navigator.share) {
      navigator
        .share({
          title: title,
          text: text,
          url: url,
        })
        .catch((error) => {
          if (error.name !== "AbortError") {
            // AbortError는 사용자가 취소한 경우이므로 무시
            handleCopyLink();
          }
        });
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    const url = "https://wedding-invitation-roan-omega.vercel.app/";
    navigator.clipboard
      .writeText(url)
      .then(() => {
        alert("초대장 링크가 복사되었습니다!");
      })
      .catch(() => {
        alert("링크 복사에 실패했습니다. 다시 시도해주세요.");
      });
  };

  return (
    <section className="py-16 px-6 bg-gray-800 text-white">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <p className="text-lg font-light leading-relaxed">
            장담하건대, 세상이 다 겨울이어도
            <br />
            우리 사랑은 늘 봄처럼 따뜻하고
            <br />
            간혹, 여름처럼 뜨거울 겁니다.
          </p>
          <p className="text-sm text-gray-400 mt-4">이수동, &lt;사랑가&gt;</p>
        </div>

        <div className="border-t border-gray-700 pt-8 space-y-3">
          <button
            onClick={handleShareKakao}
            className={`w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
              kakaoError
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-yellow-400 hover:bg-yellow-500 text-gray-900"
            }`}
            disabled={!!kakaoError}
          >
            <span className="text-xl"></span>
            {kakaoError
              ? "카카오톡 공유 사용 불가"
              : isKakaoReady
              ? "카카오톡으로 초대장 보내기"
              : "카카오톡 로딩 중..."}
          </button>

          <button
            onClick={handleShareWeb}
            className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <span className="text-xl"></span>
            초대장 공유하기
          </button>

          <p className="text-xs text-gray-500 mt-8">
            Copyright© 2025. All rights reserved.
            <br />
            <a
              href="https://github.com/deusexmachinaa"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300 transition-colors inline-flex items-center gap-1 mt-2"
            >
              <span>Made by</span>
              <span className="underline">@deusexmachinaa</span>
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};
