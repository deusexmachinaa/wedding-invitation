"use client";

import { SectionHeader } from "../ui/SectionHeader";

export const GuestbookSection = () => {
  return (
    <section className="py-16 px-6 bg-rose-50">
      <div className="max-w-2xl mx-auto">
        <SectionHeader englishTitle="GUESTBOOK" koreanTitle="방명록" />
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <textarea
            className="w-full h-32 p-4 border border-gray-200 rounded-lg resize-none"
            placeholder="따뜻한 마음을 전해주세요."
          />
          <div className="flex justify-between items-center mt-4">
            <input
              type="text"
              placeholder="성함"
              className="px-4 py-2 border border-gray-200 rounded-lg w-32"
            />
            <button className="px-6 py-2 bg-rose-500 text-white rounded-lg">
              작성하기
            </button>
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <span className="font-medium text-gray-800">예시 작성자</span>
              <span className="text-sm text-gray-500">2024.01.15</span>
            </div>
            <p className="text-gray-700">
              결혼을 진심으로 축하드립니다! 행복한 가정 꾸리세요 ❤️
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
