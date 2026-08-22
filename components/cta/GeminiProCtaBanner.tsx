"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Dices, ShieldCheck, CheckCircle, ExternalLink, Copy } from "lucide-react";
import { AvatarConfiguration } from "@/lib/avatarEngine";
import { Club } from "@/lib/recommendEngine";

interface GeminiProCtaBannerProps {
  avatar?: AvatarConfiguration;
  topClub?: Club;
  randomInitial?: boolean;
}

interface CtaVariant {
  id: string;
  badge: string;
  badgeColor: string;
  title: string;
  subtitle: string;
  buttonText: string;
  tagline: string;
  accentGradient: string;
  copyPromptTemplate?: (avatarTitle?: string, clubName?: string) => string;
}

const CTA_VARIANTS: CtaVariant[] = [
  {
    id: "application",
    badge: "🔥 가장 많은 고려대생이 선택한 혜택",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-400/30",
    title: "마음에 드는 동아리를 찾으셨나요? 3초 만에 합격 지원서를 완성해보세요!",
    subtitle:
      "내 성향 아바타 데이터를 바탕으로 Gemini Pro가 1:1 맞춤형 동아리 자기소개서 초안 & 면접 예상 질문 5가지를 즉시 작성해 드립니다.",
    buttonText: "✨ Gemini Pro로 내 맞춤 지원서 & 면접 족보 무료 생성하기",
    tagline: "🔒 Google 계정 1-Click 연동 · 대학생 1개월 무료 체험 제공",
    accentGradient: "from-purple-600 via-indigo-600 to-rose-600",
    copyPromptTemplate: (avatarTitle = "열정 호랑이", clubName = "고려대학교 동아리") =>
      `안녕하세요! 저는 고려대학교 학생이며 동아리 성향 분석에서 '${avatarTitle}' 유형이 나왔습니다. 이번에 '${clubName}' 동아리에 지원하려고 합니다. 제 성향에 맞춰 진정성 있고 합격률을 높일 수 있는 1) 동아리 지원동기 및 자기소개서 초안 800자, 2) 면접관이 물어볼 만한 심층 예상 질문 5가지와 답변 가이드를 작성해주세요!`,
  },
  {
    id: "goods_4k",
    badge: "🎨 4K 고화질 배경화면 & 굿즈 제작",
    badgeColor: "bg-pink-500/20 text-pink-300 border-pink-400/30",
    title: "내 호랑이 키링의 '고연전 응원' & '축제 무대' 버전을 직접 만들어보세요!",
    subtitle:
      "Gemini Pro(Imagen 3)로 내 아바타의 사계절 캠퍼스 일러스트, 스마트폰 배경화면, 실물 스티커 도안을 무제한으로 디자인할 수 있습니다.",
    buttonText: "🐯 Gemini Pro로 내 아바타 4K 배경화면 만들기 (1개월 무료)",
    tagline: "🔒 Google 계정 1-Click 연동 · 초고화질 이미지 무제한 생성",
    accentGradient: "from-pink-600 via-rose-600 to-amber-600",
    copyPromptTemplate: (avatarTitle = "고려대 호랑이") =>
      `A high-detailed 3D macro plush toy keychain of a cute yellow Korea University tiger mascot ('${avatarTitle}'), cheering at the annual Korea-Yonsei Games (고연전) in a stadium full of crimson flags. Studio lighting, felt texture, 4K masterpiece.`,
  },
  {
    id: "study_tutor",
    badge: "🎓 2학기 학점 & 과제 올인원 치트키",
    badgeColor: "bg-blue-500/20 text-blue-300 border-blue-400/30",
    title: "동아리 갓생 살면서 학점까지 챙기는 법? Gemini Pro와 함께하세요!",
    subtitle:
      "전공 PDF 요약, 코딩 디버깅, 조별과제 발표 대본까지! 안암골 고려대생을 위한 가장 똑똑한 1:1 AI 튜터를 지금 시작해보세요.",
    buttonText: "🚀 Gemini Pro 학생 혜택으로 캠퍼스 라이프 업그레이드하기",
    tagline: "🔒 Google 계정 1-Click 연동 · 200만 토큰 초대형 지식 컨텍스트 지원",
    accentGradient: "from-blue-600 via-cyan-600 to-indigo-700",
    copyPromptTemplate: () =>
      `안녕하세요! 고려대학교 2학기 전공 수업 과제와 시험 준비를 도와줄 1:1 AI 튜터로 활약해주세요. 개념 요약, 논문 분석, 발표 슬라이드 구성을 단계별로 친절하게 안내해주세요.`,
  },
  {
    id: "mentor_chat",
    badge: "💬 24시간 1:1 호랑이 멘토링",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-400/30",
    title: "호랑이 AI 멘토와 더 깊은 캠퍼스 고민 상담을 나누고 싶다면?",
    subtitle:
      "선후배 관계, 진로 탐색, 동아리 운영 고민까지! Gemini 1.5 Pro의 방대한 지식으로 끝없는 1:1 실시간 대화를 이어가보세요.",
    buttonText: "🔮 호랑이 AI와 1:1 실시간 대화방 입장하기",
    tagline: "🔒 Google 계정 1-Click 연동 · 자연스러운 1:1 맞춤형 멘토 대화",
    accentGradient: "from-emerald-600 via-teal-600 to-blue-700",
    copyPromptTemplate: (avatarTitle = "호랑이") =>
      `너는 고려대학교의 든든하고 친근한 호랑이 선배 멘토야. 내 아바타 성향인 '${avatarTitle}'에 맞춰서 대학 생활, 동아리 활동, 진로에 대한 고민을 따뜻하고 지혜롭게 상담해줘!`,
  },
];

export const GeminiProCtaBanner: React.FC<GeminiProCtaBannerProps> = ({
  avatar,
  topClub,
  randomInitial = true,
}) => {
  const [variantIndex, setVariantIndex] = useState(0);
  const [copiedToast, setCopiedToast] = useState(false);

  // Pick random variant on initial load
  useEffect(() => {
    if (randomInitial) {
      const randomIndex = Math.floor(Math.random() * CTA_VARIANTS.length);
      setVariantIndex(randomIndex);
    }
  }, [randomInitial]);

  const currentVariant = CTA_VARIANTS[variantIndex];

  const handleCtaClick = () => {
    // 1. Copy custom prompt to clipboard for user convenience
    if (currentVariant.copyPromptTemplate && typeof navigator !== "undefined") {
      const prompt = currentVariant.copyPromptTemplate(avatar?.title, topClub?.name);
      navigator.clipboard?.writeText(prompt).catch(() => {});
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 4000);
    }

    // 2. Open Gemini Pro sign-up / Google Advanced official page in new window
    window.open("https://gemini.google.com/advanced", "_blank", "noopener,noreferrer");
  };

  const handleNextVariant = (e: React.MouseEvent) => {
    e.stopPropagation();
    setVariantIndex((prev) => (prev + 1) % CTA_VARIANTS.length);
  };

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-indigo-400/30 bg-slate-950 text-white p-6 sm:p-10">
      {/* Background Animated Gradient Mesh */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/80 via-slate-900 to-purple-950/80 pointer-events-none" />
      <div
        className={`absolute -top-24 -right-24 w-80 h-80 rounded-full bg-gradient-to-br ${currentVariant.accentGradient} opacity-30 blur-3xl transition-all duration-700 pointer-events-none`}
      />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />

      {/* Floating Sparkles & Google Gemini Logo Badge */}
      <div className="relative z-10 space-y-6">
        {/* Top Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Sparkles className="w-4 h-4 text-white animate-spin" style={{ animationDuration: "6s" }} />
            </div>
            <div className="flex items-center gap-1.5 font-black text-sm sm:text-base tracking-tight text-white">
              <span>Google Gemini</span>
              <span className="px-2 py-0.5 rounded-md bg-gradient-to-r from-amber-400 to-rose-500 text-slate-950 font-black text-[10px] uppercase shadow-sm">
                PRO
              </span>
            </div>
          </div>

          {/* Variant Switcher Pill / Dice Button */}
          <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-xs">
            <span className="text-[11px] text-slate-300 hidden sm:inline">다른 혜택 보기</span>
            <button
              onClick={handleNextVariant}
              className="p-1 hover:text-amber-300 transition-colors flex items-center gap-1 text-[11px] font-bold text-amber-400"
              title="다른 Gemini Pro CTA 혜택으로 전환"
            >
              <Dices className="w-3.5 h-3.5 animate-pulse" />
              <span>{variantIndex + 1} / {CTA_VARIANTS.length}</span>
            </button>
          </div>
        </div>

        {/* Content Card with Smooth AnimatePresence */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentVariant.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 max-w-2xl"
          >
            {/* Dynamic Badge */}
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border ${currentVariant.badgeColor}`}
            >
              <span>{currentVariant.badge}</span>
            </div>

            {/* Main Headline */}
            <h3 className="text-xl sm:text-3xl font-black text-white tracking-tight leading-snug sm:leading-tight">
              {currentVariant.title}
            </h3>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              {currentVariant.subtitle}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Main Action Button (1-Click Google Sign-up link) */}
        <div className="pt-2 space-y-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCtaClick}
            className={`w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r ${currentVariant.accentGradient} text-white font-black text-sm sm:text-base flex items-center justify-center gap-3 shadow-xl hover:shadow-indigo-500/40 transition-all group`}
          >
            <Sparkles className="w-5 h-5 text-amber-300 group-hover:rotate-12 transition-transform" />
            <span>{currentVariant.buttonText}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>

          {/* Trust Tagline & Student Benefit */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>{currentVariant.tagline}</span>
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="text-slate-400">언제든 자유롭게 해지 가능</span>
          </div>
        </div>

        {/* Toast Notification when Prompt is Auto-Copied */}
        <AnimatePresence>
          {copiedToast && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/90 text-white rounded-xl text-xs font-bold shadow-lg backdrop-blur-md"
            >
              <CheckCircle className="w-4 h-4" />
              <span>✨ 내 맞춤 프롬프트가 복사되었습니다! Gemini Pro 창에 붙여넣기(Ctrl+V) 하세요.</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
