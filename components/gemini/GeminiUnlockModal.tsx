"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, ShieldCheck, Zap, Award } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export const GeminiUnlockModal: React.FC = () => {
  const { showLoginModal, setShowLoginModal, loginWithGoogle, isLoading } = useAuth();

  if (!showLoginModal) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-rose-100 overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={() => setShowLoginModal(false)}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Icon */}
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 via-rose-500 to-ku-crimson text-white mb-5 shadow-lg mx-auto">
            <Sparkles className="w-7 h-7 animate-pulse" />
          </div>

          <div className="text-center mb-6">
            <span className="inline-block px-3 py-1 bg-amber-50 text-amber-800 text-xs font-extrabold rounded-full mb-2 border border-amber-200">
              Google Gemini × 고려대학교
            </span>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              Gemini로 나만의 AI 심층 코멘트 열기
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Google 계정으로 간편 로그인하고, 호랑이 AI가 분석한 맞춤형 동아리 시너지와 캠퍼스 라이프 꿀팁을 확인하세요!
            </p>
          </div>

          {/* Value Props */}
          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <Zap className="w-4 h-4 text-ku-crimson shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-bold text-slate-800">1:1 개인화 성향 & 시너지 분석</p>
                <p className="text-slate-500 text-[11px]">내 동아리 취향과 단과대에 최적화된 심층 AI 리뷰</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <Award className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-bold text-slate-800">2학기 안암골 캠퍼스 실전 꿀팁</p>
                <p className="text-slate-500 text-[11px]">중앙광장, 하나스퀘어 등 활동 장소 연계 꿀팁 제공</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-bold text-slate-800">안전하고 빠른 간편 로그인</p>
                <p className="text-slate-500 text-[11px]">별도 비밀번호 생성 없이 Google 인증으로 즉시 언락</p>
              </div>
            </div>
          </div>

          {/* Login CTA Button */}
          <button
            onClick={loginWithGoogle}
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-slate-900 hover:bg-ku-crimson text-white rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-ku-crimson/30 active:scale-[0.98] disabled:opacity-70"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Google 계정 연동 중...</span>
              </span>
            ) : (
              <>
                {/* Google G Logo SVG */}
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Google 계정으로 계속하기</span>
              </>
            )}
          </button>

          <p className="text-[10px] text-slate-400 text-center mt-3">
            로그인 시 서비스 이용약관 및 개인정보 처리방침에 동의하게 됩니다.
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
