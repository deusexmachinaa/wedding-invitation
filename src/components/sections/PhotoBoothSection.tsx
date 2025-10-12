"use client";

import { Camera, Heart, Star } from "lucide-react";
import { SectionHeader } from "../ui/SectionHeader";
import { sampleWeddingData } from "@/data/sampleData";
import Image from "next/image";

export const PhotoBoothSection = () => {
  const photoBoothExamples = sampleWeddingData.photoBoothExamples || [];

  return (
    <section className="py-16 px-6 bg-gradient-to-br from-pink-50 to-rose-50">
      <div className="max-w-2xl mx-auto text-center">
        <SectionHeader
          englishTitle="PHOTO BOOTH"
          koreanTitle="포토부스 이용안내"
        />
        <div className="mb-6">
          <Camera className="w-12 h-12 mx-auto text-rose-500" />
        </div>

        <div className="bg-white rounded-xl p-8 shadow-sm border border-rose-100">
          <div className="space-y-6">
            {/* 메인 안내 */}
            <div className="text-center">
              <Heart className="w-8 h-8 mx-auto mb-3 text-pink-500" />
              <p className="text-lg text-gray-700 leading-relaxed">
                포토부스가 설치될 예정입니다.
              </p>
              <p className="text-gray-600 mt-2">
                귀한 발걸음 해주신 여러분의 환한 미소와
                <br />
                따뜻한 말씀 남겨주시면 소중히 간직하도록 하겠습니다.
              </p>
            </div>

            {/* 구분선 */}
            <div className="border-t border-rose-100 my-6"></div>

            {/* 이용 안내 */}
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="p-4">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-rose-600 font-bold text-lg">1</span>
                </div>
                <h4 className="font-medium text-gray-800 mb-2">촬영</h4>
                <p className="text-sm text-gray-600">
                  사진을 찍고
                  <br />
                  특별한 순간을 기록해보세요
                </p>
              </div>

              <div className="p-4">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-rose-600 font-bold text-lg">2</span>
                </div>
                <h4 className="font-medium text-gray-800 mb-2">메시지 작성</h4>
                <p className="text-sm text-gray-600">
                  신랑 신부에게
                  <br />
                  축하 메시지를 남겨주세요
                </p>
              </div>

              <div className="p-4">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-rose-600 font-bold text-lg">3</span>
                </div>
                <h4 className="font-medium text-gray-800 mb-2">소중한 추억</h4>
                <p className="text-sm text-gray-600">
                  여러분의 축복이
                  <br />
                  평생 기억에 남을 것입니다
                </p>
              </div>
            </div>

            {/* 포토 스타일 안내 */}
            <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg p-6 mt-6">
              <div className="flex items-center justify-center mb-6">
                <Star className="w-5 h-5 text-yellow-500 mr-2" />
                <h4 className="font-medium text-gray-800">포토 스타일 제안</h4>
                <Star className="w-5 h-5 text-yellow-500 ml-2" />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                {photoBoothExamples.map((example) => (
                  <div key={example.id} className="text-center">
                    {/* 예시 이미지 */}
                    <div className="relative w-full aspect-square mb-3 rounded-lg overflow-hidden shadow-md">
                      <Image
                        src={example.imageUrl}
                        alt={`${example.style} 스타일 예시`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    </div>
                    {/* 스타일 설명 */}
                    <div className="bg-white rounded-lg p-1 mb-2">
                      <span className="font-medium text-base">
                        {example.emoji} {example.style}
                      </span>
                      <p className="mt-1 text-xs">{example.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 운영 시간 */}
            <div className="text-center mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>운영시간:</strong> 예식 시작 전후 30분
                <br />
                <strong>위치:</strong> 웨딩홀 입구 로비
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
