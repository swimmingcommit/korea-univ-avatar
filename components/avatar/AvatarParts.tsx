import React from "react";
import { AvatarConfiguration } from "@/lib/avatarEngine";

interface PartProps {
  config: AvatarConfiguration;
  isBlinking?: boolean;
  isTalking?: boolean;
  mouthFrame?: number; // 0: closed, 1: half, 2: wide open
}

export const BackgroundLayer: React.FC<PartProps> = ({ config }) => {
  const type = config.parts.backgroundType;

  switch (type) {
    case "hana_square":
      return (
        <g id="bg-hana">
          <defs>
            <linearGradient id="hanaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E1B4B" />
              <stop offset="50%" stopColor="#312E81" />
              <stop offset="100%" stopColor="#4338CA" />
            </linearGradient>
            <pattern id="gridPattern" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="400" height="400" rx="28" fill="url(#hanaGrad)" />
          <rect width="400" height="400" rx="28" fill="url(#gridPattern)" />
          <circle cx="200" cy="180" r="140" fill="rgba(99, 102, 241, 0.25)" filter="blur(30px)" />
          {/* Glass pyramid motif */}
          <path d="M120 340 L200 240 L280 340 Z" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
        </g>
      );
    case "festival_stage":
      return (
        <g id="bg-festival">
          <defs>
            <linearGradient id="stageGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4C0519" />
              <stop offset="50%" stopColor="#831843" />
              <stop offset="100%" stopColor="#1E1B4B" />
            </linearGradient>
          </defs>
          <rect width="400" height="400" rx="28" fill="url(#stageGrad)" />
          {/* Spotlight beams */}
          <polygon points="50,0 120,0 260,400 100,400" fill="rgba(253, 224, 71, 0.15)" />
          <polygon points="350,0 280,0 140,400 300,400" fill="rgba(244, 63, 94, 0.2)" />
          <circle cx="200" cy="160" r="130" fill="rgba(244, 63, 94, 0.3)" filter="blur(35px)" />
        </g>
      );
    case "library":
      return (
        <g id="bg-library">
          <defs>
            <linearGradient id="libGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#292524" />
              <stop offset="100%" stopColor="#44403C" />
            </linearGradient>
          </defs>
          <rect width="400" height="400" rx="28" fill="url(#libGrad)" />
          {/* Bookshelf arch silhouette */}
          <path d="M40 380 L40 100 Q200 40 360 100 L360 380 Z" fill="rgba(255,255,255,0.06)" />
          <line x1="60" y1="180" x2="340" y2="180" stroke="rgba(217, 119, 6, 0.3)" strokeWidth="3" />
          <line x1="60" y1="280" x2="340" y2="280" stroke="rgba(217, 119, 6, 0.3)" strokeWidth="3" />
          <circle cx="200" cy="170" r="120" fill="rgba(245, 158, 11, 0.18)" filter="blur(40px)" />
        </g>
      );
    case "anam_street":
      return (
        <g id="bg-anam">
          <defs>
            <linearGradient id="anamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0F172A" />
              <stop offset="50%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>
          </defs>
          <rect width="400" height="400" rx="28" fill="url(#anamGrad)" />
          {/* City Bokeh circles */}
          <circle cx="80" cy="100" r="40" fill="rgba(239, 68, 68, 0.3)" filter="blur(20px)" />
          <circle cx="320" cy="120" r="50" fill="rgba(245, 158, 11, 0.3)" filter="blur(25px)" />
          <circle cx="200" cy="220" r="70" fill="rgba(168, 85, 247, 0.25)" filter="blur(30px)" />
          <circle cx="100" cy="280" r="35" fill="rgba(59, 130, 246, 0.3)" filter="blur(15px)" />
        </g>
      );
    case "club_room":
      return (
        <g id="bg-club">
          <defs>
            <linearGradient id="clubGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#78350F" />
              <stop offset="50%" stopColor="#92400E" />
              <stop offset="100%" stopColor="#451A03" />
            </linearGradient>
          </defs>
          <rect width="400" height="400" rx="28" fill="url(#clubGrad)" />
          <circle cx="200" cy="180" r="130" fill="rgba(253, 224, 71, 0.22)" filter="blur(30px)" />
          {/* Fairy light line */}
          <path d="M30 70 Q110 110 200 70 T370 70" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
          <circle cx="70" cy="85" r="4" fill="#FDE047" />
          <circle cx="130" cy="92" r="4" fill="#F43F5E" />
          <circle cx="200" cy="70" r="4" fill="#60A5FA" />
          <circle cx="270" cy="88" r="4" fill="#4ADE80" />
          <circle cx="330" cy="80" r="4" fill="#FDE047" />
        </g>
      );
    case "central_plaza":
    default:
      return (
        <g id="bg-plaza">
          <defs>
            <linearGradient id="plazaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4C0519" />
              <stop offset="60%" stopColor="#862633" />
              <stop offset="100%" stopColor="#1E293B" />
            </linearGradient>
          </defs>
          <rect width="400" height="400" rx="28" fill="url(#plazaGrad)" />
          {/* Main Hall (본관) Gothic silhouette outline */}
          <path
            d="M80 360 L80 250 L120 250 L120 200 L160 200 L160 170 L200 130 L240 170 L240 200 L280 200 L280 250 L320 250 L320 360 Z"
            fill="rgba(0,0,0,0.22)"
          />
          {/* Gothic Clock Tower details */}
          <circle cx="200" cy="185" r="12" fill="rgba(255, 215, 0, 0.4)" />
          <circle cx="200" cy="185" r="4" fill="#FFFFFF" />
          <circle cx="200" cy="160" r="140" fill="rgba(255, 255, 255, 0.12)" filter="blur(35px)" />
        </g>
      );
  }
};

export const EffectsLayer: React.FC<PartProps> = ({ config }) => {
  const effect = config.parts.effectType;

  switch (effect) {
    case "code_binary":
      return (
        <g id="fx-code" opacity="0.75" fill="#38BDF8" fontFamily="monospace" fontSize="13" fontWeight="bold">
          <text x="35" y="80">&lt;code/&gt;</text>
          <text x="310" y="110">0101</text>
          <text x="45" y="290">git commit</text>
          <text x="300" y="270">&#123; AI: 1 &#125;</text>
          <text x="40" y="180">npm run</text>
          <text x="325" y="190">=&gt; KU</text>
        </g>
      );
    case "music_notes":
      return (
        <g id="fx-music" opacity="0.85" fill="#F43F5E">
          <path d="M45 100 A6 6 0 1 1 39 106 L39 80 L60 74 L60 95 A6 6 0 1 1 54 101" />
          <path d="M330 90 A6 6 0 1 1 324 96 L324 70 L345 64 L345 85 A6 6 0 1 1 339 91" fill="#FBBF24" />
          <path d="M40 260 A7 7 0 1 1 33 267 L33 240 L50 235 L50 255 A7 7 0 1 1 43 262" fill="#38BDF8" />
          <text x="325" y="270" fontSize="24" fill="#A855F7">♬</text>
        </g>
      );
    case "fire_passion":
      return (
        <g id="fx-fire" opacity="0.8">
          <circle cx="50" cy="110" r="10" fill="#EF4444" filter="blur(3px)" />
          <circle cx="65" cy="95" r="6" fill="#F59E0B" filter="blur(2px)" />
          <circle cx="340" cy="120" r="12" fill="#EF4444" filter="blur(3px)" />
          <circle cx="325" cy="100" r="7" fill="#F59E0B" filter="blur(2px)" />
          <circle cx="45" cy="270" r="8" fill="#DC2626" filter="blur(2px)" />
          <circle cx="345" cy="260" r="10" fill="#F97316" filter="blur(2px)" />
        </g>
      );
    case "heart_vibe":
      return (
        <g id="fx-heart" opacity="0.85" fill="#EC4899">
          <path d="M50 90 C50 82 40 78 35 84 C30 78 20 82 20 90 C20 102 35 110 35 110 C35 110 50 102 50 90 Z" />
          <path d="M360 110 C360 102 350 98 345 104 C340 98 330 102 330 110 C330 122 345 130 345 130 C345 130 360 122 360 110 Z" fill="#F43F5E" />
          <circle cx="40" cy="260" r="6" fill="#FB7185" />
          <circle cx="350" cy="270" r="8" fill="#F472B6" />
        </g>
      );
    case "sparkles":
    default:
      return (
        <g id="fx-sparkles" fill="#FDE047" opacity="0.9">
          {/* Star 1 */}
          <path d="M55 90 L58 100 L68 103 L58 106 L55 116 L52 106 L42 103 L52 100 Z" />
          {/* Star 2 */}
          <path d="M335 100 L337 108 L345 110 L337 112 L335 120 L333 112 L325 110 L333 108 Z" fill="#FFFFFF" />
          {/* Star 3 */}
          <path d="M45 270 L47 275 L52 277 L47 279 L45 284 L43 279 L38 277 L43 275 Z" fill="#FFFFFF" />
          {/* Star 4 */}
          <path d="M340 250 L343 258 L351 260 L343 262 L340 270 L337 262 L329 260 L337 258 Z" />
        </g>
      );
  }
};

export const TigerEarsLayer: React.FC<PartProps> = () => {
  return (
    <g id="tiger-ears">
      {/* Left Ear */}
      <path
        d="M125 120 C100 80 115 50 145 65 C155 70 155 95 145 120 Z"
        fill="#FBBF24"
        stroke="#D97706"
        strokeWidth="3"
      />
      {/* Left Ear Inner Pink */}
      <path d="M125 100 C115 80 125 68 140 75 C145 80 145 95 135 105 Z" fill="#F472B6" />

      {/* Right Ear */}
      <path
        d="M275 120 C300 80 285 50 255 65 C245 70 245 95 255 120 Z"
        fill="#FBBF24"
        stroke="#D97706"
        strokeWidth="3"
      />
      {/* Right Ear Inner Pink */}
      <path d="M275 100 C285 80 275 68 260 75 C255 80 255 95 265 105 Z" fill="#F472B6" />
    </g>
  );
};

export const HeadAndFaceLayer: React.FC<PartProps> = ({ config }) => {
  return (
    <g id="head-base">
      {/* Cute Head Outline (Chibi Feline Oval) */}
      <ellipse cx="200" cy="180" rx="88" ry="78" fill="#FDE047" stroke="#D97706" strokeWidth="3.5" />

      {/* Tiger Cheek Stripes */}
      <g fill="#92400E" opacity="0.85">
        {/* Left Cheek Stripes */}
        <path d="M116 172 L132 175 L118 180 Z" />
        <path d="M115 186 L130 188 L117 194 Z" />

        {/* Right Cheek Stripes */}
        <path d="M284 172 L268 175 L282 180 Z" />
        <path d="M285 186 L270 188 L283 194 Z" />

        {/* Forehead Mark (King/Tiger Crown mark 王) */}
        <path d="M190 120 L210 120 M193 127 L207 127 M188 134 L212 134 M200 120 L200 134" stroke="#92400E" strokeWidth="2.5" strokeLinecap="round" />
      </g>

      {/* Cute Blush */}
      <ellipse cx="145" cy="195" rx="14" ry="8" fill="#FB7185" opacity="0.6" />
      <ellipse cx="255" cy="195" rx="14" ry="8" fill="#FB7185" opacity="0.6" />

      {/* Cute Little Tiger Nose */}
      <polygon points="196,182 204,182 200,187" fill="#F43F5E" />
    </g>
  );
};

export const EyesLayer: React.FC<PartProps> = ({ config, isBlinking }) => {
  const eyeType = config.parts.eyeType;

  if (isBlinking) {
    return (
      <g id="eyes-blinking" stroke="#451A03" strokeWidth="4" strokeLinecap="round" fill="none">
        <path d="M152 178 Q165 188 178 178" />
        <path d="M222 178 Q235 188 248 178" />
      </g>
    );
  }

  switch (eyeType) {
    case "friendly":
      return (
        <g id="eyes-friendly" stroke="#451A03" strokeWidth="4.5" strokeLinecap="round" fill="none">
          {/* Crescent Happy Eyes ^^ */}
          <path d="M150 178 Q165 162 180 178" />
          <path d="M220 178 Q235 162 250 178" />
        </g>
      );
    case "focused":
      return (
        <g id="eyes-focused">
          {/* Eyebrows */}
          <path d="M148 160 L178 166" stroke="#451A03" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M252 160 L222 166" stroke="#451A03" strokeWidth="3.5" strokeLinecap="round" />
          {/* Big Focused Eyes */}
          <ellipse cx="165" cy="176" rx="12" ry="14" fill="#1F2937" />
          <ellipse cx="235" cy="176" rx="12" ry="14" fill="#1F2937" />
          <circle cx="168" cy="172" r="4.5" fill="#FFFFFF" />
          <circle cx="238" cy="172" r="4.5" fill="#FFFFFF" />
          {/* Smart Glasses */}
          <rect x="145" y="162" width="40" height="28" rx="8" fill="none" stroke="#862633" strokeWidth="3" />
          <rect x="215" y="162" width="40" height="28" rx="8" fill="none" stroke="#862633" strokeWidth="3" />
          <line x1="185" y1="174" x2="215" y2="174" stroke="#862633" strokeWidth="3" />
        </g>
      );
    case "winking":
      return (
        <g id="eyes-winking">
          {/* Left Eye Open */}
          <ellipse cx="165" cy="175" rx="13" ry="15" fill="#1F2937" />
          <circle cx="169" cy="171" r="5" fill="#FFFFFF" />
          <circle cx="162" cy="180" r="2.5" fill="#FFFFFF" />
          {/* Right Eye Winking */}
          <path d="M222 176 Q235 186 248 176" stroke="#451A03" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          {/* Eyebrows */}
          <path d="M152 158 Q165 154 178 160" stroke="#451A03" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M222 160 Q235 154 248 158" stroke="#451A03" strokeWidth="3" strokeLinecap="round" fill="none" />
        </g>
      );
    case "confident":
      return (
        <g id="eyes-confident">
          {/* Eyebrows */}
          <path d="M150 158 L180 165" stroke="#451A03" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M250 158 L220 165" stroke="#451A03" strokeWidth="3.5" strokeLinecap="round" />
          {/* Sharp Cool Eyes */}
          <ellipse cx="165" cy="175" rx="14" ry="13" fill="#1F2937" />
          <ellipse cx="235" cy="175" rx="14" ry="13" fill="#1F2937" />
          <circle cx="168" cy="172" r="5" fill="#FFFFFF" />
          <circle cx="238" cy="172" r="5" fill="#FFFFFF" />
        </g>
      );
    case "energetic":
    default:
      return (
        <g id="eyes-energetic">
          {/* Eyebrows */}
          <path d="M150 156 Q165 150 180 158" stroke="#451A03" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <path d="M220 158 Q235 150 250 156" stroke="#451A03" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          {/* Sparkly Big Anime Eyes */}
          <ellipse cx="165" cy="175" rx="14" ry="16" fill="#1E293B" />
          <ellipse cx="235" cy="175" rx="14" ry="16" fill="#1E293B" />
          {/* Primary & Secondary Sparkle */}
          <circle cx="169" cy="170" r="5.5" fill="#FFFFFF" />
          <circle cx="162" cy="181" r="3" fill="#FFFFFF" />
          <circle cx="239" cy="170" r="5.5" fill="#FFFFFF" />
          <circle cx="232" cy="181" r="3" fill="#FFFFFF" />
        </g>
      );
  }
};

export const MouthLayer: React.FC<PartProps> = ({ config, isTalking, mouthFrame = 0 }) => {
  const mouthType = config.parts.mouthType;

  if (isTalking) {
    if (mouthFrame === 2) {
      // Wide open talking
      return (
        <g id="mouth-talking-wide">
          <ellipse cx="200" cy="202" rx="14" ry="12" fill="#BE123C" stroke="#451A03" strokeWidth="2.5" />
          <ellipse cx="200" cy="207" rx="9" ry="6" fill="#F43F5E" />
          {/* Cute Tiger Fang */}
          <polygon points="193,193 197,193 195,198" fill="#FFFFFF" />
          <polygon points="203,193 207,193 205,198" fill="#FFFFFF" />
        </g>
      );
    } else if (mouthFrame === 1) {
      // Half open talking
      return (
        <g id="mouth-talking-half">
          <path d="M190 196 Q200 210 210 196 Z" fill="#BE123C" stroke="#451A03" strokeWidth="2.5" />
          <polygon points="194,196 198,196 196,199" fill="#FFFFFF" />
        </g>
      );
    } else {
      // Closed mouth during talk
      return (
        <g id="mouth-talking-closed" stroke="#451A03" strokeWidth="3" strokeLinecap="round" fill="none">
          <path d="M190 196 Q195 200 200 196 Q205 200 210 196" />
        </g>
      );
    }
  }

  switch (mouthType) {
    case "laugh":
      return (
        <g id="mouth-laugh">
          <path d="M188 194 Q200 216 212 194 Z" fill="#BE123C" stroke="#451A03" strokeWidth="2.5" />
          <ellipse cx="200" cy="205" rx="8" ry="4" fill="#FB7185" />
          <polygon points="193,194 197,194 195,198" fill="#FFFFFF" />
          <polygon points="203,194 207,194 205,198" fill="#FFFFFF" />
        </g>
      );
    case "cool":
      return (
        <g id="mouth-cool" stroke="#451A03" strokeWidth="3" strokeLinecap="round" fill="none">
          <path d="M192 196 Q202 194 212 201" />
        </g>
      );
    case "smile":
    default:
      return (
        <g id="mouth-smile" stroke="#451A03" strokeWidth="3" strokeLinecap="round" fill="none">
          {/* Feline :3 smile */}
          <path d="M190 194 Q195 200 200 196 Q205 200 210 194" />
        </g>
      );
  }
};

export const HairAndHeadwearLayer: React.FC<PartProps> = ({ config }) => {
  const hair = config.parts.hairType;

  switch (hair) {
    case "red_headband":
      return (
        <g id="hair-headband">
          {/* Dark bangs */}
          <path d="M135 145 C150 120 180 135 200 125 C220 135 250 120 265 145 C250 135 220 140 200 135 C180 140 150 135 135 145 Z" fill="#1F2937" />
          {/* Red Victory Headband */}
          <path d="M112 135 Q200 115 288 135 L286 148 Q200 128 114 148 Z" fill="#862633" stroke="#54131D" strokeWidth="1.5" />
          {/* Korean '필승' or KU letters */}
          <text x="200" y="143" fill="#FDE047" fontSize="10" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
            고대필승 🐯
          </text>
        </g>
      );
    case "street_beanie":
      return (
        <g id="hair-beanie">
          {/* Beanie Hat */}
          <path d="M120 130 C120 70 280 70 280 130 Z" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
          {/* Folded Brim */}
          <rect x="114" y="122" width="172" height="20" rx="8" fill="#334155" stroke="#0F172A" strokeWidth="2" />
          {/* Tiny KU Red Patch */}
          <rect x="188" y="126" width="24" height="12" rx="3" fill="#862633" />
          <text x="200" y="135" fill="#FFFFFF" fontSize="8" fontWeight="bold" textAnchor="middle">KU</text>
          {/* Bangs peaking out */}
          <path d="M140 142 L155 155 L165 142 L180 152 L195 142 L215 155 L230 142 L250 155" stroke="#1F2937" strokeWidth="5" strokeLinecap="round" />
        </g>
      );
    case "ku_cap":
      return (
        <g id="hair-cap">
          {/* Crimson Baseball Cap */}
          <path d="M125 135 C125 80 275 80 275 135 Z" fill="#862633" stroke="#54131D" strokeWidth="2" />
          {/* Cap Visor */}
          <path d="M110 138 Q200 120 290 138 Q240 160 110 138 Z" fill="#54131D" />
          {/* Embroidered K */}
          <text x="200" y="112" fill="#FDE047" fontSize="22" fontWeight="900" textAnchor="middle" fontFamily="serif">
            K
          </text>
        </g>
      );
    case "wavy_perm":
      return (
        <g id="hair-wavy" fill="#374151">
          <circle cx="130" cy="120" r="22" />
          <circle cx="160" cy="110" r="24" />
          <circle cx="200" cy="105" r="26" />
          <circle cx="240" cy="110" r="24" />
          <circle cx="270" cy="120" r="22" />
          {/* Front bangs */}
          <path d="M135 140 Q160 160 175 135 Q200 160 225 135 Q245 160 265 140 Q200 115 135 140 Z" />
        </g>
      );
    case "short_dandy":
    default:
      return (
        <g id="hair-dandy" fill="#1F2937">
          <path d="M125 135 C125 90 275 90 275 135 C250 120 220 125 200 120 C180 125 150 120 125 135 Z" />
          {/* Dandy bangs */}
          <path d="M135 135 Q170 152 195 135 Q230 152 265 135 Q200 120 135 135 Z" />
        </g>
      );
  }
};

export const OutfitLayer: React.FC<PartProps> = ({ config }) => {
  const outfit = config.parts.outfitType;

  switch (outfit) {
    case "tech_hoodie":
      return (
        <g id="outfit-tech">
          {/* Dark Charcoal Hoodie */}
          <path d="M110 250 Q200 230 290 250 L330 380 L70 380 Z" fill="#1E293B" />
          {/* Hoodie Strings */}
          <line x1="180" y1="250" x2="180" y2="295" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="220" y1="250" x2="220" y2="295" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          {/* Tech Lanyard / Developer ID badge */}
          <path d="M165 245 L200 275 L235 245" fill="none" stroke="#6366F1" strokeWidth="4" />
          <rect x="186" y="275" width="28" height="38" rx="4" fill="#FFFFFF" stroke="#6366F1" strokeWidth="1.5" />
          <rect x="190" y="280" width="20" height="12" fill="#862633" rx="2" />
          <line x1="190" y1="298" x2="210" y2="298" stroke="#64748B" strokeWidth="2" />
          <line x1="190" y1="304" x2="204" y2="304" stroke="#94A3B8" strokeWidth="1.5" />
        </g>
      );
    case "stage_rock":
      return (
        <g id="outfit-rock">
          {/* Black Rider Jacket */}
          <path d="M100 250 Q200 230 300 250 L340 380 L60 380 Z" fill="#0F172A" />
          {/* Crimson Rock T-shirt underneath */}
          <polygon points="170,245 230,245 200,310" fill="#862633" />
          <text x="200" y="280" fill="#FFFFFF" fontSize="9" fontWeight="900" textAnchor="middle">ROCK</text>
          {/* Metal Chain & Zipper */}
          <line x1="165" y1="250" x2="185" y2="380" stroke="#94A3B8" strokeWidth="3" />
          <path d="M210 290 Q240 320 260 300" fill="none" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="3 3" />
        </g>
      );
    case "suit_chic":
      return (
        <g id="outfit-suit">
          {/* Navy Suit Blazer */}
          <path d="M105 250 Q200 230 295 250 L335 380 L65 380 Z" fill="#1E3A8A" />
          {/* White Dress Shirt V */}
          <polygon points="170,245 230,245 200,340" fill="#FFFFFF" />
          {/* Crimson Tie */}
          <polygon points="194,258 206,258 209,330 200,345 191,330" fill="#862633" />
          {/* Gold Tie Pin */}
          <line x1="193" y1="285" x2="207" y2="285" stroke="#F59E0B" strokeWidth="2" />
        </g>
      );
    case "sports_jersey":
      return (
        <g id="outfit-sports">
          {/* Red KU Athletic Jersey */}
          <path d="M110 250 Q200 235 290 250 L330 380 L70 380 Z" fill="#DC2626" />
          {/* White Sleeve Trims */}
          <path d="M110 250 L70 380 L95 380 L130 250 Z" fill="#FFFFFF" opacity="0.4" />
          <path d="M290 250 L330 380 L305 380 L270 250 Z" fill="#FFFFFF" opacity="0.4" />
          {/* Big KU 1905 print */}
          <text x="200" y="315" fill="#FFFFFF" fontSize="26" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
            1905
          </text>
        </g>
      );
    case "volunteer_vest":
      return (
        <g id="outfit-volunteer">
          {/* Inner White Tee */}
          <path d="M110 250 Q200 235 290 250 L330 380 L70 380 Z" fill="#F8FAFC" />
          {/* Orange/Yellow Volunteer Vest */}
          <path d="M125 248 L170 248 L165 380 L90 380 Z" fill="#F97316" />
          <path d="M275 248 L230 248 L235 380 L310 380 Z" fill="#F97316" />
          {/* Angel/Volunteer Heart badge */}
          <circle cx="150" cy="290" r="10" fill="#FFFFFF" />
          <path d="M150 286 C150 283 145 281 143 284 C141 281 136 283 136 286 C136 292 143 296 143 296 C143 296 150 292 150 286 Z" fill="#EF4444" transform="translate(7, 0) scale(0.6)" />
        </g>
      );
    case "casual_knit":
      return (
        <g id="outfit-knit">
          {/* Warm Beige Knit Sweater */}
          <path d="M110 250 Q200 235 290 250 L330 380 L70 380 Z" fill="#D97706" opacity="0.85" />
          {/* Crimson Checkered Scarf */}
          <path d="M150 240 Q200 265 250 240 Q260 255 245 265 Q200 280 155 265 Z" fill="#862633" />
          <rect x="210" y="260" width="22" height="60" rx="4" fill="#862633" />
        </g>
      );
    case "ku_varsity":
    default:
      return (
        <g id="outfit-varsity">
          {/* KU Crimson Varsity Jacket Body */}
          <path d="M110 250 Q200 235 290 250 L330 380 L70 380 Z" fill="#862633" stroke="#54131D" strokeWidth="2" />
          {/* Cream Leather Sleeves */}
          <path d="M110 250 L70 380 L105 380 L135 255 Z" fill="#FEF3C7" />
          <path d="M290 250 L330 380 L295 380 L265 255 Z" fill="#FEF3C7" />
          {/* Striped Collar & Snaps */}
          <path d="M165 242 Q200 258 235 242" stroke="#FFFFFF" strokeWidth="5" fill="none" />
          <path d="M165 242 Q200 258 235 242" stroke="#862633" strokeWidth="2.5" fill="none" />
          {/* Snaps Buttons */}
          <circle cx="200" cy="270" r="3.5" fill="#FFFFFF" />
          <circle cx="200" cy="300" r="3.5" fill="#FFFFFF" />
          <circle cx="200" cy="330" r="3.5" fill="#FFFFFF" />
          <circle cx="200" cy="360" r="3.5" fill="#FFFFFF" />
          {/* Large Golden 'K' Emblem on Chest */}
          <text x="155" y="295" fill="#FDE047" fontSize="24" fontWeight="900" textAnchor="middle" fontFamily="serif">
            K
          </text>
        </g>
      );
  }
};

export const PropsLayer: React.FC<PartProps> = ({ config }) => {
  const prop = config.parts.propType;

  switch (prop) {
    case "macbook":
      return (
        <g id="prop-macbook" transform="translate(230, 260) scale(0.9)">
          {/* Laptop Base */}
          <rect x="0" y="30" width="110" height="60" rx="8" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" />
          {/* Screen Display */}
          <rect x="6" y="35" width="98" height="48" rx="4" fill="#0F172A" />
          {/* Colorful Stickers */}
          <circle cx="55" cy="58" r="9" fill="#862633" />
          <text x="55" y="62" fill="#FFFFFF" fontSize="7" fontWeight="bold" textAnchor="middle">KU</text>
          <rect x="15" y="42" width="22" height="12" rx="3" fill="#6366F1" />
          <text x="26" y="50" fill="#FFFFFF" fontSize="6" fontWeight="bold" textAnchor="middle">REACT</text>
          <circle cx="85" cy="65" r="6" fill="#F59E0B" />
        </g>
      );
    case "electric_guitar":
      return (
        <g id="prop-guitar" transform="translate(210, 230) rotate(-20) scale(0.85)">
          {/* Guitar Body */}
          <path
            d="M20 70 C0 100 10 140 50 140 C85 140 90 105 75 75 C95 60 70 20 40 40 Z"
            fill="#862633"
            stroke="#1E293B"
            strokeWidth="3"
          />
          {/* White Pickguard */}
          <path d="M25 75 C15 95 25 125 55 125 C65 110 55 85 40 70 Z" fill="#FFFFFF" />
          {/* Fretboard Neck */}
          <rect x="35" y="-50" width="12" height="100" fill="#78350F" stroke="#1E293B" strokeWidth="2" />
          {/* Headstock */}
          <polygon points="32,-50 50,-50 45,-75 27,-75" fill="#862633" stroke="#1E293B" strokeWidth="2" />
          {/* Strings */}
          <line x1="39" y1="-70" x2="49" y2="120" stroke="#E2E8F0" strokeWidth="1" />
          <line x1="43" y1="-70" x2="53" y2="120" stroke="#E2E8F0" strokeWidth="1" />
        </g>
      );
    case "basketball":
      return (
        <g id="prop-basketball" transform="translate(250, 270) scale(0.9)">
          <circle cx="35" cy="35" r="30" fill="#EA580C" stroke="#7C2D12" strokeWidth="3" />
          {/* Ball Lines */}
          <path d="M5 35 Q35 35 65 35" stroke="#7C2D12" strokeWidth="2.5" fill="none" />
          <path d="M35 5 Q35 35 35 65" stroke="#7C2D12" strokeWidth="2.5" fill="none" />
          <path d="M12 15 Q35 35 12 55" stroke="#7C2D12" strokeWidth="2" fill="none" />
          <path d="M58 15 Q35 35 58 55" stroke="#7C2D12" strokeWidth="2" fill="none" />
        </g>
      );
    case "microphone":
      return (
        <g id="prop-mic" transform="translate(245, 250) rotate(-15) scale(0.9)">
          {/* Mic Stand & Handle */}
          <rect x="25" y="45" width="14" height="60" rx="4" fill="#334155" stroke="#0F172A" strokeWidth="2" />
          {/* Mic Mesh Head */}
          <ellipse cx="32" cy="35" rx="15" ry="18" fill="#CBD5E1" stroke="#0F172A" strokeWidth="2.5" />
          {/* Mesh Grid Lines */}
          <line x1="20" y1="35" x2="44" y2="35" stroke="#64748B" strokeWidth="1.5" />
          <line x1="32" y1="20" x2="32" y2="50" stroke="#64748B" strokeWidth="1.5" />
          {/* Glow / Audio wave */}
          <circle cx="32" cy="35" r="24" fill="none" stroke="#F43F5E" strokeWidth="1.5" strokeDasharray="3 3" />
        </g>
      );
    case "book_pen":
      return (
        <g id="prop-book" transform="translate(240, 270) scale(0.9)">
          {/* Leather Book */}
          <rect x="10" y="20" width="65" height="50" rx="4" fill="#78350F" stroke="#451A03" strokeWidth="2" />
          <rect x="15" y="24" width="55" height="42" rx="2" fill="#FEF3C7" />
          {/* Book Page Lines */}
          <line x1="22" y1="34" x2="60" y2="34" stroke="#92400E" strokeWidth="2" />
          <line x1="22" y1="42" x2="55" y2="42" stroke="#92400E" strokeWidth="2" />
          <line x1="22" y1="50" x2="58" y2="50" stroke="#92400E" strokeWidth="2" />
          {/* Golden Fountain Pen */}
          <polygon points="65,10 78,3 82,7 69,14" fill="#F59E0B" />
          <polygon points="65,10 60,18 69,14" fill="#1E293B" />
        </g>
      );
    case "camera":
      return (
        <g id="prop-camera" transform="translate(240, 265) scale(0.9)">
          {/* Camera Body */}
          <rect x="10" y="20" width="70" height="45" rx="6" fill="#1E293B" stroke="#0F172A" strokeWidth="2.5" />
          <rect x="20" y="12" width="20" height="8" rx="2" fill="#475569" />
          {/* Lens */}
          <circle cx="45" cy="42" r="16" fill="#0F172A" stroke="#CBD5E1" strokeWidth="3" />
          <circle cx="45" cy="42" r="10" fill="#3B82F6" opacity="0.6" />
          <circle cx="42" cy="39" r="3" fill="#FFFFFF" />
          {/* Red recording dot */}
          <circle cx="68" cy="28" r="3" fill="#EF4444" />
        </g>
      );
    case "coffee_cup":
    default:
      return (
        <g id="prop-coffee" transform="translate(250, 275) scale(0.9)">
          {/* Paper Cup */}
          <polygon points="18,15 52,15 46,65 24,65" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
          {/* Crimson Cup Sleeve */}
          <polygon points="20,28 50,28 47,48 23,48" fill="#862633" />
          <text x="35" y="42" fill="#FFFFFF" fontSize="8" fontWeight="bold" textAnchor="middle">ANAM</text>
          {/* Cup Lid */}
          <rect x="15" y="10" width="40" height="6" rx="2" fill="#1E293B" />
          {/* Steam */}
          <path d="M28 4 Q32 -2 28 -8" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M38 6 Q42 0 38 -6" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" fill="none" />
        </g>
      );
  }
};
