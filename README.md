# 🐯 고려대 동아리 아바타 (Korea University Club Avatar & Gemini Recommender)

> 동아리 취향을 입력하면 나만의 호랑이 아바타를 만들고, 딱 맞는 고려대 동아리를 추천해주는 캠퍼스 재미 콘텐츠 웹서비스입니다. Google Gemini AI 심층 분석 코멘트를 통해 Gemini 가입 및 사용을 자연스럽게 유도하는 그로스 루프를 갖추고 있습니다.

---

## 🌟 주요 기능

1. **SVG 레이어 조합형 아바타 엔진 (`/lib/avatarEngine.ts`, `/components/avatar/AvatarParts.tsx`)**
   - 얼굴, 헤어, 표정, 의상(크림슨 과잠/후드티/라이더자켓 등), 소품(맥북/일렉기타/농구공 등), 배경(하나스퀘어/중앙광장/축제무대 등)을 사용자의 취향과 5축 성향에 맞게 조합
   - **인터랙티브 왁뿌(Wakppu) 모션**:
     - Framer Motion 기반 Idle 숨쉬기 & 주기적 눈 깜빡임
     - 아바타 클릭 시 캐릭터 대사를 Web Speech API(TTS)로 읽어주며, 입모양(립싱크) 및 바운스 모션 연동
     - 맞춤형 타이틀 부여 (예: *"새벽 코딩하는 하나스퀘어 호랑이"*, *"민주광장 버스킹의 절대지배자"*)

2. **5축 성향 벡터 코사인 유사도 동아리 추천 엔진 (`/lib/recommendEngine.ts`, `/data/clubs.json`)**
   - 고려대학교 45+개 실제 중앙/단과대 동아리 큐레이션 DB
   - 사교성, 활동성, 창작성, 리더십, 전문성의 5차원 벡터 코사인 유사도 + 카테고리/키워드 매칭 보너스
   - 일치율(%), 추천 이유, 핵심 키워드, 공식 klub.kr 바로가기 링크 제공

3. **Gemini AI 심층 분석 코멘트 게이트 (`/app/api/gemini/comment/route.ts`, `/components/gemini/*`)**
   - 기본 아바타와 기본 추천은 무가입 즉시 무료 제공 (Freemium Hook)
   - "Gemini AI 심층 코멘트 열기" 클릭 시 Google 계정 로그인 연동
   - Gemini API (`gemini-1.5-flash`)를 호출하여 호랑이 AI의 1:1 맞춤 분석, 1순위 동아리 시너지, 2학기 안암골 캠퍼스 라이프 꿀팁 생성
   - API 키가 없어도 완성도 높은 지능형 휴리스틱 코멘트로 100% 정상 작동하도록 Fallback 설계

4. **결과 공유 및 이미지 저장 (`/components/share/ShareModal.tsx`, `/app/result/share/page.tsx`)**
   - `html-to-image` 기반 고화질 아바타 카드 PNG 즉시 다운로드
   - 클립보드 링크 복사 (토스트 알림)
   - 카카오톡 / SNS 공유 최적화

---

## 🛠️ 기술 스택

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (고려대 Crimson `#862633` 테마)
- **Animation**: Framer Motion
- **AI**: Google Generative AI (Gemini API)
- **Icons**: Lucide React
- **Celebration**: Canvas-Confetti
- **Export**: html-to-image

---

## 🚀 로컬 실행 방법

### 1. 패키지 설치
```bash
npm install
```

### 2. 환경 변수 설정 (선택 사항)
`.env.local.example` 파일을 복사하여 `.env.local`을 생성하고 Google AI Studio에서 발급받은 Gemini API 키를 입력합니다.
*(키가 없어도 지능형 Mock AI 모드로 모든 기능이 정상 작동합니다)*
```bash
cp .env.local.example .env.local
```

### 3. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 `http://localhost:3000`에 접속하여 서비스를 이용하세요.

---

## 📁 프로젝트 구조

```
korea-univ-avatar/
├── app/
│   ├── layout.tsx              # 전역 레이아웃 & AuthProvider
│   ├── page.tsx                # [/] 랜딩 페이지 (히어로, 아바타 프리뷰, 시작 CTA)
│   ├── create/
│   │   ├── page.tsx            # [/create] 취향 입력 폼 (소속/관심사/단과대/키워드)
│   │   └── quiz/
│   │       └── page.tsx        # [/create/quiz] 5문항 성향 퀴즈
│   ├── result/
│   │   ├── page.tsx            # [/result] 아바타 결과 + 추천 동아리 + Gemini AI 게이트
│   │   └── share/
│   │       └── page.tsx        # [/result/share] 공유 전용 카드 뷰
│   ├── about/
│   │   └── page.tsx            # [/about] 서비스 소개 & Gemini 연동 안내
│   └── api/
│       └── gemini/
│           └── comment/
│               └── route.ts    # Gemini API 서버 라우트 핸들러
├── components/
│   ├── avatar/                 # 조합형 SVG 아바타 & 왁뿌 모션 컴포넌트
│   ├── club/                   # 추천 동아리 카드 컴포넌트
│   ├── gemini/                 # Gemini 로그인 모달 & AI 잠금 해제 카드
│   ├── layout/                 # 헤더, 푸터
│   └── share/                  # 이미지 다운로드 & SNS 공유 모달
├── context/
│   └── AuthContext.tsx         # Google / Gemini 로그인 상태 관리
├── lib/
│   ├── avatarEngine.ts         # 입력값/성향 기반 아바타 파츠 & 타이틀 조합 엔진
│   ├── recommendEngine.ts      # 5축 성향 벡터 코사인 유사도 추천 엔진
│   ├── quizData.ts             # 5문항 퀴즈 데이터 및 성향 가중치
│   ├── colleges.ts             # 고려대학교 단과대 및 학과 데이터
│   └── gemini.ts               # Gemini API 클라이언트 유틸리티 & Mock 폴백
├── data/
│   └── clubs.json              # 고려대학교 45+개 실제 동아리 큐레이션 데이터
└── tailwind.config.ts          # 고대 크림슨 (#862633) 테마 설정
```
