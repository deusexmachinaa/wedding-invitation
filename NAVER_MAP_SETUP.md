# 네이버 지도 API 설정 가이드

이 프로젝트는 네이버 지도 API를 사용하여 웨딩홀 위치를 표시합니다.

## ⚠️ 중요 공지

**AI NAVER API의 Maps 서비스는 종료 예정입니다.**  
반드시 **새로운 NCP Maps** 서비스에서 클라이언트 ID를 발급받아야 합니다.

- 공지사항: https://www.ncloud.com/support/notice/all/1930
- 가이드: https://navermaps.github.io/maps.js.ncp/docs/tutorial-2-Getting-Started.html

## 1. 네이버 클라우드 플랫폼 가입

1. [네이버 클라우드 플랫폼](https://www.ncloud.com/)에 접속합니다
2. 회원가입 또는 로그인합니다
3. 결제 수단 등록 (무료 사용량 내에서는 과금되지 않습니다)

## 2. NCP Maps 서비스 신청

1. [네이버 클라우드 플랫폼 Console](https://console.ncloud.com/)에 로그인
2. 상단 검색창에서 **"Maps"** 검색
3. **Maps** 선택 후 **이용 신청하기** 클릭
4. 이용약관 동의 후 진행

## 3. Application 등록 (중요!)

### 구버전 (AI·NAVER API) ❌ 사용 금지

~~AI·NAVER API > Application~~ → **이 서비스는 종료됩니다!**

### 신버전 (NCP Maps) ✅ 사용 필수

1. Console 홈에서 **Services** > **Maps** 선택
2. **Application** 탭으로 이동
3. **애플리케이션 등록** 버튼 클릭
4. Application 정보 입력:
   - **Application 이름**: 원하는 이름 (예: wedding-invitation)
   - **Service 선택**: `Web Dynamic Map` 체크
   - **Web 서비스 URL** (매우 중요!):
     - 개발: `http://localhost:3000` (포트 번호까지 정확히!)
     - 배포: 실제 배포될 도메인 (예: `https://yourdomain.com`)
     - 💡 **여러 URL 등록 가능** (줄바꿈으로 구분)

## 4. Client ID 확인

1. 등록한 Application을 클릭
2. **인증 정보** 탭에서 **Client ID** 확인
3. 이 Client ID를 복사합니다

## 5. 환경 변수 설정

1. 프로젝트 루트에 `.env.local` 파일 생성
2. 다음 내용 추가:

```env
NEXT_PUBLIC_NAVER_MAP_CLIENT_ID=발급받은_클라이언트_ID
```

3. `.env.local.example` 파일을 참고하여 다른 환경 변수도 설정

## 📋 설정 체크리스트

네이버 지도가 표시되지 않는다면 다음을 확인하세요:

- [ ] **NCP Maps** 서비스 이용 신청 완료 (AI·NAVER API ❌)
- [ ] NCP 결제 수단 등록 완료
- [ ] Application 등록 시 `Web Dynamic Map` 선택
- [ ] 웹 서비스 URL에 `http://localhost:3000` 정확히 등록
- [ ] 추가로 `http://localhost:3000/`와 `http://127.0.0.1:3000`도 등록
- [ ] `.env.local` 파일에 Client ID 정확히 복사
- [ ] 개발 서버 완전히 재시작 (`Ctrl+C` 후 `pnpm dev`)
- [ ] 브라우저 개발자 도구(F12) > Console에서 오류 확인

## 6. 개발 서버 재시작

```bash
pnpm dev
```

## 주의사항

- `.env.local` 파일은 Git에 커밋하지 마세요 (이미 .gitignore에 포함되어 있음)
- Client ID는 공개되어도 되지만, Client Secret은 절대 공개하지 마세요
- 배포 시에는 배포 플랫폼의 환경 변수 설정에 동일하게 추가해야 합니다

## 배포 시 환경 변수 설정

### Vercel

1. Vercel 프로젝트 설정 > Environment Variables
2. `NEXT_PUBLIC_NAVER_MAP_CLIENT_ID` 추가

### Netlify

1. Site settings > Build & deploy > Environment
2. `NEXT_PUBLIC_NAVER_MAP_CLIENT_ID` 추가

## 무료 사용량

네이버 Maps API는 월 100,000건까지 무료로 사용 가능합니다.
웨딩 청첩장처럼 소규모 프로젝트에는 충분한 양입니다.

## 문제 해결

### 지도가 표시되지 않는 경우

1. 브라우저 개발자 도구(F12) > Console 탭에서 오류 확인
2. Client ID가 올바르게 설정되었는지 확인
3. Web 서비스 URL이 올바르게 등록되었는지 확인
4. 개발 서버를 재시작했는지 확인

### "Authentication Failed" 또는 "InvalidCredentials" 오류

**가장 흔한 원인:**

1. **웹 서비스 URL 미등록 또는 불일치**

   - 반드시 `http://localhost:3000` 정확히 등록
   - `http://localhost:3000/` (슬래시 포함) 또는 `http://localhost:3000` (슬래시 없음) 모두 등록 권장
   - `http://127.0.0.1:3000`도 함께 등록 (브라우저마다 다르게 접속)

2. **구버전 AI·NAVER API 사용**

   - AI·NAVER API에서 발급한 Client ID는 사용 불가
   - 반드시 **새로운 NCP Maps** 서비스에서 재발급

3. **결제 수단 미등록**
   - NCP Maps는 결제 수단 등록 필수 (무료 사용량 내에서는 과금 없음)

**해결 방법:**

1. NCP Console > Maps > Application에서 URL 재확인
2. 새로운 Client ID로 `.env.local` 업데이트
3. 개발 서버 완전히 재시작 (`Ctrl+C` 후 `pnpm dev`)
4. 브라우저 캐시 삭제 (Ctrl+Shift+R)

## 참고 자료

- [네이버 Maps API 가이드](https://guide.ncloud-docs.com/docs/maps-overview)
- [네이버 Maps API 레퍼런스](https://navermaps.github.io/maps.js.ncp/docs/)
