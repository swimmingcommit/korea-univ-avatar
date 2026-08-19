"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Sparkles, RefreshCw, Layers, Sparkle } from "lucide-react";
import { AvatarConfiguration } from "@/lib/avatarEngine";
import {
  BackgroundLayer,
  EffectsLayer,
  TigerEarsLayer,
  HeadAndFaceLayer,
  EyesLayer,
  MouthLayer,
  HairAndHeadwearLayer,
  OutfitLayer,
  PropsLayer,
} from "./AvatarParts";

interface AvatarCanvasProps {
  config: AvatarConfiguration;
  size?: number;
  interactive?: boolean;
  onRefresh?: () => void;
  showTitle?: boolean;
  defaultMode?: "plush" | "svg";
}

export const AvatarCanvas: React.FC<AvatarCanvasProps> = ({
  config,
  size = 360,
  interactive = true,
  onRefresh,
  showTitle = true,
  defaultMode = "plush",
}) => {
  const [viewMode, setViewMode] = useState<"plush" | "svg">(defaultMode);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const [mouthFrame, setMouthFrame] = useState(0); // 0, 1, 2
  const [isTtsPlaying, setIsTtsPlaying] = useState(false);
  const [showSpeechBubble, setShowSpeechBubble] = useState(true);
  const speechIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Idle Blinking Loop (SVG mode)
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => {
        setIsBlinking(false);
      }, 160);
    }, 3200 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  // 2. Talking Lip Sync Loop
  useEffect(() => {
    if (isTalking) {
      speechIntervalRef.current = setInterval(() => {
        setMouthFrame((prev) => (prev + 1) % 3);
      }, 120);
    } else {
      if (speechIntervalRef.current) clearInterval(speechIntervalRef.current);
      setMouthFrame(0);
    }
    return () => {
      if (speechIntervalRef.current) clearInterval(speechIntervalRef.current);
    };
  }, [isTalking]);

  // 3. Web Speech API TTS & Tap interaction (Wakppu Mode!)
  const handleAvatarClick = () => {
    if (!interactive) return;

    if (isTtsPlaying) {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      setIsTtsPlaying(false);
      setIsTalking(false);
      return;
    }

    setIsTalking(true);
    setIsTtsPlaying(true);
    setShowSpeechBubble(true);

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(config.speechQuote);
      utterance.lang = "ko-KR";
      utterance.rate = 1.05;
      utterance.pitch = 1.15;

      utterance.onend = () => {
        setIsTalking(false);
        setIsTtsPlaying(false);
      };
      utterance.onerror = () => {
        setIsTalking(false);
        setIsTtsPlaying(false);
      };

      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => {
        setIsTalking(false);
        setIsTtsPlaying(false);
      }, 3500);
    }
  };

  return (
    <div className="flex flex-col items-center select-none">
      {/* Speech Bubble */}
      {showSpeechBubble && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="relative mb-3 px-4 py-2.5 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border-2 border-ku-crimson/20 max-w-[340px] text-center"
        >
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-ku-crimson mb-0.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" style={{ animationDuration: "4s" }} />
            <span>호랑이 아바타의 한마디</span>
          </div>
          <p className="text-sm font-semibold text-slate-800 leading-snug">
            &quot;{config.speechQuote}&quot;
          </p>
          {/* Arrow */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-r-2 border-b-2 border-ku-crimson/20" />
        </motion.div>
      )}

      {/* Main Avatar Card Canvas */}
      <div className="relative group">
        <motion.div
          animate={
            isTalking
              ? {
                  y: [0, -6, 0, -4, 0],
                  scale: [1, 1.025, 1, 1.018, 1],
                  rotate: [0, -1.2, 1.2, -1, 0],
                }
              : {
                  y: [0, -5, 0],
                }
          }
          transition={
            isTalking
              ? { repeat: Infinity, duration: 0.5, ease: "easeInOut" }
              : { repeat: Infinity, duration: 3.5, ease: "easeInOut" }
          }
          onClick={handleAvatarClick}
          className={`relative rounded-3xl overflow-hidden shadow-2xl transition-transform cursor-pointer border-4 border-white/90 hover:shadow-ku-crimson/30 bg-slate-900 ${
            interactive ? "hover:scale-[1.02] active:scale-[0.98]" : ""
          }`}
          style={{
            width: `${size}px`,
            height: `${size}px`,
            maxWidth: "100%",
            aspectRatio: "1/1",
          }}
          title={interactive ? "클릭해서 호랑이 목소리 듣기 (왁뿌 모드)" : undefined}
        >
          {viewMode === "plush" ? (
            /* 3D Plush Doll Keychain View */
            <div className="relative w-full h-full">
              <Image
                src={config.plushImageUrl || `/avatars/plush_${config.archetypeId}.png`}
                alt={config.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
              {/* Soft Ambient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            </div>
          ) : (
            /* Vector SVG View */
            <svg
              viewBox="0 0 400 400"
              className="w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              <BackgroundLayer config={config} />
              <EffectsLayer config={config} />
              <TigerEarsLayer config={config} />
              <HeadAndFaceLayer config={config} />
              <EyesLayer config={config} isBlinking={isBlinking} />
              <MouthLayer config={config} isTalking={isTalking} mouthFrame={mouthFrame} />
              <HairAndHeadwearLayer config={config} />
              <OutfitLayer config={config} />
              <PropsLayer config={config} />
            </svg>
          )}

          {/* Mode Switcher Button on Top Left */}
          {interactive && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setViewMode((prev) => (prev === "plush" ? "svg" : "plush"));
              }}
              className="absolute top-3 left-3 bg-black/65 hover:bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-white flex items-center gap-1.5 shadow-md transition-all hover:scale-105"
              title="털인형 키링 모드 / 일러스트 모드 전환"
            >
              {viewMode === "plush" ? (
                <>
                  <span>🧸 털인형 키링</span>
                </>
              ) : (
                <>
                  <span>🎨 일러스트</span>
                </>
              )}
            </button>
          )}

          {/* Interactive Wakppu Badge overlay */}
          {interactive && (
            <div className="absolute bottom-3 left-3 bg-black/65 backdrop-blur-md px-3 py-1 rounded-full text-[11px] text-white flex items-center gap-1.5 shadow-md">
              {isTtsPlaying ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  <span className="font-bold text-amber-300">말하는 중...</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-medium">터치하여 말하기</span>
                </>
              )}
            </div>
          )}

          {/* Category Pill on top right */}
          <div className="absolute top-3 right-3 bg-ku-crimson/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black text-white shadow-md flex items-center gap-1">
            <span>🐯 KU 2026</span>
          </div>
        </motion.div>

        {/* Action button beside avatar */}
        {onRefresh && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRefresh();
            }}
            className="absolute -top-2 -right-2 p-2 bg-white rounded-full shadow-lg border border-slate-200 text-slate-600 hover:text-ku-crimson hover:rotate-180 transition-all duration-300"
            title="다른 스타일로 새로고침"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Avatar Title & Info */}
      {showTitle && (
        <div className="text-center mt-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-ku-soft text-ku-crimson text-xs font-extrabold rounded-full mb-1.5">
            <span>{config.subtitle}</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {config.title}
          </h2>
          <p className="text-sm text-slate-600 max-w-sm mt-1 mx-auto leading-relaxed">
            {config.description}
          </p>
        </div>
      )}
    </div>
  );
};
