# 카카오톡 공유하기 기능 설정 가이드

## 1. 카카오 개발자 계정 생성 및 앱 등록

### 1.1 카카오 개발자 사이트 접속

- https://developers.kakao.com/ 접속
- 카카오 계정으로 로그인

### 1.2 애플리케이션 추가

1. **내 애플리케이션** 메뉴 클릭
2. **애플리케이션 추가하기** 버튼 클릭
3. 앱 이름 입력 (예: "웨딩 초대장")
4. 사업자명 입력
5. **저장** 클릭

### 1.3 앱 키 확인

- 생성된 앱을 클릭
- **앱 키** 탭에서 **JavaScript 키** 복사

## 2. 플랫폼 설정

### 2.1 웹 플랫폼 추가

1. **앱 설정** > **플랫폼** 메뉴 클릭
2. **Web 플랫폼 등록** 클릭
3. 사이트 도메인 입력:
   ```
   https://wedding-invitation-roan-omega.vercel.app
   ```
4. **저장** 클릭

### 2.2 개발 환경에서 테스트하기

개발 서버(localhost)에서도 테스트하려면 추가로 등록:

```
http://localhost:3000
```

## 3. 환경 변수 설정

### 3.1 환경 변수 파일 생성

프로젝트 루트에 `.env.local` 파일 생성:

```bash
# .env.local
NEXT_PUBLIC_KAKAO_JS_KEY=복사한_JavaScript_키
```

### 3.2 코드 수정

`src/components/sections/FooterSection.tsx` 파일에서:

기존 코드:

```typescript
window.Kakao.init("YOUR_KAKAO_JAVASCRIPT_KEY");
```

수정 후:

```typescript
window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
```

## 4. 공유 이미지 설정

카카오톡 공유 시 표시될 이미지를 설정하세요:

1. **공개된 이미지 URL** 사용 (HTTPS 필수)
2. 현재 설정된 이미지:
   ```
   https://wedding-invitation-roan-omega.vercel.app/cover.jpg
   ```
3. 이미지 권장 사양:
   - 크기: 800x400px 이상
   - 비율: 2:1 또는 1:1
   - 형식: JPG, PNG
   - 용량: 500KB 이하

## 5. 배포 후 확인사항

### 5.1 Vercel 환경 변수 설정

1. Vercel 대시보드 접속
2. 프로젝트 선택
3. **Settings** > **Environment Variables** 메뉴
4. 환경 변수 추가:
   - Name: `NEXT_PUBLIC_KAKAO_JS_KEY`
   - Value: 복사한 JavaScript 키
5. **Save** 클릭
6. 재배포 (Deployments 탭에서 Redeploy)

### 5.2 도메인 확인

Vercel 배포 후 실제 도메인이 변경되었다면:

1. 카카오 개발자 사이트에서 플랫폼 도메인 업데이트
2. `FooterSection.tsx` 파일에서 모든 URL 업데이트

## 6. 테스트

### 6.1 로컬 테스트

```bash
npm run dev
# 또는
pnpm dev
```

브라우저에서 http://localhost:3000 접속 후:

1. 페이지 하단으로 스크롤
2. "카카오톡으로 초대장 보내기" 버튼 클릭
3. 카카오톡 공유 팝업 확인

### 6.2 모바일 테스트

1. 모바일 기기에서 사이트 접속
2. 공유 버튼 클릭
3. 카카오톡 앱 실행 확인

## 7. 문제 해결

### 7.1 "Kakao is not defined" 오류

- SDK 로드 확인: 브라우저 개발자 도구 > Network 탭에서 kakao SDK 로드 확인
- 스크립트 로드 시간이 필요할 수 있으므로 페이지 로드 후 잠시 대기

### 7.2 "Invalid App Key" 오류

- `.env.local` 파일의 키 값 확인
- 환경 변수명이 `NEXT_PUBLIC_KAKAO_JS_KEY`인지 확인
- 개발 서버 재시작

### 7.3 이미지가 표시되지 않음

- 이미지 URL이 HTTPS인지 확인
- 이미지가 실제로 접근 가능한지 브라우저에서 URL 직접 확인
- 이미지 캐시 문제일 수 있으므로 시간이 지나면 해결될 수 있음

### 7.4 도메인 오류

- 카카오 개발자 사이트 > 플랫폼 설정에서 도메인이 정확히 등록되었는지 확인
- 프로토콜(http/https) 확인
- 포트 번호는 포함하지 않음 (localhost:3000은 http://localhost로 등록)

## 8. 추가 기능

### 8.1 커스텀 메시지 템플릿

카카오 개발자 사이트에서 메시지 템플릿을 만들어 더 풍부한 공유 경험 제공 가능

### 8.2 공유 통계

카카오 개발자 사이트에서 공유 통계 확인 가능

## 참고 자료

- [카카오 JavaScript SDK 공식 문서](https://developers.kakao.com/docs/latest/ko/javascript/getting-started)
- [카카오톡 공유하기 가이드](https://developers.kakao.com/docs/latest/ko/message/js-link)
