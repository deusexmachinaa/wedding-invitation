// 청첩장 관련 타입 정의

export interface PersonInfo {
  name: string;
  father: string;
  mother: string;
  phone?: string;
  fatherPhone?: string;
  motherPhone?: string;
}

export interface CeremonyInfo {
  date: string; // ISO 형식 날짜
  time: string; // "13:30" 형식
  venue: string;
  address: string;
  phone: string;
  floor?: string;
  hall?: string;
}

export interface Image {
  id: string;
  url: string;
  alt: string;
}

export interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  createdAt: string;
  isGroom: boolean; // 신랑측/신부측 구분
}

export interface AccountInfo {
  bank: string;
  accountNumber: string;
  accountHolder: string;
  enableKakaoPay?: boolean; // 카카오페이 송금 버튼 표시 여부
  enableToss?: boolean; // 토스 송금 버튼 표시 여부
}

export interface InterviewQA {
  question: string;
  answer: string;
  answeredBy?: "groom" | "bride" | "both";
}

export interface RSVPInfo {
  name: string;
  phone: string;
  isGroom: boolean; // 신랑측/신부측
  attendanceCount: number;
  mealRequired: boolean;
  message?: string;
  companions?: string[];
}

export interface BackgroundMusic {
  songs: {
    id: string;
    url: string;
    title: string;
    artist: string;
  }[];
  autoPlay: boolean;
  currentSongIndex?: number;
}

export interface PhotoBoothExample {
  id: string;
  style: string;
  emoji: string;
  description: string;
  imageUrl: string;
}

export interface WeddingData {
  // 기본 정보
  groom: PersonInfo;
  bride: PersonInfo;
  ceremony: CeremonyInfo;

  // 콘텐츠
  invitationMessage: string;
  gallery: Image[];
  // interview: InterviewQA[];

  // 기능
  backgroundMusic?: BackgroundMusic;

  // 계좌 정보
  groomAccounts: AccountInfo[];
  brideAccounts: AccountInfo[];

  // 추가 정보
  specialNotices?: string[];
  weddingColors?: {
    primary: string;
    secondary: string;
    accent: string;
  };
  photoBoothExamples?: PhotoBoothExample[];
}

// 컴포넌트 Props 타입들
export interface SectionProps {
  className?: string;
  children?: React.ReactNode;
}

export interface AnimatedSectionProps extends SectionProps {
  delay?: number;
  duration?: number;
}
