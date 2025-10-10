# 💒 웨딩 초대장 프로젝트

Next.js로 제작된 모던 웨딩 초대장 웹사이트입니다.

## ✨ 주요 기능

- 📱 반응형 디자인 (모바일 최적화)
- 🎵 배경음악 재생
- 📷 갤러리 (Supabase Storage)
- 📝 방명록
- 🗺️ 지도 및 네비게이션 연동
- 💬 **카카오톡 초대장 공유**
- 📤 웹 공유 API 지원
- 📋 계좌번호 복사
- ⏰ 디데이 카운트다운

## 🚀 시작하기

### 1. 의존성 설치

```bash
pnpm install
```

### 2. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
# Kakao JavaScript Key
NEXT_PUBLIC_KAKAO_JS_KEY=your_kakao_javascript_key

# Supabase (옵셔널)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**카카오톡 공유 기능 설정 방법:**
자세한 설정 방법은 [KAKAO_SHARE_SETUP.md](./KAKAO_SHARE_SETUP.md) 문서를 참고하세요.

### 3. 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인하세요.

## 📝 데이터 수정

`src/data/sampleData.ts` 파일에서 결혼식 정보를 수정할 수 있습니다:

- 신랑/신부 정보
- 예식 일시 및 장소
- 연락처
- 계좌번호
- 초대 메시지
- 배경음악

## 🎨 커스터마이징

### 색상 테마

`src/data/sampleData.ts` 파일의 `weddingColors` 객체에서 색상을 변경할 수 있습니다.

### 폰트

`src/app/layout.tsx` 파일에서 Google Fonts를 사용하여 폰트를 변경할 수 있습니다.

### 섹션 순서

`src/components/WeddingInvitation.tsx` 파일에서 섹션 순서를 변경할 수 있습니다.

## 📚 추가 가이드

- [KAKAO_SHARE_SETUP.md](./KAKAO_SHARE_SETUP.md) - 카카오톡 공유 설정 가이드
- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Supabase 데이터베이스 설정
- [SUPABASE_STORAGE_SETUP.md](./SUPABASE_STORAGE_SETUP.md) - Supabase Storage 설정
- [GALLERY_SETUP_GUIDE.md](./GALLERY_SETUP_GUIDE.md) - 갤러리 관리 가이드

## 🌐 배포

### Vercel 배포

1. [Vercel](https://vercel.com)에 프로젝트 연결
2. 환경 변수 설정 (Settings > Environment Variables)
   - `NEXT_PUBLIC_KAKAO_JS_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. 배포

### 카카오 개발자 사이트 설정

배포 후 반드시 [카카오 개발자 사이트](https://developers.kakao.com)에서:

1. 플랫폼 > Web 플랫폼에 배포된 도메인 등록
2. 예: `https://your-domain.vercel.app`

## 🛠️ 기술 스택

- **Framework:** Next.js 15.1
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** Supabase
- **Deployment:** Vercel
- **Share:** Kakao SDK, Web Share API

## 📄 라이선스

Copyright© 2025. All rights reserved.

## 🤝 문의

프로젝트 관련 문의사항이 있으시면 이슈를 등록해주세요.
