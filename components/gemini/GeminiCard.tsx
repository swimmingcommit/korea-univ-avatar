"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Lock, Unlock, MessageSquare, Flame, Lightbulb, Compass, RefreshCw } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { AvatarConfiguration } from "@/lib/avatarEngine";
import { RecommendationResult, UserPreferences } from "@/lib/recommendEngine";
import { GeminiCommentResponse } from "@/lib/gemini";

interface GeminiCardProps {
  prefs: UserPreferences;
  avatar: AvatarConfiguration;
  recommendations: RecommendationResult[];
}

export const GeminiCard: React.FC<GeminiCardProps> = ({ prefs, avatar, recommendations }) => {
  const { isLoggedIn, setShowLoginModal } = useAuth();
  const [commentData, setCommentData] = useState<GeminiCommentResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn && !commentData && !loading) {
      fetchComment();
    }
  }, [isLoggedIn]);

  const fetchComment = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/gemini/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prefs, avatar, recommendations }),
      });

      if (!res.ok) throw new Error("Failed to fetch comment");
      const data = await res.json();
      setCommentData(data);
    } catch (e) {
      console.error("Error loading Gemini comment", e);
    } finally {
      setLoading(false);
    }
  };

  // 1. Locked State (Freemium Gate)
  if (!isLoggedIn) {
    return (
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-ku-dark to-slate-900 p-6 md:p-8 text-white shadow-xl border border-ku-crimson/30">
        {/* Ambient Glow */}
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-ku-crimson/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-amber-300 border border-white/10">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Gemini AI 심층 분석 코멘트</span>
            </div>
            <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">
              AI 호랑이가 분석한 <span className="text-amber-300">나만의 동아리 시너지</span>
            </h3>
            <p className="text-xs md:text-sm text-slate-300 max-w-lg leading-relaxed">
              Google 로그인하고, 1위 추천 동아리와 나의 구체적 케미스트리 및 2학기 안암골 생존 꿀팁을 무료로 열어보세요!
            </p>
          </div>

          <button
            onClick={() => setShowLoginModal(true)}
            className="shrink-0 px-6 py-3.5 bg-gradient-to-r from-amber-400 via-rose-500 to-ku-crimson hover:opacity-95 text-white font-black text-sm rounded-2xl shadow-lg hover:shadow-rose-500/25 transition-all flex items-center gap-2 active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-yellow-200 animate-spin" style={{ animationDuration: "3s" }} />
            <span>무료로 AI 코멘트 열기</span>
          </button>
        </div>
      </div>
    );
  }

  // 2. Loading State
  if (loading) {
    return (
      <div className="rounded-3xl bg-white p-8 border-2 border-ku-crimson/30 shadow-xl text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-ku-soft flex items-center justify-center mx-auto text-ku-crimson">
          <Sparkles className="w-6 h-6 animate-spin text-ku-crimson" />
        </div>
        <div>
          <h4 className="text-base font-extrabold text-slate-900">
            호랑이 AI가 맞춤 코멘트를 생성하고 있습니다...
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            취향과 성향 벡터를 분석하여 2학기 캠퍼스 꿀팁을 정리 중입니다.
          </p>
        </div>
      </div>
    );
  }

  // 3. Unlocked State (Display AI Generated Insights)
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl bg-white p-6 md:p-8 border-2 border-rose-200 shadow-xl"
    >
      {/* Background Subtle Gradient */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-rose-50 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-rose-100">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-ku-crimson flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-slate-900">
                Gemini AI 맞춤 심층 분석 리포트
              </h3>
              <span className="text-[10px] font-extrabold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
                언락 완료 ✓
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Powered by Google Gemini 1.5 Flash
            </p>
          </div>
        </div>

        <button
          onClick={fetchComment}
          className="p-2 text-slate-400 hover:text-ku-crimson hover:bg-rose-50 rounded-full transition-colors"
          title="AI 코멘트 다시 생성"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Insights Grid */}
      <div className="space-y-4">
        {/* 1. Character Analysis */}
        <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-100/80">
          <div className="flex items-center gap-2 text-xs font-bold text-ku-crimson mb-1.5">
            <Flame className="w-4 h-4 text-rose-500" />
            <span>🐯 호랑이 자아 & 성향 분석</span>
          </div>
          <p className="text-sm font-medium text-slate-800 leading-relaxed">
            {commentData?.characterAnalysis}
          </p>
        </div>

        {/* 2. Club Synergy */}
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100/80">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-900 mb-1.5">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>🎯 1순위 추천 동아리와의 케미스트리</span>
          </div>
          <p className="text-sm font-medium text-slate-800 leading-relaxed">
            {commentData?.clubSynergy}
          </p>
        </div>

        {/* 3. Campus Survival Tips */}
        <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100/80">
          <div className="flex items-center gap-2 text-xs font-bold text-sky-900 mb-1.5">
            <Compass className="w-4 h-4 text-sky-600" />
            <span>🌟 2학기 안암골 동아리 라이프 실전 꿀팁</span>
          </div>
          <p className="text-sm font-medium text-slate-800 leading-relaxed">
            {commentData?.campusTips}
          </p>
        </div>

        {/* 4. Cheering Message Banner */}
        <div className="p-3.5 rounded-2xl bg-slate-900 text-white text-center font-bold text-xs md:text-sm shadow-md">
          {commentData?.cheeringMessage}
        </div>
      </div>
    </motion.div>
  );
};
