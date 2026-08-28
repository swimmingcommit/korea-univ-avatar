"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowLeft, ArrowRight, CheckCircle2, Trophy, HelpCircle } from "lucide-react";
import { QUIZ_QUESTIONS, QuizOption } from "@/lib/quizData";
import { Traits, UserPreferences } from "@/lib/recommendEngine";
import { generateAvatar } from "@/lib/avatarEngine";

export default function QuizPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [isFinishing, setIsFinishing] = useState(false);
  const [direction, setDirection] = useState(1);

  const question = QUIZ_QUESTIONS[currentStep];

  const handleSelectOption = (optionIndex: number) => {
    // Haptic vibration feedback on mobile
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(15);
      } catch (e) {
        // Ignore if unsupported
      }
    }

    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[currentStep] = optionIndex;
    setSelectedAnswers(updatedAnswers);

    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setDirection(1);
      setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 180);
    } else {
      // Completed all questions! Finish quiz
      finishQuiz(updatedAnswers);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
    } else {
      router.push("/");
    }
  };

  const finishQuiz = async (answers: number[]) => {
    setIsFinishing(true);

    // Compute averaged traits from quiz
    let totalSociability = 0;
    let totalActivity = 0;
    let totalCreativity = 0;
    let totalLeadership = 0;
    let totalExpertise = 0;

    answers.forEach((ansIndex, qIdx) => {
      const q = QUIZ_QUESTIONS[qIdx];
      const opt = q.options[ansIndex];
      if (opt) {
        totalSociability += opt.traits.sociability;
        totalActivity += opt.traits.activity;
        totalCreativity += opt.traits.creativity;
        totalLeadership += opt.traits.leadership;
        totalExpertise += opt.traits.expertise;
      }
    });

    const len = answers.length || 1;
    const computedTraits: Traits = {
      sociability: Number((totalSociability / len).toFixed(2)),
      activity: Number((totalActivity / len).toFixed(2)),
      creativity: Number((totalCreativity / len).toFixed(2)),
      leadership: Number((totalLeadership / len).toFixed(2)),
      expertise: Number((totalExpertise / len).toFixed(2)),
    };

    try {
      const saved = localStorage.getItem("ku_avatar_prefs");
      const currentPrefs: UserPreferences = saved
        ? JSON.parse(saved)
        : { categories: ["IT/개발"] };

      currentPrefs.quizTraits = computedTraits;
      localStorage.setItem("ku_avatar_prefs", JSON.stringify(currentPrefs));

      const avatarConfig = generateAvatar(currentPrefs);
      const res = await fetch("/api/avatar/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prefs: currentPrefs,
          archetypeId: avatarConfig.archetypeId,
          customKeywords: currentPrefs.interests,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.imageUrl) {
          localStorage.setItem("ku_generated_avatar_image", data.imageUrl);
          if (data.prompt) {
            localStorage.setItem("ku_generated_avatar_prompt", data.prompt);
          }
        }
      }
    } catch (e) {
      console.error("Failed saving quiz results & AI generation", e);
    }

    router.push("/result");
  };

  if (isFinishing) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-5 max-w-sm"
        >
          <div className="w-20 h-20 rounded-3xl bg-ku-soft flex items-center justify-center mx-auto text-4xl shadow-xl border-2 border-ku-crimson/30 animate-bounce">
            🐯
          </div>
          <div>
            <span className="inline-block px-3 py-1 bg-amber-100 text-amber-900 text-xs font-black rounded-full mb-2">
              ✨ 3초 고속 AI 분석 중
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              5축 성향 분석 & 호랑이 매칭
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              사교성·활동성·창작성·리더십·전문성을 종합하여 찰떡 동아리와 3D 털인형 아바타를 소환합니다.
            </p>
          </div>

          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden shadow-inner">
            <motion.div
              className="bg-ku-crimson h-full rounded-full"
              initial={{ width: "15%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.6, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-4 sm:py-8 flex flex-col justify-between min-h-[82vh]">
      {/* 1. Instagram Story-style Top Segmented Progress Bar */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5">
          {QUIZ_QUESTIONS.map((_, idx) => (
            <div
              key={idx}
              className="flex-1 h-1.5 rounded-full bg-slate-200 overflow-hidden transition-all"
            >
              <div
                className={`h-full transition-all duration-300 ${
                  idx < currentStep
                    ? "bg-ku-crimson w-full"
                    : idx === currentStep
                    ? "bg-ku-crimson w-full animate-pulse"
                    : "w-0"
                }`}
              />
            </div>
          ))}
        </div>

        {/* Header Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrev}
            className="p-2 -ml-2 rounded-full text-slate-500 hover:text-slate-900 active:scale-90 transition-transform"
            aria-label="이전 질문"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-xs font-black text-slate-400">
            {currentStep + 1} / {QUIZ_QUESTIONS.length}
          </span>
          <span className="text-xs font-black text-ku-crimson bg-rose-50 px-2.5 py-0.5 rounded-full">
            1-Tap 성향 퀴즈
          </span>
        </div>
      </div>

      {/* 2. Main Question & Big 1-Tap Option Cards */}
      <div className="my-auto py-4">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -40 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="space-y-6"
          >
            {/* Question Title */}
            <div className="text-center space-y-2">
              <span className="inline-block text-3xl sm:text-4xl animate-bounce">
                {currentStep === 0 ? "🏃" : currentStep === 1 ? "💡" : currentStep === 2 ? "🎤" : currentStep === 3 ? "💻" : "🎉"}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                {question.title}
              </h2>
              <p className="text-xs text-slate-500">
                더 끌리는 선택지를 터치하면 즉시 다음 질문으로 넘어갑니다.
              </p>
            </div>

            {/* Option Cards (Big Thumb-friendly Touch Targets) */}
            <div className="space-y-3">
              {question.options.map((opt: QuizOption, optIdx: number) => {
                const isSelected = selectedAnswers[currentStep] === optIdx;
                return (
                  <motion.button
                    key={optIdx}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full p-5 sm:p-6 rounded-3xl text-left border-2 transition-all flex items-start gap-4 shadow-sm active:shadow-none ${
                      isSelected
                        ? "border-ku-crimson bg-rose-50/80 shadow-md ring-2 ring-ku-crimson/20"
                        : "border-slate-200/90 bg-white hover:border-ku-crimson/50 hover:bg-slate-50/70"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg font-black shrink-0 transition-colors ${
                        isSelected
                          ? "bg-ku-crimson text-white shadow-sm"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {optIdx === 0 ? "A" : "B"}
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="text-base font-black text-slate-900 leading-snug">
                        {opt.text}
                      </div>
                      {opt.description && (
                        <div className="text-xs text-slate-500 font-medium leading-relaxed">
                          {opt.description}
                        </div>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 3. Bottom Minimalist Helper */}
      <div className="text-center pt-2">
        <p className="text-[11px] text-slate-400 font-medium">
          💡 별도의 확인 버튼 없이 선택 시 0.2초 만에 자동 전환됩니다.
        </p>
      </div>
    </div>
  );
}
