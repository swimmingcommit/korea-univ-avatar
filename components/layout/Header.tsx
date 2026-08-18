"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Compass, Info, User, LogOut, Sliders } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export const Header: React.FC = () => {
  const { user, isLoggedIn, logout, setShowLoginModal } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/85 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-ku-crimson flex items-center justify-center text-white font-black text-xl shadow-md group-hover:scale-105 transition-transform">
            🐯
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-lg font-black text-slate-900 tracking-tight">
                고대 동아리 <span className="text-ku-crimson">아바타</span>
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium -mt-1">
              KU Club Avatar & Gemini Recommender
            </p>
          </div>
        </Link>

        {/* Nav actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/create"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-ku-soft text-ku-crimson hover:bg-ku-crimson hover:text-white transition-colors text-xs font-bold"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>아바타 만들기</span>
          </Link>

          <Link
            href="/admin"
            className="p-2 rounded-full text-slate-600 hover:text-ku-crimson hover:bg-slate-50 transition-colors"
            title="동아리 데이터 관리 스튜디오"
          >
            <Sliders className="w-4 h-4" />
          </Link>

          <Link
            href="/about"
            className="p-2 rounded-full text-slate-600 hover:text-ku-crimson hover:bg-slate-50 transition-colors"
            title="서비스 및 Gemini 소개"
          >
            <Info className="w-5 h-5" />
          </Link>

          {/* Auth Button */}
          {isLoggedIn ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200/60 rounded-full text-xs font-bold text-amber-900">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span className="max-w-[70px] truncate">{user?.name}</span>
              </div>
              <button
                onClick={logout}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full transition-colors"
                title="로그아웃"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-ku-crimson text-white text-xs font-bold transition-all shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Gemini 로그인</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
