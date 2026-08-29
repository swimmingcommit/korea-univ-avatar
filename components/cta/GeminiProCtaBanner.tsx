"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Dices, ShieldCheck, CheckCircle } from "lucide-react";
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
  title: string;
  subtitle: string;
  btnMain: string;
  btnSub: string;
  tagline: string;
  copyPromptTemplate?: (avatarTitle?: string, clubName?: string) => string;
}

const CTA_VARIANTS: CtaVariant[] = [
  {
    id: "application",
    badge: "🎁 대학생 1년 무료 혜택",
    title: "동아리 합격 지원서 & 면접 족보, Gemini Plus로 3초 완성!",
    subtitle:
      "내 성향 아바타 데이터를 바탕으로 Gemini Plus가 1:1 맞춤형 지원동기 초안과 심층 면접 예상 질문을 즉시 작성해 드립니다.",
    btnMain: "✨ Gemini Plus",
    btnSub: "대학생 1년 무료로 시작하기",
    tagline: "Google 계정 연동 · 고려대생 1년 무료 제공 · 자유로운 해지 가능",
    copyPromptTemplate: (avatarTitle = "열정 호랑이", clubName = "고려대학교 동아리") =>
      `안녕하세요! 저는 고려대학교 학생이며 동아리 성향 분석에서 '${avatarTitle}' 유형이 나왔습니다. 이번에 '${clubName}' 동아리에 지원하려고 합니다. 제 성향에 맞춰 진정성 있고 합격률을 높일 수 있는 1) 동아리 지원동기 및 자기소개서 초안 800자, 2) 면접관이 물어볼 만한 심층 예상 질문 5가지와 답변 가이드를 작성해주세요!`,
  },
  {
    id: "goods_4k",
    badge: "🎨 4K 배경화면 & 일러스트 생성",
    title: "내 호랑이 키링의 '고연전 & 축제' 4K 일러스트 만들기!",
    subtitle:
      "Gemini Plus로 내 아바타의 사계절 캠퍼스 일러스트, 스마트폰 4K 배경화면, 실물 스티커 도안을 무제한으로 디자인해보세요.",
    btnMain: "🐯 Gemini Plus로",
    btnSub: "4K 배경화면 만들기 (1년 무료)",
    tagline: "Google 계정 연동 · 초고화질 이미지 무제한 생성 · 1년 무료",
    copyPromptTemplate: (avatarTitle = "고려대 호랑이") =>
      `A high-detailed 3D macro plush toy keychain of a cute yellow Korea University tiger mascot ('${avatarTitle}'), cheering at the annual Korea-Yonsei Games (고연전) in a stadium full of crimson flags. Studio lighting, felt texture, 4K masterpiece.`,
  },
  {
    id: "study_tutor",
    badge: "🚀 2학기 학점 & 과제 올인원 치트키",
    title: "동아리 활동하면서 학점까지 챙기는 법? Gemini Plus!",
    subtitle:
      "전공 PDF 요약, 코딩 디버깅, 조별과제 발표 대본까지! 안암골 고려대생을 위한 똑똑한 1:1 AI 튜터를 1년 무료로 만나보세요.",
    btnMain: "📚 Gemini Plus",
    btnSub: "대학생 1년 무료 혜택 받기",
    tagline: "Google 계정 연동 · 초대형 지식 컨텍스트 지원 · 1년 무료",
    copyPromptTemplate: () =>
      `안녕하세요! 고려대학교 2학기 전공 수업 과제와 시험 준비를 도와줄 1:1 AI 튜터로 활약해주세요. 개념 요약, 논문 분석, 발표 슬라이드 구성을 단계별로 친절하게 안내해주세요.`,
  },
  {
    id: "mentor_chat",
    badge: "💬 24시간 호랑이 1:1 멘토링",
    title: "대학 생활·진로·동아리 고민, 호랑이 AI와 1:1 실시간 상담!",
    subtitle:
      "선후배 관계, 진로 탐색, 동아리 운영 고민까지! Gemini Plus의 방대한 지식으로 끝없는 1:1 맞춤형 멘토 대화를 나눠보세요.",
    btnMain: "🔮 Gemini Plus",
    btnSub: "호랑이 멘토 무료 시작하기",
    tagline: "Google 계정 연동 · 1:1 맞춤형 멘토 대화 · 대학생 1년 무료",
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
    if (currentVariant.copyPromptTemplate && typeof navigator !== "undefined") {
      const prompt = currentVariant.copyPromptTemplate(avatar?.title, topClub?.name);
      navigator.clipboard?.writeText(prompt).catch(() => {});
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 4000);
    }

    // Open official sign-up URL in new window
    window.open("https://goo.gle/koreaseoul", "_blank", "noopener,noreferrer");
  };

  const handleNextVariant = (e: React.MouseEvent) => {
    e.stopPropagation();
    setVariantIndex((prev) => (prev + 1) % CTA_VARIANTS.length);
  };

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-xl border-2 border-rose-200/90 bg-white text-slate-900 p-5 sm:p-7">
      {/* Background Subtle Crimson & Warm Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50/60 via-white to-amber-50/30 pointer-events-none" />
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-4">
        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-ku-crimson flex items-center justify-center shadow-md shadow-ku-crimson/20">
              <Sparkles className="w-4 h-4 text-white animate-spin" style={{ animationDuration: "6s" }} />
            </div>
            <div className="flex items-center gap-1.5 font-black text-sm sm:text-base tracking-tight text-slate-900">
              <span>Google Gemini</span>
              <span className="px-2 py-0.5 rounded-md bg-ku-crimson text-white font-black text-[10px] uppercase shadow-sm">
                PLUS
              </span>
            </div>
          </div>

          {/* Compact Variant Switcher */}
          <button
            onClick={handleNextVariant}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-full border border-slate-200 text-xs font-bold text-slate-700 transition-colors"
            title="다른 혜택 보기"
          >
            <Dices className="w-3.5 h-3.5 text-ku-crimson animate-pulse" />
            <span>다른 혜택 ({variantIndex + 1}/{CTA_VARIANTS.length})</span>
          </button>
        </div>

        {/* Content Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentVariant.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="space-y-2"
          >
            <div className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-black bg-rose-100 text-ku-crimson border border-rose-200/80">
              <span>{currentVariant.badge}</span>
            </div>

            <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-[1.35] keep-all">
              {currentVariant.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-[1.6] max-w-xl keep-all">
              {currentVariant.subtitle}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Action Button & Compact Trust Row */}
        <div className="pt-1 flex flex-col sm:flex-row sm:items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCtaClick}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-ku-crimson hover:bg-ku-dark text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-ku-crimson/25 transition-all group active:scale-95 text-center break-keep"
          >
            <Sparkles className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform shrink-0" />
            <div className="flex flex-col sm:flex-row items-center justify-center sm:gap-1.5 leading-tight">
              <span>{currentVariant.btnMain}</span>
              <span>{currentVariant.btnSub}</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform shrink-0" />
          </motion.button>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium break-keep">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{currentVariant.tagline}</span>
          </div>
        </div>

        {/* Toast Notification when Prompt is Auto-Copied */}
        <AnimatePresence>
          {copiedToast && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-lg break-keep"
            >
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>✨ 맞춤 프롬프트가 복사되었습니다! 이동한 창에 붙여넣기(Ctrl+V) 하세요.</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
