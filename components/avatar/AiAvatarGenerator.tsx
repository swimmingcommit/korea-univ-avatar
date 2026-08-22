"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  RefreshCw,
  Wand2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { AvatarConfiguration } from "@/lib/avatarEngine";
import { UserPreferences } from "@/lib/recommendEngine";

interface AiAvatarGeneratorProps {
  avatar: AvatarConfiguration;
  prefs: UserPreferences;
  onAvatarUpdated?: (newImageUrl: string) => void;
}

export const AiAvatarGenerator: React.FC<AiAvatarGeneratorProps> = ({
  avatar,
  prefs,
  onAvatarUpdated,
}) => {
  const [currentImageUrl, setCurrentImageUrl] = useState<string>(
    avatar.plushImageUrl || `/avatars/plush_${avatar.archetypeId}.png`
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [customKeywords, setCustomKeywords] = useState("");
  const [showPromptDetails, setShowPromptDetails] = useState(false);
  const [generationHistory, setGenerationHistory] = useState<string[]>([currentImageUrl]);
  const [lastPrompt, setLastPrompt] = useState<string>("");
  const [lastDetails, setLastDetails] = useState<{ outfit?: string; prop?: string; background?: string }>({});

  const progressMessages = [
    "호랑이 인형 폭신한 솜 채우는 중... 🧸",
    "유형별 의상과 소품 스타일링 중... 👔",
    "안암골 캠퍼스 조명 세팅 중... 📸",
    "뽀송뽀송 털인형 키링 완성! ✨",
  ];

  const handleGenerateNewStyle = async () => {
    setIsGenerating(true);
    setProgressStep(0);

    const stepInterval = setInterval(() => {
      setProgressStep((prev) => (prev < progressMessages.length - 1 ? prev + 1 : prev));
    }, 1200);

    try {
      const res = await fetch("/api/avatar/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prefs,
          archetypeId: avatar.archetypeId,
          customKeywords: customKeywords.trim() || undefined,
        }),
      });

      clearInterval(stepInterval);

      if (res.ok) {
        const data = await res.json();
        if (data.imageUrl) {
          setCurrentImageUrl(data.imageUrl);
          setLastPrompt(data.prompt);
          setLastDetails(data.details || {});
          setGenerationHistory((prev) => [data.imageUrl, ...prev.slice(0, 5)]);
          if (onAvatarUpdated) {
            onAvatarUpdated(data.imageUrl);
          }
        }
      }
    } catch (error) {
      console.error("Failed to generate:", error);
    } finally {
      clearInterval(stepInterval);
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-indigo-500/30 shadow-2xl space-y-6">
      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-rose-500 flex items-center justify-center shadow-md">
            <Wand2 className="w-4 h-4 text-slate-950 font-black" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span>Nano Banana AI 실시간 아바타 스튜디오</span>
              <span className="px-2 py-0.5 bg-ku-crimson text-white text-[10px] font-black rounded-full uppercase">
                v2 AI
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              기본 호랑이 앵커를 유지한 채, 매번 새로운 의상·소품·배경 조합을 무한 생성합니다.
            </p>
          </div>
        </div>
      </div>

      {/* Main Interactive Controls & Prompt Customizer */}
      <div className="space-y-4">
        {/* Optional Custom Keyword Input */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5">
            추가하고 싶은 특별한 콘셉트 (선택 사항)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={customKeywords}
              onChange={(e) => setCustomKeywords(e.target.value)}
              placeholder="예: 고연전 붉은 깃발, 눈 내리는 중앙광장, 락스타 일렉기타"
              className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-amber-400 rounded-2xl text-xs text-white placeholder-slate-500 outline-none transition-colors"
            />
          </div>
        </div>

        {/* Action Button & Live Progress */}
        <div className="space-y-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isGenerating}
            onClick={handleGenerateNewStyle}
            className={`w-full py-4 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl transition-all ${
              isGenerating
                ? "bg-slate-800 text-slate-400 cursor-not-allowed"
                : "bg-gradient-to-r from-amber-400 via-rose-500 to-ku-crimson text-white hover:shadow-rose-500/30"
            }`}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin text-amber-300" />
                <span>{progressMessages[progressStep]}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-300 animate-bounce" />
                <span>🎨 AI로 새로운 조합의 호랑이 다시 그리기</span>
              </>
            )}
          </motion.button>

          {/* Prompt Details Accordion */}
          {lastPrompt && (
            <div className="pt-2">
              <button
                onClick={() => setShowPromptDetails(!showPromptDetails)}
                className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 font-bold"
              >
                <span>생성된 AI 프롬프트 매트릭스 세부 정보</span>
                {showPromptDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              <AnimatePresence>
                {showPromptDetails && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2 font-mono"
                  >
                    {lastDetails.outfit && (
                      <p>
                        <span className="text-amber-400 font-bold">의상:</span> {lastDetails.outfit}
                      </p>
                    )}
                    {lastDetails.prop && (
                      <p>
                        <span className="text-rose-400 font-bold">소품:</span> {lastDetails.prop}
                      </p>
                    )}
                    {lastDetails.background && (
                      <p>
                        <span className="text-blue-400 font-bold">배경:</span> {lastDetails.background}
                      </p>
                    )}
                    <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-800/80">
                      {lastPrompt}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* History Strip if multiple generated */}
        {generationHistory.length > 1 && (
          <div className="pt-3 border-t border-slate-800">
            <p className="text-xs font-bold text-slate-400 mb-2">생성 기록 (클릭하여 교체)</p>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {generationHistory.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentImageUrl(img);
                    if (onAvatarUpdated) onAvatarUpdated(img);
                  }}
                  className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 transition-transform hover:scale-105 shrink-0 ${
                    currentImageUrl === img ? "border-amber-400 shadow-md" : "border-slate-700 opacity-70"
                  }`}
                >
                  <Image src={img} alt="호랑이 아바타 변형" fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
