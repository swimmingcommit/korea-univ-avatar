"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Compass, Users, Zap, ShieldCheck, CheckCircle2, ChevronRight } from "lucide-react";
import { AvatarCanvas } from "@/components/avatar/AvatarCanvas";
import { generateAvatar, AvatarConfiguration } from "@/lib/avatarEngine";

// Sample avatars for live preview showcase (8 Core Archetypes)
const SAMPLE_PREVIEWS = [
  {
    categories: ["예술/공연"],
    interests: "무대 보컬 밴드 댄스 스포트라이트",
    college: "문과대학",
  },
  {
    categories: ["IT/개발"],
    interests: "코딩 밤샘 해커톤 알고리즘 파이썬",
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
    categories: ["학술"],
    interests: "철학 인문 독서 서재 사유",
    college: "문과대학",
  },
  {
    categories: [],
    interests: "",
    currentClub: "새내기 (탐색 중)",
    college: "고려대학교",
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
              className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]"
            >
              너의 동아리 자아,{" "}
              <span className="text-ku-crimson underline decoration-amber-400 decoration-wavy decoration-2">
                호랑이 아바타
              </span>
              로 찾아봐! 🐯
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed max-w-lg mx-auto md:mx-0"
            >
              취향 키워드 몇 개만 입력하면 <strong className="text-slate-900">살아 숨 쉬는 아바타</strong>와{" "}
              <strong className="text-slate-900">찰떡 고려대 동아리</strong>를 즉시 추천해 드려요.
              Google Gemini AI의 심층 케미스트리 분석까지!
            </motion.p>

            {/* CTA Group */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3.5 pt-2"
            >
              <Link
                href="/create"
                className="w-full sm:w-auto px-8 py-4 bg-ku-crimson hover:bg-ku-dark text-white font-black text-base rounded-2xl shadow-xl hover:shadow-ku-crimson/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 group"
              >
                <span>내 아바타 만들기 (무료)</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/create/quiz"
                className="w-full sm:w-auto px-6 py-4 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm rounded-2xl border-2 border-slate-200 shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <Compass className="w-4 h-4 text-amber-600" />
                <span>성향 퀴즈로 바로가기</span>
              </Link>
            </motion.div>

            {/* Social Trust */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center justify-center md:justify-start gap-4 text-xs text-slate-500 pt-2"
            >
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>회원가입 없이 즉시 생성</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>고려대 100+개 공식 & 애기능 동아리 DB</span>
              </div>
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

                {/* Sample style selector tabs */}
                <div className="flex items-center justify-center gap-2 mt-4 bg-white/80 backdrop-blur-md p-1.5 rounded-full border border-slate-200 shadow-sm">
                  {SAMPLE_PREVIEWS.map((sample, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSampleIndex(idx)}
                      className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
                        sampleIndex === idx
                          ? "bg-ku-crimson text-white shadow-sm"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {sample.categories[0]}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* 2. Feature Walkthrough (3-Step Loop) */}
      <section className="py-16 bg-white border-y border-slate-100 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-extrabold text-ku-crimson px-3 py-1 bg-ku-soft rounded-full uppercase tracking-wider">
              HOW IT WORKS
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-3">
              3단계로 완성하는 나만의 캠퍼스 라이프
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              가볍게 취향을 고르고, 아바타를 확인하고, Gemini AI 심층 코멘트로 마무리!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 space-y-3 relative hover:border-rose-200 transition-colors">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-ku-crimson font-black text-base flex items-center justify-center">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900">취향 & 관심사 선택</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                현재 소속 동아리, 관심 카테고리(IT, 밴드, 스포츠 등), 혹은 5문항 성향 퀴즈를 선택해 나의 취향을 입력합니다.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 space-y-3 relative hover:border-amber-200 transition-colors">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 font-black text-base flex items-center justify-center">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900">아바타 & 동아리 생성</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                파츠 조합 알고리즘으로 호랑이 아바타가 생성되며, 5축 벡터 코사인 유사도로 Top 5 고려대 동아리를 추천합니다.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-rose-50 to-amber-50 border border-rose-200/80 space-y-3 relative">
              <div className="w-10 h-10 rounded-2xl bg-ku-crimson text-white font-black text-base flex items-center justify-center shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Gemini AI 심층 분석</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Google 계정으로 연동하면 호랑이 AI가 1:1로 맞춤 작성한 추천 이유와 2학기 캠퍼스 꿀팁을 언락합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Bottom High Impact Banner */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto rounded-3xl crimson-gradient p-8 md:p-12 text-white text-center shadow-2xl relative overflow-hidden">
          {/* Subtle Background Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-xl mx-auto space-y-5">
            <span className="inline-block px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-bold text-amber-300 border border-white/10">
              🐯 안암골 붉은 호랑이들의 선택
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              이번 학기, 나와 딱 맞는 <br />
              인생 동아리를 만나보세요!
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              1분 만에 끝나는 아바타 생성과 함께 2026년 2학기 캠퍼스 라이프를 시작해보세요.
            </p>

            <div className="pt-2">
              <Link
                href="/create"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-ku-crimson hover:bg-slate-100 font-black text-sm rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all"
              >
                <span>지금 바로 아바타 만들기</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
