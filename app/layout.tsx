import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Footer } from "@/components/layout/Footer";
import { GeminiUnlockModal } from "@/components/gemini/GeminiUnlockModal";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://ku-tiger-avatar.netlify.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "고려대 동아리 아바타 | 나만의 캐릭터 & 맞춤 동아리 추천",
  description:
    "동아리 취향을 입력하면 나만의 3D 호랑이 아바타를 만들고 어울리는 고려대 동아리를 추천해 드립니다! 🐯",
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
    description: "취향 몇 개만 고르면 나만의 3D 호랑이 키링과 2학기 추천 동아리를 찾아드려요!",
    url: siteUrl,
    siteName: "고려대 동아리 아바타",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: `${siteUrl}/api/og`,
        width: 1200,
        height: 630,
        alt: "고려대학교 동아리 아바타",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "고려대 동아리 아바타 | 내 동아리 자아 찾기 🐯",
    description: "취향 몇 개만 고르면 나만의 3D 호랑이 키링과 2학기 추천 동아리를 찾아드려요!",
    images: [`${siteUrl}/api/og`],
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
          <main className="flex-1 w-full">{children}</main>
          <Footer />
          <GeminiUnlockModal />
        </AuthProvider>
      </body>
    </html>
  );
}
