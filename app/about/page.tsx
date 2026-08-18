"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, Zap, Heart, Compass, ExternalLink } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-10">
      {/* Title */}
      <div className="text-center space-y-3">
        <span className="inline-block px-3.5 py-1 bg-ku-soft text-ku-crimson text-xs font-black rounded-full">
          ABOUT THE PROJECT
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          고려대 동아리 아바타 & Gemini AI
        </h1>
        <p className="text-sm text-slate-600 max-w-lg mx-auto">
          2026년 2학기 개강 시즌을 맞아 고려대학교 학우들의 즐거운 캠퍼스 라이프와 동아리 탐색을 돕기 위해 만들어진 프로젝트입니다.
        </p>
      </div>

      {/* Content Cards */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100 space-y-8">
        {/* Section 1 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-ku-crimson font-black text-base">
            <span className="w-8 h-8 rounded-xl bg-ku-soft flex items-center justify-center text-lg">🐯</span>
            <span>왜 &apos;동아리 아바타&apos;인가요?</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            단순히 동아리 목록을 검색하는 것을 넘어, 자신의 취향과 활동 성향에 따라 달라지는 <strong className="text-slate-900">나만의 호랑이 캐릭터 아바타</strong>를 소장하고 공유하는 즐거움을 제공합니다.
            살아 움직이는 인터랙티브 왁뿌 모션과 립싱크 음성 재생으로 캠퍼스의 에너지를 느낄 수 있습니다.
          </p>
        </div>

        {/* Section 2 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-indigo-600 font-black text-base">
            <span className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-lg">✨</span>
            <span>Google Gemini AI와의 시너지</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            구글의 최신 생성형 AI 모델 <strong className="text-slate-900">Gemini 1.5 Flash</strong>를 연동하여, 단순한 규칙 기반 추천을 넘어 사용자의 단과대, 관심사, 성향 퀴즈 결과를 종합 분석한 <strong className="text-slate-900">1:1 맞춤 심층 분석 리포트</strong>를 제공합니다.
          </p>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-600 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Gemini 연동 주요 기능:</span>
            </div>
            <p>• 학우의 성향 및 아바타 캐릭터에 대한 칭찬과 핵심 성향 분석</p>
            <p>• 1순위 추천 동아리와 나의 구체적 케미스트리 및 활동 시너지 제시</p>
            <p>• 중앙광장, 하나스퀘어, 참살이길 등 고려대 캠퍼스 연계 실전 꿀팁 제공</p>
          </div>
        </div>

        {/* Section 3: Data & Disclaimer */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-emerald-700 font-black text-base">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>데이터 및 저작권 안내</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            동아리 추천에 사용된 데이터는 공식 동아리 연합회 및 klub.kr에 공개된 카테고리 체계를 참고하여 자체 재작성된 요약본을 사용하고 있습니다.
            상세한 지원 일정, 회비, 선발 방식 등은 각 동아리 공식 채널 및 klub.kr 링크를 통해 확인해 주시기 바랍니다.
          </p>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center pt-2">
        <Link
          href="/create"
          className="inline-flex items-center gap-2 px-8 py-4 bg-ku-crimson hover:bg-ku-dark text-white font-black text-sm rounded-2xl shadow-xl hover:scale-105 transition-all"
        >
          <span>지금 바로 내 아바타 만들기</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
