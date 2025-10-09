# 🖼️ 갤러리 이미지 관리 완벽 가이드

사진을 데이터베이스(Supabase)나 클라우드 스토리지로 관리하는 방법을 안내합니다.

---

## 📊 방법 비교

| 방법                 | 장점                 | 단점                   | 추천 대상         |
| -------------------- | -------------------- | ---------------------- | ----------------- |
| **public 폴더**      | 설정 간단, 빠른 구현 | 재배포 필요, 용량 증가 | 소규모, 빠른 배포 |
| **Supabase Storage** | 동적 관리, CDN 지원  | 초기 설정 필요         | 장기 운영, 유연성 |

---

## 🚀 방법 1: Supabase Storage 사용 (추천)

### 1단계: Supabase 버킷 생성

1. [Supabase 대시보드](https://supabase.com) 접속
2. 프로젝트 선택
3. 좌측 **Storage** 메뉴 클릭
4. **Create a new bucket** 클릭
5. 버킷 설정:
   ```
   Name: wedding-gallery
   Public bucket: ✅ (체크)
   File size limit: 5MB
   Allowed MIME types: image/*
   ```
6. **Create bucket** 클릭

### 2단계: 데이터베이스 테이블 생성

1. 좌측 **SQL Editor** 클릭
2. `supabase-gallery-schema.sql` 파일 내용 복사
3. 붙여넣고 **Run** 클릭
4. "Success" 메시지 확인

### 3단계: 이미지 업로드 (2가지 방법)

#### 방법 A: 웹 관리자 페이지 사용 (추천) 👍

1. 개발 서버 실행: `pnpm dev`
2. 브라우저에서 접속: `http://localhost:3000/admin/gallery`
3. 이미지 선택, 설명 입력, 순서 지정
4. **업로드** 버튼 클릭
5. 메인 페이지에서 확인

#### 방법 B: Supabase 대시보드에서 직접 업로드

1. **Storage > wedding-gallery** 클릭
2. **Upload file** 버튼 클릭
3. 이미지 파일 선택 (photo1.jpg, photo2.jpg 등)
4. 업로드 완료
5. **SQL Editor**에서 메타데이터 추가:
   ```sql
   INSERT INTO gallery_images (storage_path, alt, display_order) VALUES
   ('photo1.jpg', '웨딩 사진 1', 1),
   ('photo2.jpg', '웨딩 사진 2', 2);
   ```

### 4단계: 확인

1. 메인 페이지 접속: `http://localhost:3000`
2. 갤러리 섹션 스크롤
3. 업로드한 이미지 확인 ✅

---

## 📁 방법 2: public 폴더 사용 (간단)

### 1단계: 폴더 구조 만들기

```
wedding-invitation/
  └── public/
      └── images/
          └── gallery/
              ├── photo1.jpg
              ├── photo2.jpg
              ├── photo3.jpg
              └── photo4.jpg
```

### 2단계: 이미지 파일 추가

- 웨딩 사진 4장을 `public/images/gallery/` 폴더에 넣으세요
- 파일명: `photo1.jpg`, `photo2.jpg`, `photo3.jpg`, `photo4.jpg`

### 3단계: 완료!

- 코드는 이미 설정되어 있습니다
- 개발 서버 재시작 후 확인

---

## 🎨 이미지 최적화 팁

### 권장 사양

- **해상도**: 1920x1440 이하 (4:3 비율)
- **포맷**: WebP > JPG > PNG
- **파일 크기**: 1MB 이하 권장

### 압축 도구

1. **온라인**: [TinyPNG](https://tinypng.com), [Squoosh](https://squoosh.app)
2. **CLI**: `npm install -g imagemin-cli`

---

## 🔧 고급 기능

### 이미지 개수 변경

#### Supabase Storage 사용 시:

- 관리자 페이지에서 추가 업로드만 하면 자동 반영

#### public 폴더 사용 시:

`src/data/sampleData.ts` 수정:

```typescript
gallery: [
  { id: "1", url: "/images/gallery/photo1.jpg", alt: "웨딩 사진 1" },
  { id: "2", url: "/images/gallery/photo2.jpg", alt: "웨딩 사진 2" },
  { id: "3", url: "/images/gallery/photo3.jpg", alt: "웨딩 사진 3" },
  { id: "4", url: "/images/gallery/photo4.jpg", alt: "웨딩 사진 4" },
  { id: "5", url: "/images/gallery/photo5.jpg", alt: "웨딩 사진 5" }, // 추가
  { id: "6", url: "/images/gallery/photo6.jpg", alt: "웨딩 사진 6" }, // 추가
];
```

### 이미지 순서 변경

#### Supabase Storage 사용 시:

**SQL Editor**에서 실행:

```sql
UPDATE gallery_images
SET display_order = 1
WHERE storage_path = 'photo3.jpg';

UPDATE gallery_images
SET display_order = 3
WHERE storage_path = 'photo1.jpg';
```

#### public 폴더 사용 시:

`sampleData.ts`에서 배열 순서 변경

### 이미지 삭제 (Soft Delete)

```sql
UPDATE gallery_images
SET is_visible = false
WHERE storage_path = 'photo1.jpg';
```

---

## 💡 FAQ

### Q: Supabase Storage vs public 폴더, 어떤 걸 써야 하나요?

**Supabase Storage 추천 경우:**

- ✅ 결혼식 후에도 사진을 추가하고 싶을 때
- ✅ 대용량 사진이 많을 때 (10장 이상)
- ✅ 이미지를 자주 변경할 예정일 때

**public 폴더 추천 경우:**

- ✅ 빠르게 배포하고 싶을 때
- ✅ 사진이 적을 때 (5장 이하)
- ✅ 한 번 배포하고 끝낼 예정일 때

### Q: Supabase Storage 비용은 얼마인가요?

- **무료 플랜**: 1GB 저장공간, 2GB 대역폭/월
- 웨딩 사진 200~300장 가능 (압축 시)
- 청첩장 트래픽으로는 무료 플랜으로 충분!

### Q: 이미지가 안 보여요!

**Supabase Storage 사용 시:**

1. 버킷이 **Public**으로 설정되었는지 확인
2. `gallery_images` 테이블에 데이터가 있는지 확인
3. 브라우저 콘솔에서 에러 메시지 확인

**public 폴더 사용 시:**

1. 파일 경로가 정확한지 확인
2. 개발 서버 재시작
3. 파일명 대소문자 확인

### Q: 두 방법을 동시에 사용할 수 있나요?

네! 코드는 이미 다음과 같이 작동합니다:

1. Supabase DB에 이미지가 있으면 → DB에서 로드
2. DB가 비어있으면 → sampleData (public 폴더) 사용

---

## 📞 도움이 필요하시면

1. `.env.local` 파일 환경 변수 확인
2. Supabase 대시보드에서 프로젝트 상태 확인
3. 브라우저 개발자 도구 콘솔 확인

---

## ✅ 체크리스트

### Supabase Storage 사용 시:

- [ ] Supabase 프로젝트 생성
- [ ] `wedding-gallery` 버킷 생성 (Public)
- [ ] `supabase-gallery-schema.sql` 실행
- [ ] `.env.local` 환경 변수 설정
- [ ] `/admin/gallery`에서 이미지 업로드
- [ ] 메인 페이지에서 확인

### public 폴더 사용 시:

- [ ] `public/images/gallery/` 폴더 생성
- [ ] 이미지 파일 복사
- [ ] `sampleData.ts` 확인 (필요 시 수정)
- [ ] 개발 서버 재시작
- [ ] 메인 페이지에서 확인

---

## 🎉 완료!

이제 웨딩 사진을 자유롭게 관리할 수 있습니다!

**다음 단계:**

- 실제 웨딩 사진으로 교체
- 이미지 압축하여 최적화
- 배포 전 미리보기 확인
