"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Link as LinkIcon,
  Share2,
  Check,
  X,
  Sparkles,
  MessageCircle,
  Instagram,
  Camera,
} from "lucide-react";
import { AvatarConfiguration } from "@/lib/avatarEngine";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  avatar: AvatarConfiguration;
  cardRef?: React.RefObject<HTMLDivElement>;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  avatar,
  cardRef,
}) => {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadMode, setDownloadMode] = useState<"card" | "story" | null>(null);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      const shareUrl = typeof window !== "undefined" ? window.location.href : "";
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error("Failed to copy link", e);
    }
  };

  const handleDownloadImage = async (mode: "card" | "story") => {
    setIsDownloading(true);
    setDownloadMode(mode);
    try {
      const { toPng } = await import("html-to-image");
      const targetElement =
        mode === "story"
          ? document.getElementById("insta-story-export")
          : cardRef?.current || document.getElementById("avatar-card-export");

      if (targetElement) {
        const dataUrl = await toPng(targetElement, {
          quality: 0.95,
          pixelRatio: 2,
          backgroundColor: mode === "story" ? "#8A1538" : "#ffffff",
        });

        const link = document.createElement("a");
        link.download =
          mode === "story"
            ? `고대_인스타스토리_${avatar.title.replace(/\s+/g, "_")}.png`
            : `고대동아리아바타_${avatar.title.replace(/\s+/g, "_")}.png`;
        link.href = dataUrl;
        link.click();
      }
    } catch (e) {
      console.error("Failed to download image", e);
    } finally {
      setIsDownloading(false);
      setDownloadMode(null);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `[고려대 동아리 아바타] ${avatar.title}`,
          text: `나랑 닮은 호랑이 아바타와 2학기 찰떡 동아리 찾았다! 🐯 "${avatar.speechQuote}"`,
          url: window.location.href,
        });
      } catch (e) {
        // User cancelled or unsupported
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-100"
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-5">
            <div className="w-12 h-12 rounded-2xl bg-ku-soft text-ku-crimson flex items-center justify-center mx-auto mb-2.5">
              <Share2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900">결과 공유 & 저장</h3>
            <p className="text-xs text-slate-500 mt-1">
              에브리타임, 카카오톡, 인스타 스토리에 내 호랑이를 자랑해보세요!
            </p>
          </div>

          <div className="space-y-2.5">
            {/* 1-Tap Kakao / Native Share */}
            <button
              onClick={handleNativeShare}
              className="w-full py-3.5 px-4 bg-[#FEE500] hover:bg-[#FADA0A] active:scale-98 text-[#191919] rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>카카오톡 / 친구에게 바로 공유하기</span>
            </button>

            {/* Instagram Story 9:16 Download button */}
            <button
              onClick={() => handleDownloadImage("story")}
              disabled={isDownloading}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 hover:opacity-95 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 disabled:opacity-70"
            >
              {isDownloading && downloadMode === "story" ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>스토리 이미지 생성 중...</span>
                </span>
              ) : (
                <>
                  <Instagram className="w-4 h-4" />
                  <span>📸 인스타 스토리용(9:16) 1초 저장</span>
                </>
              )}
            </button>

            {/* Square/Card Download button */}
            <button
              onClick={() => handleDownloadImage("card")}
              disabled={isDownloading}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-70"
            >
              {isDownloading && downloadMode === "card" ? (
                <span>생성 중...</span>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-slate-600" />
                  <span>결과 카드 다운로드 (PNG)</span>
                </>
              )}
            </button>

            {/* Copy Link button */}
            <button
              onClick={handleCopyLink}
              className="w-full py-2.5 px-4 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-extrabold">링크가 복사되었습니다!</span>
                </>
              ) : (
                <>
                  <LinkIcon className="w-3.5 h-3.5 text-slate-500" />
                  <span>결과 링크 복사하기</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-center">
            <p className="text-[10px] text-slate-400">
              🐯 2026-2학기 고려대학교 공식 & 중앙동아리 매칭
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
