"use client";

import Image from "next/image";

interface NavigationButtonsProps {
  venueName: string;
  address: string;
}

export const NavigationButtons = ({
  venueName,
  address,
}: NavigationButtonsProps) => {
  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      typeof window !== "undefined" ? window.navigator.userAgent : ""
    );
  };

  const handleNavigation = (type: "naver" | "kakao" | "tmap") => {
    const encodedVenue = encodeURIComponent(venueName);
    const encodedAddress = encodeURIComponent(address);
    const mobile = isMobile();

    switch (type) {
      case "naver":
        if (mobile) {
          // 모바일에서는 앱 우선 시도
          const naverAppUrl = `nmap://search?query=${encodedAddress}&appname=wedding-invitation`;
          const naverWebUrl = `https://map.naver.com/search/${encodedAddress}`;

          // 앱 실행 시도
          window.location.href = naverAppUrl;

          // 일정 시간 후 앱이 실행되지 않으면 웹으로 이동
          const timer = setTimeout(() => {
            window.open(naverWebUrl, "_blank");
          }, 1500);

          // 페이지가 숨겨지면 (앱이 실행되면) 타이머 제거
          const handleVisibilityChange = () => {
            if (document.hidden) {
              clearTimeout(timer);
            }
          };

          document.addEventListener("visibilitychange", handleVisibilityChange);

          // 3초 후 이벤트 리스너 제거
          setTimeout(() => {
            document.removeEventListener(
              "visibilitychange",
              handleVisibilityChange
            );
          }, 3000);
        } else {
          // 데스크톱에서는 바로 웹으로
          window.open(
            `https://map.naver.com/search/${encodedAddress}`,
            "_blank"
          );
        }
        break;

      case "kakao":
        if (mobile) {
          const kakaoAppUrl = `kakaonavi://destination?name=${encodedVenue}`;
          const kakaoWebUrl = `https://map.kakao.com/search/${encodedAddress}`;

          window.location.href = kakaoAppUrl;

          const timer = setTimeout(() => {
            window.open(kakaoWebUrl, "_blank");
          }, 1500);

          const handleVisibilityChange = () => {
            if (document.hidden) {
              clearTimeout(timer);
            }
          };

          document.addEventListener("visibilitychange", handleVisibilityChange);
          setTimeout(() => {
            document.removeEventListener(
              "visibilitychange",
              handleVisibilityChange
            );
          }, 3000);
        } else {
          window.open(
            `https://map.kakao.com/search/${encodedAddress}`,
            "_blank"
          );
        }
        break;

      case "tmap":
        if (mobile) {
          const tmapAppUrl = `tmap://search?name=${encodedVenue}`;
          const tmapWebUrl = `https://www.tmap.co.kr/search/poi?searchKeyword=${encodedAddress}`;

          window.location.href = tmapAppUrl;

          const timer = setTimeout(() => {
            window.open(tmapWebUrl, "_blank");
          }, 1500);

          const handleVisibilityChange = () => {
            if (document.hidden) {
              clearTimeout(timer);
            }
          };

          document.addEventListener("visibilitychange", handleVisibilityChange);
          setTimeout(() => {
            document.removeEventListener(
              "visibilitychange",
              handleVisibilityChange
            );
          }, 3000);
        } else {
          window.open(
            `https://www.tmap.co.kr/search/poi?searchKeyword=${encodedAddress}`,
            "_blank"
          );
        }
        break;
    }
  };

  const navigationOptions = [
    {
      id: "naver",
      name: "네이버지도",
      icon: (
        <Image
          src="/icons/naver-map.png"
          alt="네이버지도"
          width={16}
          height={16}
          className="object-contain"
        />
      ),
      color: "bg-green-100 text-green-600 hover:bg-green-200",
      onClick: () => handleNavigation("naver"),
    },
    {
      id: "kakao",
      name: "카카오네비",
      icon: (
        <Image
          src="/icons/kakao-navi.png"
          alt="카카오네비"
          width={16}
          height={16}
          className="object-contain"
        />
      ),
      color: "bg-yellow-100 text-yellow-600 hover:bg-yellow-200",
      onClick: () => handleNavigation("kakao"),
    },
    {
      id: "tmap",
      name: "티맵",
      icon: (
        <Image
          src="/icons/tmap.png"
          alt="티맵"
          width={16}
          height={16}
          className="object-contain"
        />
      ),
      color: "bg-blue-100 text-blue-600 hover:bg-blue-200",
      onClick: () => handleNavigation("tmap"),
    },
  ];

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-medium text-gray-800 mb-4">네비게이션</h4>

      {/* 모바일 최적화된 세로 배치 */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {navigationOptions.map((nav) => (
          <button
            key={nav.id}
            onClick={nav.onClick}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${nav.color} active:scale-95`}
          >
            {nav.icon}
            <span>{nav.name}</span>
          </button>
        ))}
      </div>

      {/* 안내 메시지 */}
      <div className="text-xs text-gray-500 mt-4 text-center">
        <p>버튼을 터치하면 해당 내비게이션 앱으로 이동합니다.</p>
        <p>앱이 없는 경우 웹 버전으로 연결됩니다.</p>
      </div>
    </div>
  );
};
