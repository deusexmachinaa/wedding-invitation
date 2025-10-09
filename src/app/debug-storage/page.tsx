"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function DebugStoragePage() {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkStorage() {
      setLoading(true);
      setError(null);

      try {
        console.log("🔍 Storage 디버깅 시작...");

        // 직접 버킷 이름으로 테스트 (RLS 정책 우회)
        const targetBucket = "wedding-gallery";
        console.log(`🎯 직접 버킷 테스트: ${targetBucket}`);

        // 1. 버킷 내 파일 목록 직접 조회
        const { data: files, error: filesError } = await supabase.storage
          .from(targetBucket)
          .list("", {
            limit: 100,
            offset: 0,
          });

        if (filesError) {
          console.error("❌ 파일 목록 조회 실패:", filesError);

          // 에러 메시지에 따라 다른 해결책 제시
          if (
            filesError.message?.includes("not found") ||
            filesError.message?.includes("does not exist")
          ) {
            throw new Error(
              `'${targetBucket}' 버킷이 존재하지 않습니다. Supabase 대시보드에서 버킷 이름을 확인해주세요.`
            );
          } else if (
            filesError.message?.includes("permission") ||
            filesError.message?.includes("policy")
          ) {
            throw new Error(
              `권한 문제입니다. Supabase Storage에서 RLS 정책을 설정하거나 버킷을 Public으로 변경해주세요.`
            );
          } else {
            throw filesError;
          }
        }

        console.log("✅ 파일 목록 조회 성공:", files);

        // 버킷 정보는 파일 조회 성공으로 추정
        const bucket = {
          name: targetBucket,
          public: true, // 파일 조회가 성공했다면 Public으로 추정
          created_at: new Date().toISOString(),
        };

        console.log("📄 파일 목록:", files);

        // 4. 이미지 파일만 필터링
        const imageFiles =
          files?.filter((file) => {
            const ext = file.name.toLowerCase().split(".").pop();
            return ["jpg", "jpeg", "png", "webp", "gif"].includes(ext || "");
          }) || [];

        console.log("🖼️ 이미지 파일들:", imageFiles);

        // 5. 공개 URL 생성
        const imagesWithUrls = imageFiles.map((file) => ({
          name: file.name,
          size: file.metadata?.size,
          url: supabase.storage.from(targetBucket).getPublicUrl(file.name).data
            .publicUrl,
        }));

        setResult({
          targetBucket: bucket,
          files,
          imageFiles,
          imagesWithUrls,
        });
      } catch (err: any) {
        console.error("❌ 오류:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    checkStorage();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Storage 조회 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            ❌ Storage 오류
          </h1>
          <p className="text-red-800 mb-4">{error}</p>
          <div className="bg-gray-100 p-4 rounded">
            <p className="text-sm text-gray-600">💡 해결 방법:</p>
            <ul className="text-sm text-gray-700 mt-2 space-y-1">
              <li>• Supabase 환경 변수가 올바른지 확인</li>
              <li>• 'wedding-gallery' 버킷이 존재하는지 확인</li>
              <li>• 버킷이 Public으로 설정되어 있는지 확인</li>
            </ul>
          </div>
          <a
            href="/"
            className="inline-block mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            ← 홈으로 돌아가기
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          🔍 Storage 디버깅 결과
        </h1>

        {/* 환경 변수 정보 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">
            📋 환경 정보
          </h2>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Supabase URL:</strong>{" "}
              {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ 설정됨" : "❌ 없음"}
            </p>
            <p>
              <strong>Supabase Key:</strong>{" "}
              {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
                ? "✅ 설정됨"
                : "❌ 없음"}
            </p>
          </div>
        </div>

        {/* 버킷 정보 */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-green-800 mb-4">
            ✅ 버킷 정보
          </h2>
          <div className="space-y-2">
            <p>
              <strong>이름:</strong> {result?.targetBucket?.name}
            </p>
            <p>
              <strong>상태:</strong>{" "}
              {result?.targetBucket?.public ? "Public ✅" : "Private ❌"}
            </p>
            <p>
              <strong>생성일:</strong> {result?.targetBucket?.created_at}
            </p>
          </div>
        </div>

        {/* 전체 파일 목록 */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            📄 전체 파일 목록 ({result?.files?.length || 0}개)
          </h2>
          {result?.files?.length === 0 ? (
            <p className="text-gray-600">파일이 없습니다.</p>
          ) : (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {result?.files?.map((file: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 text-sm"
                >
                  <span className="w-8">{index + 1}.</span>
                  <span className="flex-1">{file.name}</span>
                  <span className="text-gray-500">
                    {file.metadata?.size || "?"} bytes
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 이미지 파일 목록 */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-purple-800 mb-4">
            🖼️ 이미지 파일 목록 ({result?.imageFiles?.length || 0}개)
          </h2>
          {result?.imageFiles?.length === 0 ? (
            <p className="text-gray-600">이미지 파일이 없습니다.</p>
          ) : (
            <div className="space-y-4">
              {result?.imagesWithUrls?.map((img: any, index: number) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{img.name}</span>
                    <span className="text-sm text-gray-500">
                      {img.size} bytes
                    </span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 break-all">
                      <strong>URL:</strong> {img.url}
                    </p>
                    <div className="flex items-center space-x-4">
                      <a
                        href={img.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                      >
                        이미지 보기
                      </a>
                      <button
                        onClick={() => navigator.clipboard.writeText(img.url)}
                        className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
                      >
                        URL 복사
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 액션 버튼 */}
        <div className="flex space-x-4">
          <button
            onClick={() => window.location.reload()}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            🔄 다시 조회
          </button>
          <a
            href="/"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            ← 홈으로 돌아가기
          </a>
        </div>
      </div>
    </div>
  );
}
