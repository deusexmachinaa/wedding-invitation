# Supabase 방명록 설정 가이드

이 프로젝트는 Supabase를 사용하여 실시간 방명록 기능을 구현합니다.

## 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com) 웹사이트 방문
2. 회원가입 또는 로그인
3. "New Project" 클릭
4. 프로젝트 이름, 데이터베이스 비밀번호, 지역(Korea/Tokyo 추천) 선택
5. 프로젝트 생성 완료 대기 (약 2분 소요)

## 2. 데이터베이스 테이블 생성

1. Supabase 대시보드에서 좌측 메뉴의 **SQL Editor** 클릭
2. `supabase-schema.sql` 파일의 내용을 복사하여 붙여넣기
3. "Run" 버튼 클릭하여 SQL 실행
4. 테이블이 성공적으로 생성되었는지 확인

## 3. 환경 변수 설정

1. Supabase 대시보드에서 **Settings > API** 메뉴로 이동
2. 다음 정보를 복사:

   - **Project URL** (예: `https://xxxxx.supabase.co`)
   - **anon/public key** (긴 문자열)

3. 프로젝트 루트에 `.env` 파일 생성:

```env
NEXT_PUBLIC_SUPABASE_URL=여기에_Project_URL_붙여넣기
NEXT_PUBLIC_SUPABASE_ANON_KEY=여기에_anon_key_붙여넣기
```

⚠️ **중요**: `.env` 파일은 절대 Git에 커밋하지 마세요!

## 4. 애플리케이션 실행

```bash
pnpm install
pnpm dev
```

이제 방명록 기능이 완전히 작동합니다! 🎉

## 기능 설명

### ✨ 구현된 기능

- **실시간 업데이트**: 다른 사용자가 방명록을 작성하면 자동으로 화면에 반영
- **신랑측/신부측 구분**: 하객을 구분하여 표시
- **데이터 영구 저장**: Supabase 데이터베이스에 안전하게 저장
- **입력 검증**: 메시지 500자, 이름 20자 제한
- **날짜/시간 표시**: 작성 시간 자동 기록
- **보안**: Row Level Security(RLS) 정책 적용
- **비밀번호 보호 삭제**: 작성 시 입력한 비밀번호로만 삭제 가능 (SHA-256 해시)

### 🔒 보안 설정

- 누구나 방명록을 읽고 작성할 수 있습니다
- 작성 시 입력한 비밀번호로만 삭제 가능
- 비밀번호는 SHA-256으로 해시되어 안전하게 저장
- **소프트 삭제**: 실제 데이터는 삭제되지 않고 `is_deleted` 플래그로 관리
- 삭제된 방명록은 화면에 표시되지 않지만 데이터베이스에는 보존됨
- 직접 수정은 불가능합니다 (삭제 후 재작성 필요)
- 스팸 방지를 위해 추가 Edge Function 구현 가능

## 문제 해결

### "Missing Supabase environment variables" 오류

- `.env.local` 파일이 프로젝트 루트에 있는지 확인
- 환경 변수 이름이 정확한지 확인
- 개발 서버를 재시작 (`pnpm dev`)

### 방명록이 로드되지 않음

- Supabase 프로젝트가 활성화되어 있는지 확인
- SQL 스크립트가 정상적으로 실행되었는지 확인
- 브라우저 콘솔에서 에러 메시지 확인

### 실시간 업데이트가 작동하지 않음

- Supabase 대시보드에서 **Database > Replication** 메뉴로 이동
- `guestbook` 테이블의 Realtime이 활성화되어 있는지 확인

## 배포 시 주의사항

Vercel, Netlify 등에 배포할 때:

1. 환경 변수를 플랫폼 설정에 추가
2. `NEXT_PUBLIC_` 접두사가 있는 변수는 클라이언트에 노출됨
3. Supabase URL과 anon key는 공개되어도 안전함 (RLS로 보호됨)

## 추가 개선 사항 (선택)

- [ ] 스팸 방지를 위한 Rate Limiting 추가
- [ ] 관리자 페이지 (방명록 관리/삭제)
- [ ] 이미지 업로드 기능
- [ ] 이메일 알림 (새 방명록 작성 시)
- [ ] 방명록 검색 및 필터링
