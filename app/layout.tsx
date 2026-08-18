import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GeminiUnlockModal } from "@/components/gemini/GeminiUnlockModal";

export const metadata: Metadata = {
  title: "고려대 동아리 아바타 | 나만의 캐릭터 & 맞춤 동아리 추천",
  description:
    "동아리 취향을 입력하면 나만의 호랑이 아바타를 만들고 어울리는 고려대 동아리를 추천해 드립니다! Gemini AI 심층 분석 코멘트까지 확인해보세요.",
  keywords: [
    "고려대 동아리",
    "고려대학교",
    "동아리 아바타",
    "고대 동아리 추천",
    "Gemini AI",
    "안암골 호랑이",
    "klub.kr",
  ],
  openGraph: {
    title: "고려대 동아리 아바타 | 내 동아리 자아 찾기 🐯",
    description: "동아리 취향 입력하고 나만의 호랑이 아바타와 맞춤 동아리 추천받기!",
    url: "https://ku-avatar.vercel.app",
    siteName: "고려대 동아리 아바타",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin=""
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body className="min-h-screen flex flex-col justify-between font-sans">
        <AuthProvider>
          <Header />
          <main className="flex-1 w-full">{children}</main>
          <Footer />
          <GeminiUnlockModal />
        </AuthProvider>
      </body>
    </html>
  );
}
