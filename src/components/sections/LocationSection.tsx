"use client";

import { useEffect, useRef } from "react";
import { CeremonyInfo } from "@/types";
import { NavigationButtons } from "../ui/NavigationButtons";
import { SectionHeader } from "../ui/SectionHeader";

interface LocationSectionProps {
  ceremony: CeremonyInfo;
}

interface NaverMap {
  setOptions: (options: {
    draggable?: boolean;
    scrollWheel?: boolean;
    disableDoubleClickZoom?: boolean;
    disableDoubleTapZoom?: boolean;
    disableTwoFingerTapZoom?: boolean;
  }) => void;
}

interface NaverLatLng {
  lat: () => number;
  lng: () => number;
}

type NaverLatLngConstructor = new (lat: number, lng: number) => NaverLatLng;
type NaverMapConstructor = new (
  container: HTMLElement,
  options: {
    center: NaverLatLng;
    zoom: number;
    draggable?: boolean;
    scrollWheel?: boolean;
    disableDoubleClickZoom?: boolean;
    disableDoubleTapZoom?: boolean;
    disableTwoFingerTapZoom?: boolean;
  }
) => NaverMap;
type NaverMarkerConstructor = new (options: {
  map: NaverMap;
  position: NaverLatLng;
}) => unknown;
type NaverInfoWindowConstructor = new (options: {
  content: string;
  borderWidth: number;
}) => {
  open: (map: NaverMap, marker: unknown) => void;
};

interface NaverMaps {
  LatLng: NaverLatLngConstructor;
  Map: NaverMapConstructor;
  Marker: NaverMarkerConstructor;
  InfoWindow: NaverInfoWindowConstructor;
  Position: {
    TOP_LEFT: string;
    TOP_RIGHT: string;
    BOTTOM_LEFT: string;
    BOTTOM_RIGHT: string;
  };
}

declare global {
  interface Window {
    naver: {
      maps: NaverMaps;
    };
  }
}

export const LocationSection = ({ ceremony }: LocationSectionProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 네이버 지도 로드
    const loadNaverMap = () => {
      console.log("네이버 지도 로드 시작");
      if (window.naver && window.naver.maps) {
        console.log("네이버 지도 객체 확인됨");
        if (mapContainer.current) {
          try {
            // 퀸벨호텔 좌표 (대구광역시 동구 동촌로 200)
            const position = new window.naver.maps.LatLng(
              35.8824102975974,
              128.662109053984
            );

            const mapOption = {
              center: position,
              zoom: 16,
              draggable: true,
              scrollWheel: true,
              disableDoubleClickZoom: false,
              disableDoubleTapZoom: false,
              disableTwoFingerTapZoom: false,
              // 확대/축소 컨트롤 표시
              zoomControl: true,
              zoomControlOptions: {
                position: window.naver.maps.Position.TOP_RIGHT,
              },
              // 지도 타입 컨트롤 (일반/위성 전환)
              mapTypeControl: true,
              mapTypeControlOptions: {
                position: window.naver.maps.Position.TOP_LEFT,
              },
            };

            const map = new window.naver.maps.Map(
              mapContainer.current,
              mapOption
            );

            // 마커 생성
            const marker = new window.naver.maps.Marker({
              map: map,
              position: position,
            });

            // 인포윈도우 생성
            const infowindow = new window.naver.maps.InfoWindow({
              content: `<div style="padding:12px;font-size:13px;text-align:center;"><strong style="display:block;margin-bottom:5px;">${ceremony.venue}</strong><span style="color:#666;">${ceremony.address}</span></div>`,
              borderWidth: 0,
            });
            infowindow.open(map, marker);
            console.log("지도 렌더링 완료");
          } catch (error) {
            console.error("지도 생성 오류:", error);
          }
        } else {
          console.error("mapContainer.current가 없음");
        }
      } else {
        console.error("window.naver.maps가 없음");
      }
    };

    // 스크립트가 로드될 때까지 대기
    const timer = setTimeout(() => {
      if (window.naver && window.naver.maps) {
        loadNaverMap();
      } else {
        console.log("네이버 지도 스크립트 로드 대기 중...");
        const checkNaverMap = setInterval(() => {
          if (window.naver && window.naver.maps) {
            console.log("네이버 지도 스크립트 로드됨");
            clearInterval(checkNaverMap);
            loadNaverMap();
          }
        }, 100);

        return () => clearInterval(checkNaverMap);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [ceremony]);

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-2xl mx-auto">
        <SectionHeader englishTitle="LOCATION" koreanTitle="오시는 길" />

        {/* 네이버 지도 */}
        <div className="mb-8">
          <div
            ref={mapContainer}
            className="w-full h-[400px] rounded-lg shadow-lg"
          />
        </div>

        {/* 예식장 정보 */}
        <div className="text-center mb-8">
          <h3 className="font-semibold text-gray-800 mb-2 text-xl">
            {ceremony.venue}
          </h3>
          {ceremony.floor && ceremony.hall && (
            <p className="text-gray-600 mb-2">
              {ceremony.floor} {ceremony.hall}
            </p>
          )}
          <p className="text-gray-600 mb-4">{ceremony.address}</p>
          <p className="text-sm text-gray-500 mb-6">Tel. {ceremony.phone}</p>

          <NavigationButtons
            venueName={ceremony.venue}
            address={ceremony.address}
          />
        </div>

        {/* 교통편 안내 */}
        <div className="mt-12 space-y-6">
          <h4 className="text-lg font-semibold text-gray-800 text-center mb-6">
            교통편 안내
          </h4>

          {/* 지하철 */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🚇</span>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">지하철</h5>
                <p className="text-sm text-gray-600 leading-relaxed">
                  <span className="font-medium">1호선 해안역(퀸벨호텔)</span>{" "}
                  3번 출구 (전방 50m)
                  <br />
                  <span className="text-xs text-gray-500">
                    대경선 이용: 구미역 또는 경산역 → 동대구역 1호선 환승 →
                    해안역
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* 버스 */}
          <div className="bg-green-50 p-6 rounded-lg">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🚌</span>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">버스</h5>
                <p className="text-sm text-gray-600 leading-relaxed">
                  <span className="font-medium">퀸벨호텔 정류장:</span> 618,
                  719, 805, 818, 836, 동구1, 동구3
                  <br />
                  <span className="font-medium">
                    퀸벨호텔 정류장 건너편:
                  </span>{" "}
                  618, 719, 805, 818, 836, 동구1-1, 동구3
                </p>
              </div>
            </div>
          </div>

          {/* 자가용 */}
          <div className="bg-purple-50 p-6 rounded-lg">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🚗</span>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">자가용</h5>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">
                  <span className="font-medium">서울/부산 방면:</span>
                  <br />
                  동대구분기점 → 동대구IC → 동대구 톨게이트 → 시청 방면 왼쪽
                  고가차도 진입 → 800m 전방 우회전 → 용호네거리 좌회전 → 1.2km
                  전방 좌회전 → 퀸벨호텔
                </p>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">
                  <span className="font-medium">포항 방면:</span>
                  <br />
                  포항IC → 팔공산 톨게이트 → 복현오거리/대구국제공항 방면 좌회전
                  → 불로삼거리 대구국제공항 방면 좌회전 → 3.2km 전방 퀸벨호텔
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  <span className="font-medium">광주 방면:</span>
                  <br />
                  광주대구고속도로 → 중부내륙고속도로지선 → 경부고속도로 →
                  동대구IC (이후 서울/부산 방면과 동일)
                </p>
              </div>
            </div>
          </div>

          {/* 주차 안내 */}
          <div className="bg-amber-50 p-6 rounded-lg">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🅿️</span>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">주차 안내</h5>
                <p className="text-sm text-gray-600 leading-relaxed">
                  본관 지상 및 지하주차장 600여대 주차 가능
                  <br />
                  <span className="text-xs text-gray-500">
                    홈플러스 주차장은 홈플러스 폐점으로 인해 사용 불가합니다
                  </span>
                  <br />
                  <span className="text-xs text-gray-500">
                    외부 주차 가능 공간은 예식 당일 안내 요원이 실시간으로 확인
                    예정입니다.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
