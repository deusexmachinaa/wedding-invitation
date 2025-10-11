import { WeddingData } from "@/types";

export const sampleWeddingData: WeddingData = {
  groom: {
    name: "이태훈",
    father: "이재교",
    mother: "김귀남",
    phone: "010-9305-2888",
    fatherPhone: "010-5294-4221",
    motherPhone: "010-9359-4221",
  },
  bride: {
    name: "정혜원",
    father: "정한목",
    mother: "한해숙",
    phone: "010-8504-0507",
    fatherPhone: "010-2503-3344",
    motherPhone: "010-4458-7899",
  },
  ceremony: {
    date: "2025-12-20",
    time: "오후 4시 20분",
    venue: "퀸벨호텔",
    address: "대구광역시 동구 동촌로 200",
    phone: "053-282-1000",
    floor: "9F",
    hall: "퀸즈가든홀",
  },
  invitationMessage: `평생 서로 귀하게 여기며
첫 마음 그대로 존중하고
배려하며 살겠습니다.

오로지 믿음과 사랑을 약속하는 날
오셔서 축복해 주시면 더없는 기쁨으로
간직하겠습니다.`,
  gallery: [
    {
      id: "1",
      // 옵션 1: public 폴더 사용 (기본)
      url: "/images/gallery/photo1.jpg",
      // 옵션 2: Supabase Storage 사용 (아래 주석 해제하고 프로젝트 URL 변경)
      // url: "https://{프로젝트ID}.supabase.co/storage/v1/object/public/wedding-gallery/photo1.jpg",
      alt: "웨딩 사진 1",
    },
    {
      id: "2",
      url: "/images/gallery/photo2.jpg",
      // url: "https://{프로젝트ID}.supabase.co/storage/v1/object/public/wedding-gallery/photo2.jpg",
      alt: "웨딩 사진 2",
    },
    {
      id: "3",
      url: "/images/gallery/photo3.jpg",
      // url: "https://{프로젝트ID}.supabase.co/storage/v1/object/public/wedding-gallery/photo3.jpg",
      alt: "웨딩 사진 3",
    },
    {
      id: "4",
      url: "/images/gallery/photo4.jpg",
      // url: "https://{프로젝트ID}.supabase.co/storage/v1/object/public/wedding-gallery/photo4.jpg",
      alt: "웨딩 사진 4",
    },
  ],
  backgroundMusic: {
    songs: [
      {
        id: "1",
        url: "/audio/wedding-song.mp3",
        title: "Popcorn",
        artist: "D.O",
      },
      {
        id: "2",
        url: "/audio/wedding-song1.mp3", // 실제 파일 사용
        title: "Vivid La La Love",
        artist: "Lee Chan-hyuk",
      },
      {
        id: "3",
        url: "/audio/wedding-song2.mp3", // 실제 파일 사용
        title: "Love Wins All",
        artist: "D.O / IU",
      },
    ],
    autoPlay: true,
    currentSongIndex: 0,
  },
  groomAccounts: [
    {
      bank: "농협",
      accountNumber: "352-0794-0534-53",
      accountHolder: "이태훈",
    },
    {
      bank: "iM뱅크",
      accountNumber: "010-52-944221",
      accountHolder: "이재교",
    },
    {
      bank: "우리은행",
      accountNumber: "150041-56-012475",
      accountHolder: "김귀남",
    },
  ],
  brideAccounts: [
    {
      bank: "국민은행",
      accountNumber: "699601-04-219869",
      accountHolder: "정혜원",
    },
    {
      bank: "국민은행",
      accountNumber: "805501-01-058499",
      accountHolder: "정한목",
    },
    {
      bank: "국민은행",
      accountNumber: "864401-01-429762",
      accountHolder: "한해숙",
    },
  ],
  specialNotices: [
    "포토부스가 설치될 예정입니다.",
    "귀한 발걸음 해주신 여러분의 환한 미소와 따뜻한 말씀 남겨주시면 소중히 간직하도록 하겠습니다.",
  ],
  weddingColors: {
    primary: "#8B5A5A",
    secondary: "#F5F5DC",
    accent: "#CD853F",
  },
  photoBoothExamples: [
    {
      id: "1",
      style: "자유롭게",
      emoji: "📸",
      description: "원하는 포즈로 촬영하세요",
      imageUrl: "/images/photobooth/style1.jpg",
    },
    {
      id: "2",
      style: "함께",
      emoji: "💕",
      description: "동반자와 함께 찍어보세요",
      imageUrl: "/images/photobooth/style2.jpg",
    },
    {
      id: "3",
      style: "재미있게",
      emoji: "🎭",
      description: "소품을 활용해보세요",
      imageUrl: "/images/photobooth/style3.jpg",
    },
    {
      id: "4",
      style: "자연스럽게",
      emoji: "✨",
      description: "진솔한 미소를 보여주세요",
      imageUrl: "/images/photobooth/style4.jpg",
    },
  ],
};
