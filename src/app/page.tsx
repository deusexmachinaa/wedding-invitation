import { WeddingInvitation } from "@/components/WeddingInvitation";
import { sampleWeddingData } from "@/data/sampleData";
import { getGalleryImages } from "@/lib/gallery";

export default async function Home() {
  // Supabase에서 갤러리 이미지 불러오기
  // 우선순위: 1. Storage 버킷 2. DB 테이블 3. sampleData
  let galleryImages = sampleWeddingData.gallery;

  try {
    const imagesFromSupabase = await getGalleryImages();
    if (imagesFromSupabase.length > 0) {
      galleryImages = imagesFromSupabase;
    }
    // Storage와 DB 둘 다 비어있으면 sampleData 사용 (정상 동작)
  } catch {
    // Supabase 연결 실패 시 sampleData 사용 (정상 동작)
  }

  const weddingData = {
    ...sampleWeddingData,
    gallery: galleryImages,
  };

  return (
    <main>
      <WeddingInvitation data={weddingData} />
    </main>
  );
}
