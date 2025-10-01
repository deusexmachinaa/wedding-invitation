"use client";

import { CeremonyInfo } from "@/types";
import { NavigationButtons } from "../ui/NavigationButtons";
import { SectionHeader } from "../ui/SectionHeader";

interface LocationSectionProps {
  ceremony: CeremonyInfo;
}

export const LocationSection = ({ ceremony }: LocationSectionProps) => {
  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-2xl mx-auto">
        <SectionHeader englishTitle="LOCATION" koreanTitle="오시는 길" />

        {/* 지도 */}
        <div className="mb-8">
          <iframe
            src={`https://www.google.com/maps?q=${encodeURIComponent(
              ceremony.address
            )}&output=embed`}
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded-lg shadow-lg"
          ></iframe>
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
                    (교통 혼잡이 예상되오니 대중교통 이용을 권장드립니다)
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
