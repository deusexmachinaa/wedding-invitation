import type { Metadata } from "next";
import Script from "next/script";
import {
  Noto_Sans_KR,
  Noto_Serif_KR,
  Inter,
  Jua,
  Gowun_Dodum,
} from "next/font/google";
import "./globals.css";

const notoSans = Noto_Sans_KR({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const notoSerif = Noto_Serif_KR({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const jua = Jua({
  variable: "--font-jua",
  subsets: ["latin"],
  weight: ["400"],
});

const gowunDodum = Gowun_Dodum({
  variable: "--font-gowun-dodum",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "이태훈 ♥ 정혜원 결혼합니다",
  description: "2025년 12월 21알 토요일 오후 4시 20분 퀸벨호텔 9F 퀸즈가든홀",
  keywords: ["결혼식", "청첩장", "이태훈", "정혜원", "웨딩"],
  authors: [{ name: "Wedding Invitation" }],
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "이태훈 ♥ 정혜원 결혼합니다",
    description:
      "2025년 12월 21일 토요일 오후 4시 20분 대구광역시 동구 동촌로 200 퀸벨호텔 9F 퀸즈가든홀",
    type: "website",
    images: [
      {
        url: "/cover.jpg",
        width: 1200,
        height: 630,
        alt: "이태훈 ♥ 정혜원 결혼식 초대",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "이태훈 ♥ 정혜원 결혼합니다",
    description:
      "2025년 12월 21일 토요일 오후 4시 20분 대구광역시 동구 동촌로 200 퀸벨호텔 9F 퀸즈가든홀",
    images: ["/cover.jpg"],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${notoSans.variable} ${notoSerif.variable} ${inter.variable} ${jua.variable} ${gowunDodum.variable} font-sans antialiased`}
      >
        <Script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
          strategy="afterInteractive"
        />
        <Script
          type="text/javascript"
          src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}`}
          strategy="afterInteractive"
        />
        {children}
      </body>
    </html>
  );
}
