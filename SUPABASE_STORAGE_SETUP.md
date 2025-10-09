# Supabase Storage 갤러리 이미지 관리 가이드

## 1. Supabase Storage 버킷 생성

1. [Supabase 대시보드](https://supabase.com) 접속
2. 프로젝트 선택
3. 좌측 메뉴에서 **Storage** 클릭
4. **Create a new bucket** 클릭
5. 버킷 설정:
   - **Name**: `wedding-gallery`
   - **Public bucket**: ✅ 체크 (공개 접근 허용)
   - **File size limit**: 5MB (선택사항)
   - **Allowed MIME types**: `image/*` (선택사항)
6. **Create bucket** 클릭

## 2. 이미지 업로드

### 방법 1: 대시보드에서 직접 업로드 (간단함)

1. Storage > `wedding-gallery` 버킷 클릭
2. **Upload File** 버튼 클릭
3. 웨딩 사진들을 선택하여 업로드
4. 파일명 예시:
   - `photo1.jpg`
   - `photo2.jpg`
   - `photo3.jpg`
   - `photo4.jpg`

### 방법 2: 코드로 업로드 (자동화)

나중에 관리자 페이지를 만들어 웹에서 직접 업로드할 수 있습니다.

## 3. 이미지 URL 가져오기

업로드된 이미지의 공개 URL 형식:

```
https://{프로젝트ID}.supabase.co/storage/v1/object/public/wedding-gallery/photo1.jpg
```

또는 Supabase 클라이언트로 가져오기:

```typescript
const { data } = supabase.storage
  .from("wedding-gallery")
  .getPublicUrl("photo1.jpg");

console.log(data.publicUrl);
```

## 4. 데이터베이스에 이미지 정보 저장 (선택사항)

이미지 메타데이터를 DB에 저장하면 순서 변경, 설명 추가 등이 가능합니다.

```sql
-- SQL Editor에서 실행
CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  alt TEXT,
  display_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS 활성화
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- 누구나 읽기 가능
CREATE POLICY "Anyone can read gallery images"
  ON gallery_images
  FOR SELECT
  TO public
  USING (true);

-- 인덱스 생성
CREATE INDEX idx_gallery_display_order ON gallery_images(display_order);
```

## 5. 장점

### Supabase Storage 사용 시:

- 🚀 **빠른 로딩**: CDN을 통한 전 세계 배포
- 💰 **무료 시작**: 1GB 무료 (사진 200~300장 가능)
- 🔒 **보안**: 공개/비공개 설정 가능
- 📊 **관리 편의**: 웹 대시보드에서 쉽게 관리
- 🖼️ **이미지 변환**: URL 파라미터로 리사이징 가능
- 📈 **확장성**: 트래픽 증가해도 문제없음

### 기존 public 폴더 대비:

- ❌ public: 빌드 시 포함되어 배포 크기 증가
- ❌ public: 이미지 변경 시 재배포 필요
- ✅ Storage: 언제든지 이미지 추가/삭제 가능
- ✅ Storage: 빌드 크기와 무관

## 6. 비용

- **무료 플랜**: 1GB 저장공간, 2GB 대역폭/월
- **Pro 플랜**: $25/월 - 100GB 저장공간, 200GB 대역폭
- 웨딩 청첩장은 무료 플랜으로 충분합니다!

## 7. 이미지 최적화 팁

1. **WebP 형식 사용**: 파일 크기 30% 감소
2. **적절한 해상도**: 1920x1440 이하 권장
3. **압축**: TinyPNG 등으로 압축 후 업로드
4. **Lazy Loading**: 코드에서 자동 구현됨

## 8. 문제 해결

### 이미지가 로드되지 않을 때

- 버킷이 **Public**으로 설정되었는지 확인
- URL이 올바른지 확인
- 브라우저 콘솔에서 404 에러 확인

### CORS 에러

- Supabase Storage는 자동으로 CORS 설정됨
- 문제 발생 시 Supabase 지원팀에 문의
