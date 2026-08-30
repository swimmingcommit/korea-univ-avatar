"use client";

import React from "react";
import { ArrowUpRight, GraduationCap, Sparkles } from "lucide-react";

interface GeminiStudentBannerProps {
  className?: string;
}

export const GeminiStudentBanner: React.FC<GeminiStudentBannerProps> = ({
  className = "",
}) => {
  const SIGNUP_URL = "https://goo.gle/koreaseoul";

  return (
    <a
      href={SIGNUP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`group block relative overflow-hidden rounded-3xl border border-blue-200/90 bg-gradient-to-br from-white via-[#F0F7FF] to-[#E8F1FD] p-4 sm:p-5 shadow-lg shadow-blue-900/5 hover:shadow-xl hover:shadow-blue-900/15 hover:border-blue-300 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 cursor-pointer ${className}`}
    >
      {/* Subtle Background Glows */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-400/20 rounded-full blur-2xl pointer-events-none group-hover:bg-blue-400/30 transition-colors" />
      <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-indigo-400/15 rounded-full blur-2xl pointer-events-none" />

      {/* Floating Decorative Holographic Stickers */}
      {/* 1. Sparkle Chat Sticker */}
      <div className="absolute -top-1.5 right-20 sm:right-28 w-9 h-9 sm:w-11 sm:h-11 pointer-events-none opacity-85 hidden xs:block animate-float-slow group-hover:rotate-12 transition-transform">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/gemini/sticker_chat_sparkle.png"
          alt="Gemini Chat"
          className="w-full h-full object-contain rotate-6 drop-shadow-sm"
        />
      </div>

      {/* 2. Pixel Dino Sticker */}
      <div className="absolute -bottom-2 right-2 sm:right-5 w-11 h-11 sm:w-13 sm:h-13 pointer-events-none opacity-90 group-hover:scale-110 transition-transform">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/gemini/sticker_dino.png"
          alt="Gemini Dino"
          className="w-full h-full object-contain -rotate-12 drop-shadow-sm group-hover:rotate-0 transition-transform"
        />
      </div>

      <div className="relative z-10 flex items-center justify-between gap-4">
        {/* Left Section: Tape Logo & Info */}
        <div className="flex items-center gap-3 sm:gap-4.5 flex-1 min-w-0">
          {/* #Team Gemini Tape Asset */}
          <div className="shrink-0 w-24 sm:w-28 -rotate-2 drop-shadow-sm group-hover:rotate-0 group-hover:scale-105 transition-transform">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/gemini/team_gemini_tape.png"
              alt="#Team Gemini Google Student Ambassador"
              className="w-full h-auto object-contain"
            />
          </div>

          <div className="space-y-1 min-w-0 flex-1 pr-8 sm:pr-12">
            {/* Category / Badge Row */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] sm:text-[11px] font-black tracking-tight shadow-xs">
                <GraduationCap className="w-3 h-3" />
                <span>대학생 특별 혜택</span>
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold text-blue-700 hidden xs:inline">
                Google Student Ambassador
              </span>
            </div>

            {/* Main Title & Benefit Pill */}
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight group-hover:text-blue-700 transition-colors">
                Google AI Plan for Students
              </h3>
              <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs px-2.5 py-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-bold shadow-xs">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>Google AI Plus 1년 무료</span>
              </span>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed whitespace-pre-line">
              과제 요약 · 논문 분석 · 코딩 디버깅까지,{"\n"}고려대생 전용 AI 혜택을 신청하세요!
            </p>
          </div>
        </div>

        {/* Right Arrow Icon Indicator */}
        <div className="shrink-0 hidden xs:flex items-center justify-center w-8 h-8 rounded-full bg-blue-100/80 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xs">
          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      </div>
    </a>
  );
};
