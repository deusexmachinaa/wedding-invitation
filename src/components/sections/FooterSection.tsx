"use client";

export const FooterSection = () => {
  return (
    <section className="py-16 px-6 bg-gray-800 text-white">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <p className="text-lg font-light leading-relaxed">
            장담하건대, 세상이 다 겨울이어도
            <br />
            우리 사랑은 늘 봄처럼 따뜻하고
            <br />
            간혹, 여름처럼 뜨거울 겁니다.
          </p>
          <p className="text-sm text-gray-400 mt-4">이수동, &lt;사랑가&gt;</p>
        </div>

        <div className="border-t border-gray-700 pt-8">
          <button className="w-full py-3 bg-yellow-500 text-gray-800 rounded-lg font-medium mb-4">
            카카오톡으로 초대장 보내기
          </button>

          <p className="text-xs text-gray-500">
            Copyright© 2024. All rights reserved.
          </p>
        </div>
      </div>
    </section>
  );
};
