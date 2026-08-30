"use client";

import React from "react";

interface ClubCertifiedStampProps {
  className?: string;
  size?: number;
}

export const ClubCertifiedStamp: React.FC<ClubCertifiedStampProps> = ({
  className = "",
  size = 96,
}) => {
  return (
    <div
      className={`inline-block select-none pointer-events-none transform -rotate-12 transition-transform hover:rotate-0 duration-300 ${className}`}
      title="고려대학교 동아리 공식 인증"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-crimson drop-shadow-sm opacity-90"
      >
        {/* Outer Circular Rings with Stamp Texture Effect */}
        <circle
          cx="60"
          cy="60"
          r="56"
          stroke="#7A1626"
          strokeWidth="2.5"
          strokeDasharray="5 2"
          strokeOpacity="0.85"
        />
        <circle
          cx="60"
          cy="60"
          r="50"
          stroke="#7A1626"
          strokeWidth="1.5"
          strokeOpacity="0.75"
        />
        <circle
          cx="60"
          cy="60"
          r="38"
          stroke="#7A1626"
          strokeWidth="1"
          strokeOpacity="0.5"
        />

        {/* Circular text path for top and bottom */}
        <defs>
          <path
            id="stamp-top-arc"
            d="M 22 60 A 38 38 0 0 1 98 60"
            fill="none"
          />
          <path
            id="stamp-bottom-arc"
            d="M 98 60 A 38 38 0 0 1 22 60"
            fill="none"
          />
        </defs>

        <text
          fill="#7A1626"
          fontSize="8.5"
          fontWeight="900"
          letterSpacing="2.5"
          textAnchor="middle"
        >
          <textPath href="#stamp-top-arc" startOffset="50%">
            KOREA UNIV.
          </textPath>
        </text>

        <text
          fill="#7A1626"
          fontSize="7.5"
          fontWeight="800"
          letterSpacing="2"
          textAnchor="middle"
        >
          <textPath href="#stamp-bottom-arc" startOffset="50%">
            ★ 2026-2 CLUB ★
          </textPath>
        </text>

        {/* Center Content: Tiger Head + Official Stamp Box */}
        <g transform="translate(60, 60)">
          {/* Inner Stars */}
          <text
            x="0"
            y="-6"
            textAnchor="middle"
            fill="#7A1626"
            fontSize="14"
          >
            🐯
          </text>
          <rect
            x="-26"
            y="2"
            width="52"
            height="15"
            rx="3"
            fill="#7A1626"
            fillOpacity="0.12"
            stroke="#7A1626"
            strokeWidth="1"
          />
          <text
            x="0"
            y="13"
            textAnchor="middle"
            fill="#7A1626"
            fontSize="8.5"
            fontWeight="900"
            letterSpacing="1"
          >
            공식 인증
          </text>
        </g>
      </svg>
    </div>
  );
};
