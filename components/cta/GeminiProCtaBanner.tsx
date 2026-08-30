"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle } from "lucide-react";
import { AvatarConfiguration } from "@/lib/avatarEngine";
import { Club } from "@/lib/recommendEngine";

interface GeminiProCtaBannerProps {
  avatar?: AvatarConfiguration;
  topClub?: Club;
  randomInitial?: boolean;
}

interface CtaVariant {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  copyPromptTemplate?: (avatarTitle?: string, clubName?: string) => string;
}

const CTA_VARIANTS: CtaVariant[] = [
  {
    id: "application",
    category: "동아리 합격 지원서 & 면접 가이드",
    title: "동아리 합격 지원서 & 면접 족보,\nGoogle AI Plus로 3초 완성!",
    subtitle:
      "내 성향 아바타 데이터를 바탕으로\nGoogle AI Plus가 1:1 맞춤형 지원동기 초안과\n심층 면접 예상 질문을 즉시 작성해 드립니다.",
    copyPromptTemplate: (avatarTitle = "열정 호랑이", clubName = "고려대학교 동아리") =>
      `안녕하세요! 저는 고려대학교 학생이며 동아리 성향 분석에서 '${avatarTitle}' 유형이 나왔습니다. 이번에 '${clubName}' 동아리에 지원하려고 합니다. 제 성향에 맞춰 진정성 있고 합격률을 높일 수 있는 1) 동아리 지원동기 및 자기소개서 초안 800자, 2) 면접관이 물어볼 만한 심층 예상 질문 5가지와 답변 가이드를 작성해주세요!`,
  },
  {
    id: "study_tutor",
    category: "전공 학점 & 과제 1:1 튜터",
    title: "동아리 활동하면서 학점까지 챙기는 법?\nGoogle AI Plus!",
    subtitle:
      "전공 PDF 요약, 코딩 디버깅, 조별과제 발표 대본까지!\n안암골 고려대생을 위한 똑똑한 1:1 AI 튜터를\n1년 무료로 만나보세요.",
    copyPromptTemplate: () =>
      `안녕하세요! 고려대학교 2학기 전공 수업 과제와 시험 준비를 도와줄 1:1 AI 튜터로 활약해주세요. 개념 요약, 논문 분석, 발표 슬라이드 구성을 단계별로 친절하게 안내해주세요.`,
  },
  {
    id: "mentor_chat",
    category: "24시간 선배 멘토링 상담",
    title: "대학 생활·진로·동아리 고민,\n호랑이 AI와 1:1 실시간 상담!",
    subtitle:
      "선후배 관계, 진로 탐색, 동아리 운영 고민까지!\nGoogle AI Plus의 방대한 지식으로\n끝없는 1:1 맞춤형 멘토 대화를 나눠보세요.",
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

    window.open("https://goo.gle/koreaseoul", "_blank", "noopener,noreferrer");
  };

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-xl bg-crimson text-white p-6 sm:p-8 text-center">
      {/* Subtle Pattern & Soft Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#7A1626] via-[#65101E] to-[#450A13] pointer-events-none" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-gold/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-4 text-center flex flex-col items-center justify-center">
        {/* Top Header Row: Google AI Plus 대학생 무료 혜택 */}
        <div className="flex items-center justify-center gap-2">
          <span className="text-gold text-lg">✨</span>
          <span className="font-black text-lg sm:text-xl tracking-wide text-white">
            Google AI Plus 대학생 무료 혜택
          </span>
        </div>

        {/* Content Card (Centered) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentVariant.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.18 }}
            className="space-y-2.5 flex flex-col items-center justify-center max-w-xl mx-auto text-center"
          >
            <span className="text-xs text-gold/90 font-bold tracking-wider block text-center">
              {currentVariant.category}
            </span>

            <h3 className="text-lg sm:text-2xl font-black text-white tracking-tight leading-snug whitespace-pre-line text-center keep-all break-keep">
              {currentVariant.title}
            </h3>
          </motion.div>
        </AnimatePresence>

        {/* Action Button (Cream Card Button) */}
        <div className="pt-2 flex justify-center w-full">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCtaClick}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-cream hover:bg-white text-crimson font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all group active:scale-95 text-center break-keep cursor-pointer"
          >
            <span>📚 Google AI Plus 대학생 1년 무료 혜택 받기</span>
            <ArrowRight className="w-4 h-4 text-crimson group-hover:translate-x-0.5 transition-transform shrink-0" />
          </motion.button>
        </div>

        {/* Toast Notification when Prompt is Auto-Copied */}
        <AnimatePresence>
          {copiedToast && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-ink text-white rounded-xl text-xs font-bold shadow-xl break-keep"
            >
              <CheckCircle className="w-3.5 h-3.5 text-gold shrink-0" />
              <span>✨ 맞춤 프롬프트가 복사되었습니다! 열린 창에 붙여넣기(Ctrl+V) 하세요.</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
