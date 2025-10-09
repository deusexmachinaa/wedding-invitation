import { supabase } from "./supabase";

// 임시 타입 정의 (types/index.ts import 문제 해결)
interface Image {
  id: string;
  url: string;
  alt: string;
}

const GALLERY_BUCKET = "wedding-gallery";
const FOLDER_PATH = ""; // 폴더가 있으면 여기에 입력 (예: "uploads/", "images/")

/**
 * Supabase Storage에서 이미지의 공개 URL을 가져옵니다
 */
export function getPublicImageUrl(storagePath: string): string {
  // 폴더 경로 포함
  const fullPath = FOLDER_PATH ? `${FOLDER_PATH}${storagePath}` : storagePath;

  const { data } = supabase.storage.from(GALLERY_BUCKET).getPublicUrl(fullPath);

  console.log(`🔗 Generated URL for ${fullPath}:`, data.publicUrl);
  return data.publicUrl;
}

/**
 * Supabase Storage 버킷에서 모든 이미지를 자동으로 가져옵니다
 * DB 테이블이 필요 없습니다!
 */
export async function getGalleryImagesFromStorage(): Promise<Image[]> {
  try {
    console.log("🔍 Fetching images from Storage bucket:", GALLERY_BUCKET);
    console.log("📂 Folder path:", FOLDER_PATH || "(root)");

    // Storage 버킷에서 모든 파일 목록 가져오기
    const { data: files, error } = await supabase.storage
      .from(GALLERY_BUCKET)
      .list(FOLDER_PATH, {
        limit: 100,
        offset: 0,
        sortBy: { column: "name", order: "asc" },
      });

    if (error) {
      console.error("❌ Storage error:", error);
      console.log(
        "💡 체크사항: 1) 버킷 이름이 'wedding-gallery'인지 2) Public 버킷인지 확인하세요"
      );
      return [];
    }

    console.log("📁 Found files in storage:", files?.length || 0);
    if (files) {
      console.log("📄 File names:", files.map((f) => f.name).join(", "));
    }

    if (!files || files.length === 0) {
      console.log("⚠️ Storage 버킷이 비어있습니다. 이미지를 업로드해주세요.");
      return [];
    }

    // 이미지 파일만 필터링 (jpg, jpeg, png, webp, gif)
    const imageFiles = files.filter((file) => {
      const ext = file.name.toLowerCase().split(".").pop();
      return ["jpg", "jpeg", "png", "webp", "gif"].includes(ext || "");
    });

    console.log("🖼️ Image files found:", imageFiles.length);

    if (imageFiles.length === 0) {
      console.log(
        "⚠️ 이미지 파일이 없습니다. jpg, png, webp, gif 파일을 업로드해주세요."
      );
      return [];
    }

    // Image 타입으로 변환
    const images = imageFiles.map((file, index) => ({
      id: file.id || `${index}`,
      url: getPublicImageUrl(file.name),
      alt: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "), // 파일명에서 확장자 제거하고 alt 생성
    }));

    console.log("✅ Successfully loaded images from Storage:", images.length);
    console.log("🔗 First image URL:", images[0]?.url);

    return images;
  } catch (error) {
    console.error("❌ Exception in getGalleryImagesFromStorage:", error);
    return [];
  }
}

/**
 * 데이터베이스에서 갤러리 이미지 목록을 가져옵니다 (레거시 방식)
 * DB 테이블이 설정되어 있을 때만 사용
 */
export async function getGalleryImagesFromDB(): Promise<Image[]> {
  try {
    const { data, error } = await supabase
      .from("gallery_images")
      .select("*")
      .eq("is_visible", true)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      // 테이블이 없으면 조용히 무시 (정상 동작)
      return [];
    }

    return (data || []).map((item) => ({
      id: item.id,
      url: getPublicImageUrl(item.storage_path),
      alt: item.alt || "웨딩 사진",
    }));
  } catch (error) {
    // DB 연결 실패나 테이블이 없는 경우 조용히 무시
    return [];
  }
}

/**
 * 갤러리 이미지를 가져옵니다
 * 우선순위: 1. Storage 직접 조회 (추천) 2. DB 테이블 3. sampleData
 */
export async function getGalleryImages(): Promise<Image[]> {
  // 1. Storage에서 직접 가져오기 시도
  const storageImages = await getGalleryImagesFromStorage();
  if (storageImages.length > 0) {
    return storageImages;
  }

  // 2. DB 테이블에서 가져오기 시도
  const dbImages = await getGalleryImagesFromDB();
  if (dbImages.length > 0) {
    return dbImages;
  }

  // 3. 둘 다 없으면 빈 배열 반환 (sampleData 사용됨)
  return [];
}

/**
 * 이미지를 WebP로 변환합니다
 */
function convertToWebP(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      ctx?.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const webpFile = new File(
              [blob],
              file.name.replace(/\.[^/.]+$/, ".webp"),
              {
                type: "image/webp",
                lastModified: Date.now(),
              }
            );
            resolve(webpFile);
          } else {
            reject(new Error("WebP 변환 실패"));
          }
        },
        "image/webp",
        0.8
      ); // 80% 품질
    };

    img.onerror = () => reject(new Error("이미지 로드 실패"));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Supabase Storage에 이미지를 업로드합니다 (관리자 기능용)
 */
export async function uploadImage(
  file: File,
  filename: string,
  convertToWebPFormat: boolean = true
): Promise<{ url: string | null; error: Error | null }> {
  try {
    let finalFile = file;
    let finalFilename = filename;

    // WebP 변환 요청 시
    if (convertToWebPFormat && file.type.startsWith("image/")) {
      try {
        finalFile = await convertToWebP(file);
        finalFilename = filename.replace(/\.[^/.]+$/, ".webp");
        console.log(`🔄 ${file.name} → ${finalFilename} 변환 완료`);
      } catch (error) {
        console.warn("WebP 변환 실패, 원본 파일 사용:", error);
      }
    }

    // 폴더 경로 포함
    const fullPath = FOLDER_PATH
      ? `${FOLDER_PATH}${finalFilename}`
      : finalFilename;

    // 1. Storage에 파일 업로드
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(GALLERY_BUCKET)
      .upload(fullPath, finalFile, {
        cacheControl: "3600",
        upsert: true, // 같은 이름이면 덮어쓰기
      });

    if (uploadError) {
      throw uploadError;
    }

    // 2. 공개 URL 가져오기
    const publicUrl = getPublicImageUrl(finalFilename);

    return { url: publicUrl, error: null };
  } catch (error) {
    console.error("Error uploading image:", error);
    return { url: null, error: error as Error };
  }
}

/**
 * 데이터베이스에 이미지 메타데이터를 추가합니다
 */
export async function addImageMetadata(
  storagePath: string,
  alt: string,
  displayOrder: number
): Promise<{ success: boolean; error: Error | null }> {
  const { error } = await supabase.from("gallery_images").insert({
    storage_path: storagePath,
    alt,
    display_order: displayOrder,
  });

  if (error) {
    console.error("Error adding image metadata:", error);
    return { success: false, error: error as Error };
  }

  return { success: true, error: null };
}

/**
 * 이미지를 삭제합니다 (soft delete)
 */
export async function deleteImage(
  imageId: string
): Promise<{ success: boolean; error: Error | null }> {
  const { error } = await supabase
    .from("gallery_images")
    .update({ is_visible: false })
    .eq("id", imageId);

  if (error) {
    console.error("Error deleting image:", error);
    return { success: false, error: error as Error };
  }

  return { success: true, error: null };
}
