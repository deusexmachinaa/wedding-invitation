"use client";

import { useState } from "react";
import { uploadImage } from "@/lib/gallery";

export default function GalleryAdminPage() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({
    completed: 0,
    total: 0,
  });
  const [message, setMessage] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(e.target.files);
      setMessage(`📁 ${e.target.files.length}개의 파일이 선택되었습니다.`);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!files || files.length === 0) {
      setMessage("❌ 파일을 선택해주세요.");
      return;
    }

    setUploading(true);
    setUploadProgress({ completed: 0, total: files.length });
    setMessage(`⏳ ${files.length}개 파일 업로드 중...`);
    setUploadedFiles([]);

    const results: string[] = [];
    let completed = 0;

    try {
      // 모든 파일을 순차적으로 업로드
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // 파일명 생성 (타임스탬프 + 원본 파일명)
        const filename = `${Date.now()}_${i + 1}_${file.name}`;

        const { url, error } = await uploadImage(file, filename);

        if (error || !url) {
          console.error(`파일 ${file.name} 업로드 실패:`, error);
          setMessage(
            `⚠️ ${file.name} 업로드 실패: ${
              error?.message || "알 수 없는 오류"
            }`
          );
        } else {
          results.push(url);
          setUploadedFiles([...results]);
        }

        completed++;
        setUploadProgress({ completed, total: files.length });
        setMessage(`⏳ 업로드 중... (${completed}/${files.length})`);
      }

      setMessage(
        `✅ 업로드 완료! ${results.length}개 파일이 성공적으로 업로드되었습니다.`
      );

      // 폼 초기화
      setFiles(null);
      const fileInput = document.getElementById(
        "file-input"
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error("Upload error:", error);
      setMessage(`❌ 오류: ${(error as Error).message}`);
    } finally {
      setUploading(false);
      setUploadProgress({ completed: 0, total: 0 });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          📸 갤러리 관리자 페이지
        </h1>
        <p className="text-gray-600 text-center mb-8">
          웨딩 사진을 업로드하고 관리할 수 있습니다
        </p>

        <form onSubmit={handleUpload} className="space-y-6">
          {/* 대량 파일 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              웨딩 사진들 (여러 개 선택 가능)
            </label>
            <input
              id="file-input"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100"
              disabled={uploading}
            />
            {files && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  선택된 파일 ({files.length}개):
                </p>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {Array.from(files).map((file, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center text-xs text-gray-600"
                    >
                      <span className="truncate flex-1">{file.name}</span>
                      <span className="ml-2 text-gray-400">
                        {(file.size / 1024 / 1024).toFixed(1)}MB
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 진행률 표시 */}
          {uploading && uploadProgress.total > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>업로드 진행률</span>
                <span>
                  {uploadProgress.completed} / {uploadProgress.total}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-rose-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      (uploadProgress.completed / uploadProgress.total) * 100
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          )}

          {/* 업로드 버튼 */}
          <button
            type="submit"
            disabled={uploading || !files || files.length === 0}
            className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-4 px-6 rounded-lg font-semibold hover:from-rose-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
            {uploading
              ? "⏳ 업로드 중..."
              : `📤 ${files ? files.length : 0}개 파일 업로드`}
          </button>
        </form>

        {/* 메시지 */}
        {message && (
          <div
            className={`mt-6 p-4 rounded-lg ${
              message.includes("✅")
                ? "bg-green-50 text-green-800 border border-green-200"
                : message.includes("❌")
                ? "bg-red-50 text-red-800 border border-red-200"
                : "bg-blue-50 text-blue-800 border border-blue-200"
            }`}
          >
            <p className="text-sm whitespace-pre-wrap">{message}</p>
          </div>
        )}

        {/* 업로드된 파일 목록 */}
        {uploadedFiles.length > 0 && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800 mb-3">
              ✅ 업로드 완료된 파일들
            </h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {uploadedFiles.map((url, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 text-sm"
                >
                  <span className="text-green-600">✓</span>
                  <span className="flex-1 truncate text-gray-700">
                    {url.split("/").pop()}
                  </span>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    보기
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 간단한 안내 */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">
            💡 간단 안내
          </h3>
          <ul className="space-y-1 text-xs text-blue-700">
            <li>• 여러 파일을 한 번에 선택하여 업로드 가능</li>
            <li>• 자동으로 WebP 변환 (파일 크기 최적화)</li>
            <li>• 업로드 후 메인 페이지에서 자동으로 표시</li>
          </ul>
        </div>

        {/* 홈으로 돌아가기 */}
        <div className="mt-6 text-center">
          <a
            href="/"
            className="inline-block text-rose-600 hover:text-rose-700 font-medium transition-colors"
          >
            ← 청첩장으로 돌아가기
          </a>
        </div>
      </div>
    </div>
  );
}
