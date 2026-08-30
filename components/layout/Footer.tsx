import React from "react";
import Link from "next/link";
import { Sparkles, ExternalLink } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-slate-950 text-slate-400 py-8 border-t border-slate-800/80 text-xs">
      <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Navigation Links */}
        <div className="flex items-center gap-6 text-xs font-semibold">
          <Link href="/" className="hover:text-white transition-colors">
            홈
          </Link>
          <Link href="/about" className="hover:text-white transition-colors">
            소개
          </Link>
          <a
            href="https://klub.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
          >
            <span>klub.kr 공식 동아리</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Powered by Google Gemini */}
        <div className="flex items-center gap-1.5 text-slate-400 text-xs">
          <span>Powered by</span>
          <span className="font-bold text-amber-400 inline-flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Google Gemini
          </span>
        </div>
      </div>
    </footer>
  );
};
