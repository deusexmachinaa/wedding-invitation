"use client";

import { PersonInfo } from "@/types";
import { SectionHeader } from "../ui/SectionHeader";

interface InvitationSectionProps {
  message: string;
  groom: PersonInfo;
  bride: PersonInfo;
}

export const InvitationSection = ({
  message,
  groom,
  bride,
}: InvitationSectionProps) => {
  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-2xl mx-auto text-center">
        <SectionHeader
          englishTitle="INVITATION"
          koreanTitle="소중한 분들을 초대합니다"
        />

        <div className="mb-12">
          <p className="text-lg leading-relaxed text-gray-700 whitespace-pre-line">
            {message}
          </p>
        </div>

        <div className="flex justify-center items-center gap-8 text-lg text-gray-800">
          <div className="text-center">
            <div className="mb-2 whitespace-nowrap">
              <span className="text-gray-600">{groom.father}</span>
              <span className="mx-2">·</span>
              <span className="text-gray-600">{groom.mother}</span>
            </div>
            <div className="text-sm text-gray-500 mb-1">의 장남</div>
            <div className="font-semibold">{groom.name}</div>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-300 to-pink-300 flex items-center justify-center mb-2">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
          </div>

          <div className="text-center">
            <div className="mb-2 whitespace-nowrap">
              <span className="text-gray-600">{bride.father}</span>
              <span className="mx-2">·</span>
              <span className="text-gray-600">{bride.mother}</span>
            </div>
            <div className="text-sm text-gray-500 mb-1">의 장녀</div>
            <div className="font-semibold">{bride.name}</div>
          </div>
        </div>
      </div>
    </section>
  );
};
