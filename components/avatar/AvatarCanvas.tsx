"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RefreshCw, Hand, Heart } from "lucide-react";
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

interface Particle {
  id: number;
  x: number;
  y: number;
  emoji: string;
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
  const [particles, setParticles] = useState<Particle[]>([]);
  const [squishCount, setSquishCount] = useState(0);
  const [isSquishing, setIsSquishing] = useState(false);

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

  // 2. Cute Web Audio Synthesized Soft Squeak/Boing on Wakppu squish
  const playSquishSound = () => {
    try {
      if (typeof window !== "undefined" && (window.AudioContext || (window as any).webkitAudioContext)) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        // cute pitch glide (Boing!)
        osc.frequency.setValueAtTime(420, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(780, ctx.currentTime + 0.08);
        osc.frequency.exponentialRampToValueAtTime(520, ctx.currentTime + 0.16);

        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.18);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.18);
      }
    } catch (e) {
      // Audio not permitted or supported, silent fallback
    }
  };

  // 3. Squishy Particle & Tap Interaction
  const handleSquish = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;

    playSquishSound();
    setSquishCount((prev) => prev + 1);
    setIsSquishing(true);
    setTimeout(() => setIsSquishing(false), 260);

    // Spawn floating cute particles
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const emojis = ["🐾", "✨", "💖", "🧸", "⭐", "🐯", "💫"];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

    const newParticle: Particle = {
      id: Date.now() + Math.random(),
      x: clickX,
      y: clickY,
      emoji: randomEmoji,
    };

    setParticles((prev) => [...prev.slice(-6), newParticle]);

    // Clean up particle after animation
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
    }, 900);
  };

  return (
    <div className="flex flex-col items-center select-none">
      {/* Speech / Mood Bubble */}
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="relative mb-3 px-4 py-2.5 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border-2 border-ku-crimson/20 max-w-[340px] text-center"
      >
        <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-ku-crimson mb-0.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" style={{ animationDuration: "4s" }} />
          <span>호랑이 아바타의 성향</span>
        </div>
        <p className="text-sm font-semibold text-slate-800 leading-snug">
          &quot;{config.speechQuote}&quot;
        </p>
        {/* Arrow */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-r-2 border-b-2 border-ku-crimson/20" />
      </motion.div>

      {/* Main Squishy Wakppu Canvas */}
      <div className="relative group">
        {/* Floating Particles on Click */}
        <AnimatePresence>
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 1, scale: 0.6, x: p.x - 14, y: p.y - 14 }}
              animate={{
                opacity: 0,
                scale: 1.6,
                y: p.y - 70,
                x: p.x + (Math.random() * 40 - 20),
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.85, ease: "easeOut" }}
              className="absolute pointer-events-none z-30 text-2xl"
            >
              {p.emoji}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Squishy / Stretchy Animated Container */}
        <motion.div
          animate={
            isSquishing
              ? {
                  scaleX: [1, 1.22, 0.88, 1.08, 1],
                  scaleY: [1, 0.78, 1.18, 0.94, 1],
                  y: [0, 8, -6, 2, 0],
                  rotate: [0, -2, 2, -1, 0],
                }
              : {
                  y: [0, -5, 0],
                  scaleX: [1, 1.015, 1],
                  scaleY: [1, 0.985, 1],
                }
          }
          whileHover={
            interactive
              ? {
                  scale: 1.03,
                  scaleX: 1.04,
                  scaleY: 0.97,
                  transition: { type: "spring", stiffness: 350, damping: 12 },
                }
              : {}
          }
          whileTap={
            interactive
              ? {
                  scaleX: 1.25,
                  scaleY: 0.72,
                  y: 10,
                  transition: { type: "spring", stiffness: 500, damping: 15 },
                }
              : {}
          }
          drag={interactive}
          dragConstraints={{ top: -15, bottom: 15, left: -15, right: 15 }}
          dragElastic={0.35}
          dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
          transition={{
            y: { repeat: Infinity, duration: 3.2, ease: "easeInOut" },
            scaleX: { repeat: Infinity, duration: 3.2, ease: "easeInOut" },
            scaleY: { repeat: Infinity, duration: 3.2, ease: "easeInOut" },
            duration: 0.35,
          }}
          onClick={handleSquish}
          className={`relative rounded-3xl overflow-hidden shadow-2xl transition-shadow cursor-grab active:cursor-grabbing border-4 border-white/90 hover:shadow-ku-crimson/35 bg-slate-900 ${
            interactive ? "touch-none" : ""
          }`}
          style={{
            width: `${size}px`,
            height: `${size}px`,
            maxWidth: "100%",
            aspectRatio: "1/1",
          }}
          title={interactive ? "마우스로 누르거나 당겨보세요! (말랑 쫀득 왁뿌 모션)" : undefined}
        >
          {viewMode === "plush" ? (
            /* 3D Plush Doll Keychain View */
            <div className="relative w-full h-full pointer-events-none">
              <Image
                src={config.plushImageUrl || `/avatars/plush_${config.archetypeId}.png`}
                alt={config.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover transition-transform duration-300"
              />
              {/* Soft Ambient Shadow Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent pointer-events-none" />
            </div>
          ) : (
            /* Vector SVG View */
            <svg
              viewBox="0 0 400 400"
              className="w-full h-full pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <BackgroundLayer config={config} />
              <EffectsLayer config={config} />
              <TigerEarsLayer config={config} />
              <HeadAndFaceLayer config={config} />
              <EyesLayer config={config} isBlinking={isBlinking} />
              <MouthLayer config={config} isTalking={false} mouthFrame={0} />
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
              className="absolute top-3 left-3 bg-black/65 hover:bg-black/85 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-white flex items-center gap-1.5 shadow-md transition-all hover:scale-105 pointer-events-auto"
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

          {/* Interactive Wakppu Tactile Badge on bottom left */}
          {interactive && (
            <div className="absolute bottom-3 left-3 bg-black/65 backdrop-blur-md px-3 py-1 rounded-full text-[11px] text-white flex items-center gap-1.5 shadow-md pointer-events-none">
              <Hand className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
              <span className="font-semibold text-amber-200">
                {squishCount > 0 ? `말랑 왁뿌 x${squishCount}` : "꾹꾹 누르고 당겨봐!"}
              </span>
            </div>
          )}

          {/* Dynamic College / KU Badge on top right */}
          <div className="absolute top-3 right-3 bg-ku-crimson/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black text-white shadow-md flex items-center gap-1 pointer-events-none">
            <span>{config.customOverlay?.collegeBadge || "🐯 KU 2026"}</span>
          </div>

          {/* Dynamic Interest Tags Overlay on bottom right */}
          {config.customOverlay?.interestKeywords && config.customOverlay.interestKeywords.length > 0 && (
            <div className="absolute bottom-3 right-3 flex flex-wrap justify-end gap-1 max-w-[180px] pointer-events-none">
              {config.customOverlay.interestKeywords.map((kw, idx) => (
                <span
                  key={idx}
                  className="bg-amber-400/90 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-black text-slate-950 shadow-sm"
                >
                  #{kw}
                </span>
              ))}
            </div>
          )}
        </motion.div>

        {/* Action button beside avatar */}
        {onRefresh && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRefresh();
            }}
            className="absolute -top-2 -right-2 p-2 bg-white rounded-full shadow-lg border border-slate-200 text-slate-600 hover:text-ku-crimson hover:rotate-180 transition-all duration-300 pointer-events-auto"
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
