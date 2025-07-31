# 웨딩 배경음악 설정 가이드

## 🎵 배경음악 파일 추가하기

이 폴더에 웨딩 배경음악 파일을 추가하세요.

### 지원하는 오디오 형식

- **MP3** (권장) - 가장 널리 지원되는 형식
- **WAV** - 고품질이지만 파일 크기가 큼
- **OGG** - 좋은 압축률과 품질
- **AAC** - 모바일에서 최적화됨

### 권장 설정

- **비트레이트**: 128-192 kbps (웹용으로 적절)
- **길이**: 3-5분 (반복 재생됨)
- **파일 크기**: 5MB 이하 권장

### 파일 추가 방법

1. 원하는 웨딩 배경음악 파일을 이 폴더(`public/audio/`)에 복사
2. 파일명을 `wedding-song.mp3`로 변경하거나
3. `src/data/sampleData.ts`에서 `backgroundMusic.url` 경로를 수정

### 예시

```javascript
// src/data/sampleData.ts
backgroundMusic: {
  url: "/audio/your-wedding-song.mp3",  // 여기서 파일명 변경
  title: "너와 나의 웨딩송",
  autoPlay: false, // 자동재생 여부 (권장: false)
},
```

### 🎼 추천 웨딩 배경음악

- **클래식**: 캐논 변주곡, 웨딩 마치
- **재즈**: The Way You Look Tonight, At Last
- **현대곡**: A Thousand Years, Perfect
- **한국곡**: 그대라는 시, 사랑한다는 말

---

💝 **완벽한 웨딩 청첩장을 위해 좋은 음악을 선택하세요!**
