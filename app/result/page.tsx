"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Sparkles,
  Share2,
  RotateCcw,
  Compass,
  Trophy,
  Download,
  Flame,
  Users,
  Brain,
  Palette,
  Coffee,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { AvatarCanvas } from "@/components/avatar/AvatarCanvas";
import { ClubCard } from "@/components/club/ClubCard";
import { GeminiCard } from "@/components/gemini/GeminiCard";
import { ShareModal } from "@/components/share/ShareModal";
import { GeminiProCtaBanner } from "@/components/cta/GeminiProCtaBanner";
import { AiAvatarGenerator } from "@/components/avatar/AiAvatarGenerator";
import { generateAvatar, AvatarConfiguration } from "@/lib/avatarEngine";
import { recommendClubs, RecommendationResult, UserPreferences } from "@/lib/recommendEngine";

export default function ResultPage() {
  const router = useRouter();
  const exportCardRef = useRef<HTMLDivElement>(null);

  const [prefs, setPrefs] = useState<UserPreferences>({
    categories: ["IT/개발"],
    college: "정보대학",
  });
  const [avatar, setAvatar] = useState<AvatarConfiguration | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationResult[]>([]);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("ku_avatar_prefs");
      let userPrefs: UserPreferences = {
        categories: ["IT/개발"],
        college: "정보대학",
      };

      if (saved) {
        userPrefs = JSON.parse(saved);
      }

      setPrefs(userPrefs);
      const generated = generateAvatar(userPrefs);
      setAvatar(generated);

      const recs = recommendClubs(userPrefs, 5);
      setRecommendations(recs);
      setLoaded(true);

      // Trigger Celebration Confetti
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#862633", "#FDE047", "#F43F5E", "#1E293B"],
      });
    } catch (e) {
      console.error(e);
      setLoaded(true);
    }
  }, []);

  if (!loaded || !avatar) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-ku-soft flex items-center justify-center text-ku-crimson animate-spin">
          <Sparkles className="w-6 h-6" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 space-y-10">
      {/* 1. Header Banner */}
      <div className="text-center space-y-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-amber-50 text-amber-800 text-xs font-black rounded-full border border-amber-200 shadow-sm"
        >
          <Trophy className="w-3.5 h-3.5 text-amber-500" />
          <span>2026-2학기 고려대 동아리 매칭 완료</span>
        </motion.div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          당신의 동아리 자아는 <span className="text-ku-crimson">&apos;{avatar.title}&apos;</span>!
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          아바타를 클릭하거나 당기면 말랑말랑 쫀득하게 꾹꾹 눌러집니다 🐾
        </p>
      </div>

      {/* 2. Avatar Presentation & Stats Card (Exportable Target) */}
      <div
        id="avatar-card-export"
        ref={exportCardRef}
        className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 space-y-8"
      >
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          {/* Avatar Canvas */}
          <div className="shrink-0">
            <AvatarCanvas config={avatar} size={300} interactive={true} showTitle={false} />
          </div>

          {/* Avatar Profile & Traits Stats */}
          <div className="flex-1 w-full space-y-5 text-center md:text-left">
            <div>
              <span className="inline-block px-3 py-1 bg-ku-soft text-ku-crimson text-xs font-black rounded-full mb-1.5">
                {avatar.subtitle}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                {avatar.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                {avatar.description}
              </p>
            </div>

            {/* Trait Stats Progress */}
            <div className="space-y-2.5 pt-2">
              <div className="space-y-1 text-xs font-bold text-slate-700">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-rose-600">
                    <Flame className="w-3.5 h-3.5" />
                    <span>열정 & 활동성</span>
                  </span>
                  <span>{avatar.stats.passion}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-rose-500 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${avatar.stats.passion}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1 text-xs font-bold text-slate-700">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-amber-600">
                    <Users className="w-3.5 h-3.5" />
                    <span>친화력 & 인싸력</span>
                  </span>
                  <span>{avatar.stats.sociability}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${avatar.stats.sociability}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1 text-xs font-bold text-slate-700">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-indigo-600">
                    <Brain className="w-3.5 h-3.5" />
                    <span>전문성 & 지적 탐구</span>
                  </span>
                  <span>{avatar.stats.intellect}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-500 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${avatar.stats.intellect}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1 text-xs font-bold text-slate-700">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-purple-600">
                    <Palette className="w-3.5 h-3.5" />
                    <span>창의성 & 유니크</span>
                  </span>
                  <span>{avatar.stats.creativity}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-purple-500 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${avatar.stats.creativity}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Action Bar under card */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-slate-100">
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="px-5 py-2.5 bg-ku-crimson hover:bg-ku-dark text-white rounded-2xl font-bold text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>결과 공유 & 이미지 저장</span>
          </button>

          <Link
            href="/create"
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>다시 만들기</span>
          </Link>
        </div>
      </div>

      {/* 3. Nano Banana AI Live Combinatorial Studio */}
      <div>
        <AiAvatarGenerator
          avatar={avatar}
          prefs={prefs}
          onAvatarUpdated={(newImageUrl) => {
            setAvatar((prev) => (prev ? { ...prev, plushImageUrl: newImageUrl } : null));
          }}
        />
      </div>

      {/* 4. Gemini AI Insights Gate Card */}
      <div>
        <GeminiCard prefs={prefs} avatar={avatar} recommendations={recommendations} />
      </div>

      {/* 4. Top Recommended Clubs Section */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>🎯 딱 맞는 고려대 동아리 TOP 5</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              성향 벡터와 키워드 유사도 분석을 바탕으로 엄선된 추천 결과입니다.
            </p>
          </div>

          <a
            href="https://klub.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-ku-crimson transition-colors"
          >
            <span>klub.kr 전체 동아리 보기</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((result, idx) => (
            <ClubCard key={result.club.id} result={result} rank={idx + 1} />
          ))}
        </div>
      </div>

      {/* 5. Grand Finale: High-Converting Gemini Pro CTA Banner */}
      <div>
        <GeminiProCtaBanner
          avatar={avatar}
          topClub={recommendations[0]?.club}
          randomInitial={true}
        />
      </div>

      {/* 6. Bottom Share CTA Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 text-center space-y-3 shadow-lg">
        <p className="text-sm font-bold">
          친구나 동기에게도 어울리는 호랑이 동아리 아바타를 알려주세요! 🐯
        </p>
        <button
          onClick={() => setIsShareModalOpen(true)}
          className="px-6 py-3 bg-gradient-to-r from-amber-400 to-ku-crimson text-white rounded-2xl font-black text-xs inline-flex items-center gap-2 shadow-md hover:scale-105 active:scale-95 transition-all"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>아바타 공유하기</span>
        </button>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        avatar={avatar}
        cardRef={exportCardRef}
      />
    </div>
  );
}
