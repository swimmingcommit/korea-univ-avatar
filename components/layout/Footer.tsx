import React from "react";
import Link from "next/link";
import { Sparkles, ExternalLink, ShieldCheck, Heart } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-slate-900 text-slate-400 py-10 border-t border-slate-800 text-xs">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-ku-crimson flex items-center justify-center text-white font-bold text-lg">
              🐯
            </div>
            <div>
              <p className="text-white font-extrabold text-sm">고려대 동아리 아바타</p>
              <p className="text-[11px] text-slate-500">
                Korea University Club Avatar & Gemini Growth Initiative
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <Link href="/" className="hover:text-white transition-colors">홈</Link>
            <Link href="/create" className="hover:text-white transition-colors">아바타 생성</Link>
            <Link href="/create/quiz" className="hover:text-white transition-colors">성향 퀴즈</Link>
            <Link href="/about" className="hover:text-white transition-colors">소개 & Gemini</Link>
            <a
              href="https://klub.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
            >
              <span>klub.kr 공식 동아리</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>본 서비스의 동아리 기본 정보는 공개 데이터를 기반으로 자체 요약되었으며, 상세 지원은 공식 처를 통해 진행됩니다.</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400">
            <span>Powered by</span>
            <span className="font-bold text-amber-400 inline-flex items-center gap-0.5">
              <Sparkles className="w-3 h-3" /> Google Gemini
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
