"use client";

export const RSVPSection = () => {
  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-light text-gray-800 mb-8 text-center">
          참석 의사 전달
        </h2>
        <div className="bg-rose-50 p-6 rounded-lg">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                참석 여부
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="attendance"
                    value="yes"
                    className="mr-2"
                  />
                  참석
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="attendance"
                    value="no"
                    className="mr-2"
                  />
                  불참
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                성함
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                연락처
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                동행인 수
              </label>
              <select className="w-full px-4 py-2 border border-gray-200 rounded-lg">
                <option>1명</option>
                <option>2명</option>
                <option>3명</option>
                <option>4명</option>
              </select>
            </div>
            <button className="w-full py-3 bg-rose-500 text-white rounded-lg font-medium">
              전달하기
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
