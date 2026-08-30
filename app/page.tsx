"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { AvatarCanvas } from "@/components/avatar/AvatarCanvas";
import { GeminiStudentBanner } from "@/components/cta/GeminiStudentBanner";
import { generateAvatar, AvatarConfiguration } from "@/lib/avatarEngine";

// Sample avatars for live preview showcase (8 Core Archetypes)
const SAMPLE_PREVIEWS = [
  {
    categories: ["새내기"],
    interests: "새내기 과잠 본관 붉은깃발 캠퍼스투어",
    currentClub: "새내기 (탐색 중)",
    college: "고려대학교",
  },
  {
    categories: ["예술/공연"],
    interests: "무대 보컬 밴드 댄스 스포트라이트",
    college: "문과대학",
  },
  {
    categories: ["IT/개발"],
    interests: "코딩 개발 해커톤 파이썬 웹 알고리즘 AI",
    college: "정보대학",
  },
  {
    categories: ["봉사"],
    interests: "환경 텀블러 멘토링 평화 나눔",
    college: "정경대학",
  },
  {
    categories: ["학술"],
    interests: "토론 전략 스피치 슬라이드 리더십",
    college: "경영대학",
  },
  {
    categories: ["스포츠"],
    interests: "러닝 헬스 근손실 축구 농구",
    college: "사범대학",
  },
  {
    categories: ["취미/친목"],
    interests: "갓생 탐험 보드게임 여행 맛집",
    college: "자유전공학부",
  },
  {
    categories: ["미디어/방송"],
    interests: "사진 영상 필름 카메라 유튜브 콘텐츠",
    college: "미디어학부",
  },
];

export default function LandingPage() {
  const [sampleIndex, setSampleIndex] = useState(0);
  const [currentAvatar, setCurrentAvatar] = useState<AvatarConfiguration | null>(null);

  useEffect(() => {
    const avatar = generateAvatar(SAMPLE_PREVIEWS[sampleIndex]);
    setCurrentAvatar(avatar);
  }, [sampleIndex]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSampleIndex((prev) => (prev + 1) % SAMPLE_PREVIEWS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full min-h-screen overflow-hidden">
      {/* 1. Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 px-4">
        {/* Background Decorative Blur Blobs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-rose-200/40 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-10 w-72 h-72 bg-amber-200/30 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Left Text Column */}
          <div className="flex-1 text-center md:text-left space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-ku-soft border border-ku-crimson/20 text-ku-crimson text-xs font-extrabold shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-ku-crimson animate-ping" />
              <span>2026-2학기 고려대 개강 & 동아리 모집 시즌</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl xs:text-5xl sm:text-6xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.15]"
            >
              2학기 동아리,{" "}
              <span className="text-ku-crimson block sm:inline">
                어디 들어갈까?
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg md:text-xl text-slate-600 font-medium leading-relaxed max-w-lg mx-auto md:mx-0 whitespace-pre-line"
            >
              취향 몇 개만 고르면{"\n"}
              나랑 닮은 호랑이와 <strong className="text-slate-900">찰떡 동아리</strong>를 찾아드려요. 🐯
            </motion.p>

            {/* CTA Group */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 pt-3"
            >
              <Link
                href="/create"
                className="w-full sm:w-auto px-10 py-5 sm:px-12 sm:py-5.5 bg-ku-crimson hover:bg-ku-dark text-white font-black text-lg sm:text-xl rounded-3xl shadow-2xl hover:shadow-ku-crimson/40 hover:scale-[1.03] active:scale-[0.97] transition-all flex items-center justify-center gap-3 group"
              >
                <span>동아리 추천받기</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {/* Right Column: Live Avatar Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex-1 flex flex-col items-center justify-center relative"
          >
            {/* Live Interactive Avatar preview */}
            {currentAvatar && (
              <div className="relative">
                <AvatarCanvas config={currentAvatar} size={340} interactive={true} showTitle={true} />

                {/* Sample style selector dot pagination */}
                <div className="flex items-center justify-center gap-2 mt-4 bg-white/80 backdrop-blur-md px-3.5 py-2 rounded-full border border-slate-200 shadow-sm">
                  {SAMPLE_PREVIEWS.map((sample, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSampleIndex(idx)}
                      aria-label={`아바타 미리보기 ${sample.categories[0]}`}
                      className={`transition-all duration-300 rounded-full ${
                        sampleIndex === idx
                          ? "w-6 h-2.5 bg-ku-crimson shadow-xs"
                          : "w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Gemini Plus for Students Sign-up Banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-4xl mx-auto mt-8 md:mt-12"
        >
          <GeminiStudentBanner />
        </motion.div>
      </section>
    </div>
  );
}
