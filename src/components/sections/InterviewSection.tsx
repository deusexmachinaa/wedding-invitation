"use client";

import { InterviewQA } from "@/types";

interface InterviewSectionProps {
  interviews: InterviewQA[];
}

export const InterviewSection = ({ interviews }: InterviewSectionProps) => {
  return (
    <section className="py-16 px-6 bg-rose-50">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-light text-gray-800 mb-8 text-center">
          두 사람의 이야기
        </h2>
        <div className="space-y-6">
          {interviews.map((interview, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-3">
                Q. {interview.question}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {interview.answer}
              </p>
              {interview.answeredBy && (
                <p className="text-sm text-gray-500 mt-2">
                  -{" "}
                  {interview.answeredBy === "groom"
                    ? "신랑"
                    : interview.answeredBy === "bride"
                    ? "신부"
                    : "신랑 & 신부"}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
