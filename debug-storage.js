// Storage 디버깅 스크립트
// 터미널에서 실행: node debug-storage.js

const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log("🔍 환경 변수 확인:");
console.log("URL:", supabaseUrl ? "✅ 설정됨" : "❌ 없음");
console.log("Key:", supabaseKey ? "✅ 설정됨" : "❌ 없음");

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ 환경 변수가 설정되지 않았습니다!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugStorage() {
  console.log("\n🔍 Storage 버킷 조회 중...");

  try {
    // 1. 모든 버킷 목록 조회
    const { data: buckets, error: bucketsError } =
      await supabase.storage.listBuckets();

    if (bucketsError) {
      console.error("❌ 버킷 목록 조회 실패:", bucketsError);
      return;
    }

    console.log("📁 사용 가능한 버킷들:");
    buckets.forEach((bucket) => {
      console.log(
        `  - ${bucket.name} (${bucket.public ? "Public" : "Private"})`
      );
    });

    // 2. wedding-gallery 버킷 확인
    const targetBucket = "wedding-gallery";
    const bucket = buckets.find((b) => b.name === targetBucket);

    if (!bucket) {
      console.error(`❌ '${targetBucket}' 버킷을 찾을 수 없습니다!`);
      return;
    }

    console.log(`\n✅ '${targetBucket}' 버킷 발견!`);
    console.log(`   상태: ${bucket.public ? "Public ✅" : "Private ❌"}`);

    // 3. 버킷 내 파일 목록 조회
    const { data: files, error: filesError } = await supabase.storage
      .from(targetBucket)
      .list("", {
        limit: 100,
        offset: 0,
      });

    if (filesError) {
      console.error("❌ 파일 목록 조회 실패:", filesError);
      return;
    }

    console.log(`\n📄 버킷 내 파일들 (${files.length}개):`);
    if (files.length === 0) {
      console.log("   (파일이 없습니다)");
    } else {
      files.forEach((file, index) => {
        const isImage = ["jpg", "jpeg", "png", "webp", "gif"].includes(
          file.name.toLowerCase().split(".").pop()
        );
        console.log(
          `   ${index + 1}. ${file.name} ${isImage ? "🖼️" : "📄"} (${
            file.metadata?.size || "?"
          } bytes)`
        );
      });
    }

    // 4. 이미지 파일만 필터링
    const imageFiles = files.filter((file) => {
      const ext = file.name.toLowerCase().split(".").pop();
      return ["jpg", "jpeg", "png", "webp", "gif"].includes(ext);
    });

    console.log(`\n🖼️ 이미지 파일들 (${imageFiles.length}개):`);
    if (imageFiles.length === 0) {
      console.log("   (이미지 파일이 없습니다)");
    } else {
      imageFiles.forEach((file, index) => {
        const publicUrl = supabase.storage
          .from(targetBucket)
          .getPublicUrl(file.name).data.publicUrl;
        console.log(`   ${index + 1}. ${file.name}`);
        console.log(`      URL: ${publicUrl}`);
      });
    }
  } catch (error) {
    console.error("❌ 예외 발생:", error);
  }
}

debugStorage();
