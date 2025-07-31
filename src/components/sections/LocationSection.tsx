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
        <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center mb-6">
          <span className="text-gray-500">지도 (추후 구현)</span>
        </div>
        {/* Todo :  오시는 길 약도이미지, 길 설명(지하철 등) 넣기 */}
        <div className="text-center">
          <h3 className="font-semibold text-gray-800 mb-2">{ceremony.venue}</h3>
          <p className="text-gray-600 mb-4">{ceremony.address}</p>
          <p className="text-sm text-gray-500 mb-6">Tel. {ceremony.phone}</p>

          <NavigationButtons
            venueName={ceremony.venue}
            address={ceremony.address}
          />
        </div>
      </div>
    </section>
  );
};
