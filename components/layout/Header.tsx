"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Compass, Info, User, LogOut, Sliders } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export const Header: React.FC = () => {
  const { user, isLoggedIn, logout, setShowLoginModal } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-ku-crimson flex items-center justify-center text-white font-black text-lg sm:text-xl shadow-md group-hover:scale-105 transition-transform">
            🐯
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                고대 동아리 <span className="text-ku-crimson">아바타</span>
              </span>
            </div>
            <p className="hidden sm:block text-[10px] text-slate-500 font-medium -mt-1">
              KU Club Avatar & Recommender
            </p>
          </div>
        </Link>

        {/* Nav actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <Link
            href="/create"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-ku-soft text-ku-crimson hover:bg-ku-crimson hover:text-white transition-colors text-xs font-bold"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>아바타 만들기</span>
          </Link>

          <Link
            href="/admin"
            className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 transition-colors text-[11px] sm:text-xs font-bold"
            title="우리 동아리 등록 및 관리 스튜디오"
          >
            <span>📢 <span className="hidden xs:inline">동아리</span> 등록</span>
          </Link>

          <Link
            href="/about"
            className="p-1.5 sm:p-2 rounded-full text-slate-600 hover:text-ku-crimson hover:bg-slate-50 transition-colors"
            title="서비스 소개"
          >
            <Info className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>

          {/* Auth Button */}
          {isLoggedIn ? (
            <div className="flex items-center gap-1.5 sm:gap-2 pl-1.5 sm:pl-2 border-l border-slate-200">
              <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 border border-amber-200/60 rounded-full text-[11px] font-bold text-amber-900">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span className="max-w-[50px] sm:max-w-[70px] truncate">{user?.name}</span>
              </div>
              <button
                onClick={logout}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-full transition-colors"
                title="로그아웃"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-xs font-bold transition-all"
            >
              <User className="w-3.5 h-3.5" />
              <span>로그인</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
