"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 sm:py-16 space-y-8">
      {/* 1/4: 상단 제목 */}
      <div className="text-center space-y-3">
        <span className="inline-block px-3.5 py-1 bg-ku-soft text-ku-crimson text-xs font-black rounded-full shadow-xs">
          ABOUT THE PROJECT
        </span>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-snug">
          고대생들을 위한 동아리 추천 시스템{" "}
          <span className="text-blue-600 block sm:inline text-xl sm:text-2xl md:text-3xl font-extrabold">
            (with Google AI)
          </span>
        </h1>
      </div>

      {/* Main Card Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#EDE4D8] space-y-6">
        {/* 2/4: 하단 본문 (개요 설명) */}
        <div className="space-y-2 pb-6 border-b border-slate-100">
          <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed">
            2학기 개강 시즌을 맞아 고려대 학우들의 동아리 탐색을 돕기 위해 만들어진 웹사이트입니다.
          </p>
        </div>

        {/* 3/4: 데이터 및 저작권 안내 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-emerald-800 font-black text-base">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>데이터 및 저작권 안내</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            동아리 추천에 사용된 데이터는 공식 동아리 연합회 및 klub.kr에 공개된 카테고리 체계를 참고하여 자체 재작성된 요약본을 사용하고 있습니다. 상세한 지원 일정, 회비, 선발 방식 등은 각 동아리 공식 채널 및 klub.kr 링크를 통해 확인해 주시기 바랍니다.
          </p>
        </div>
      </div>

      {/* 4/4: 홈 연결 버튼 */}
      <div className="text-center pt-4">
        <Link
          href="/create"
          className="inline-flex items-center justify-center gap-2.5 px-9 py-4 bg-ku-crimson hover:bg-ku-dark text-white font-black text-base rounded-2xl shadow-xl hover:shadow-ku-crimson/30 hover:scale-[1.02] active:scale-[0.98] transition-all group"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>지금 바로 동아리 추천받기</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
