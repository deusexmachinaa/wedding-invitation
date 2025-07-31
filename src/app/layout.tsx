import type { Metadata } from "next";
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
  openGraph: {
    title: "이태훈 ♥ 정혜원 결혼합니다",
    description: "2025년 12월 21일 토요일 오후 4시 20분",
    type: "website",
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
        {children}
      </body>
    </html>
  );
}
