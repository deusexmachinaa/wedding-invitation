"use client";

interface SectionHeaderProps {
  englishTitle: string;
  koreanTitle: string;
  className?: string;
  variant?: "default" | "center" | "left";
}

export const SectionHeader = ({
  englishTitle,
  koreanTitle,
  className = "",
  variant = "center",
}: SectionHeaderProps) => {
  const alignmentClass = {
    center: "text-center",
    left: "text-left",
    default: "text-center",
  }[variant];

  return (
    <div className={`mb-12 ${alignmentClass} ${className}`}>
      <div className="inline-block relative">
        {/* 배경 장식 요소 */}
        <div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full opacity-60 -z-10"></div>
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-pink-200 to-rose-200 rounded-full opacity-40 -z-10"></div>

        <div className="relative">
          <p className="text-xs font-semibold tracking-[0.25em] text-rose-400 uppercase mb-2 opacity-90">
            {englishTitle}
          </p>
          <h2 className="text-2xl sm:text-3xl font-light text-gray-800 mb-3 leading-tight">
            {koreanTitle}
          </h2>

          {/* 개선된 장식적인 언더라인 */}
          <div className="flex items-center justify-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-rose-300 to-pink-300 opacity-60"></div>
            <div className="w-16 h-0.5 bg-gradient-to-r from-rose-300 via-pink-300 to-rose-300 rounded-full"></div>
            {/* <div className="w-3 h-3 rounded-full bg-gradient-to-br from-pink-300 to-rose-300 opacity-60"></div> */}
          </div>
        </div>
      </div>
    </div>
  );
};
