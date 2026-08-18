"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowLeft, ArrowRight, CheckCircle2, Trophy } from "lucide-react";
import { QUIZ_QUESTIONS, QuizOption } from "@/lib/quizData";
import { Traits, UserPreferences } from "@/lib/recommendEngine";

export default function QuizPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [isFinishing, setIsFinishing] = useState(false);

  const question = QUIZ_QUESTIONS[currentStep];
  const progressPercent = Math.round(((currentStep + 1) / QUIZ_QUESTIONS.length) * 100);

  const handleSelectOption = (optionIndex: number) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[currentStep] = optionIndex;
    setSelectedAnswers(updatedAnswers);

    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 250);
    } else {
      // Completed all 5 questions! Calculate trait vector and finish
      finishQuiz(updatedAnswers);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      router.push("/create");
    }
  };

  const finishQuiz = (answers: number[]) => {
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

    // Load existing prefs and inject quizTraits
    try {
      const saved = localStorage.getItem("ku_avatar_prefs");
      const currentPrefs: UserPreferences = saved
        ? JSON.parse(saved)
        : { categories: ["IT/개발"] };

      currentPrefs.quizTraits = computedTraits;
      localStorage.setItem("ku_avatar_prefs", JSON.stringify(currentPrefs));
    } catch (e) {
      console.error("Failed saving quiz results", e);
    }

    setTimeout(() => {
      router.push("/result");
    }, 2000);
  };

  if (isFinishing) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-5 max-w-sm"
        >
          <div className="w-20 h-20 rounded-3xl bg-ku-soft flex items-center justify-center mx-auto text-4xl shadow-xl border-2 border-ku-crimson/30 animate-bounce">
            🐯
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">
              5축 성향 벡터 계산 완료!
            </h3>
            <p className="text-xs text-slate-500 mt-1.5">
              사교성·활동성·창작성·리더십·전문성을 종합하여 당신만의 아바타와 찰떡 동아리를 불러옵니다.
            </p>
          </div>

          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <motion.div
              className="bg-ku-crimson h-full rounded-full"
              initial={{ width: "20%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.8 }}
            />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      {/* Top Navigation & Progress */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={handlePrev}
          className="p-2.5 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="flex-1 max-w-xs">
          <div className="flex items-center justify-between text-xs font-black text-slate-500 mb-1.5">
            <span>QUESTION {currentStep + 1} OF {QUIZ_QUESTIONS.length}</span>
            <span className="text-ku-crimson">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <motion.div
              className="bg-ku-crimson h-full rounded-full"
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <div className="w-9 h-9" /> {/* placeholder to balance */}
      </div>

      {/* Quiz Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100 space-y-6"
        >
          {/* Category Pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 text-xs font-black rounded-full border border-amber-200/80">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{question.categoryTitle}</span>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
              {question.question}
            </h2>
            <p className="text-xs text-slate-500 mt-1">{question.description}</p>
          </div>

          {/* Options */}
          <div className="space-y-3 pt-2">
            {question.options.map((opt: QuizOption, idx: number) => {
              const isSelected = selectedAnswers[currentStep] === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full p-5 rounded-2xl text-left border-2 transition-all flex items-start gap-4 ${
                    isSelected
                      ? "bg-rose-50/90 border-ku-crimson shadow-md scale-[1.01]"
                      : "bg-slate-50 border-slate-200/80 hover:bg-slate-100 hover:border-slate-300 active:scale-[0.99]"
                  }`}
                >
                  <span className="text-3xl shrink-0 mt-0.5">{opt.emoji}</span>
                  <div className="space-y-1">
                    <p className="text-sm font-extrabold text-slate-900 leading-snug">
                      {opt.text}
                    </p>
                    <p className="text-xs text-slate-500">{opt.subtext}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
