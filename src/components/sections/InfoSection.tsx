"use client";

import { CeremonyInfo } from "@/types";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { SectionHeader } from "../ui/SectionHeader";

interface InfoSectionProps {
  ceremony: CeremonyInfo;
}

export const InfoSection = ({ ceremony }: InfoSectionProps) => {
  const ceremonyDate = new Date(ceremony.date);
  const formattedDate = format(ceremonyDate, "yyyy. M. d. EEEE", {
    locale: ko,
  });

  return (
    <section className="py-16 px-6 bg-gradient-to-br from-white to-rose-50">
      <div className="max-w-2xl mx-auto text-center">
        <SectionHeader englishTitle="WEDDING INFO" koreanTitle="예식 안내" />
        <div className="text-xl font-light text-gray-800 mb-6">
          {formattedDate}
        </div>
        <div className="text-lg text-gray-700 mb-4">{ceremony.time}</div>
        <div className="text-lg text-gray-700 mb-2">
          {ceremony.venue} {ceremony.floor} {ceremony.hall}
        </div>
        <div className="text-gray-600">{ceremony.address}</div>
        <div className="text-gray-600 mt-2">Tel. {ceremony.phone}</div>
      </div>
    </section>
  );
};
