// Comprehensive blacklist for Korean & English profanities, slurs, adult content, and troll terms
const BANNED_KEYWORDS = [
  // Korean profanity & vulgarities (including abbreviations)
  "시발", "씨발", "시바", "씨바", "병신", "ㅄ", "ㅂㅅ", "ㅅㅂ", "ㅈㄹ", "ㄹㅇㅋㅋ", "ㄲㅈ", "껒",
  "존나", "졸라", "개새끼", "개새", "미친놈", "미친년",
  "지랄", "닥쳐", "느금마", "니애미", "느개비", "엠창", "애자", "장애인", "틀딱", "한남", "한녀", "바보", "멍청이",
  "일베", "메갈", "워마드", "야스", "섹스", "자지", "보지", "자살", "살인", "폭행", "강간", "성폭행",
  "사기꾼", "보이스피싱", "토토", "바카라", "카지노", "조건만남", "출장안마", "성매매", "마약", "대마초", "필로폰",
  "섹트", "씹", "썅", "개같은", "호구", "새끼", "쌍놈", "잡놈", "똥개", "트롤", "분탕", "테러",
  // English profanity & slurs
  "fuck", "shit", "bitch", "asshole", "nigger", "cunt", "dick", "pussy", "bastard", "scam",
  "casino", "porn", "sex", "troll", "fck", "fxxk", "whore", "slut", "idiot", "stupid",
];

// Spam & troll pattern regexes
const SPAM_PATTERNS = [
  /([ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z0-9])\1{3,}/, // e.g. ㅋㅋㅋㅋ, ㅠㅠㅠㅠ, asdfasdf
  /(test|테스트){2,}/i,
  /[ㅗ凸]/,
];

/**
 * Checks if a given text contains profanity or spam patterns
 */
export function containsProfanity(text: string): { isBlocked: boolean; matchedWord?: string } {
  if (!text || typeof text !== "string") return { isBlocked: false };

  // Normalize: remove all whitespace and special symbols for inspection
  const normalized = text.toLowerCase().replace(/[\s\-_.~!@#$%^&*()+=,/?><\\|;:'"[\]{}]+/g, "");

  // 1. Check exact / partial banned keywords
  for (const word of BANNED_KEYWORDS) {
    const cleanWord = word.toLowerCase().replace(/\s+/g, "");
    if (normalized.includes(cleanWord)) {
      return { isBlocked: true, matchedWord: word };
    }
  }

  // 2. Check spam / repetitive patterns
  for (const pattern of SPAM_PATTERNS) {
    if (pattern.test(text)) {
      return { isBlocked: true, matchedWord: "반복 도배 또는 특수문자 패턴" };
    }
  }

  return { isBlocked: false };
}

/**
 * Validates a club submission for mandatory fields, required links, and profanities.
 * Privacy rule: Does not expose the detected vulgar words on UI.
 */
export function validateClubSubmission(club: {
  name?: string;
  summary?: string;
  description?: string;
  keywords?: string[];
  contact?: string;
  instagram?: string;
  website?: string;
}): { isValid: boolean; error?: string } {
  if (!club.name || club.name.trim().length < 2) {
    return { isValid: false, error: "동아리 이름을 최소 2자 이상 입력해주세요." };
  }

  // Mandatory Link Verification (Instagram or Website or Contact)
  const hasInstagram = club.instagram && club.instagram.trim().length > 1;
  const hasWebsite = club.website && club.website.trim().length > 3;
  const hasContact = club.contact && club.contact.trim().length > 3;

  if (!hasInstagram && !hasWebsite && !hasContact) {
    return {
      isValid: false,
      error: "허위 정보 방지를 위해 공식 인스타그램 계정(@아이디) 또는 웹사이트/연락처 링크를 반드시 입력해주세요.",
    };
  }

  // Check text fields for profanity
  const fieldsToCheck: { label: string; value: string }[] = [
    { label: "동아리 이름", value: club.name || "" },
    { label: "한 줄 소개", value: club.summary || "" },
    { label: "상세 설명", value: club.description || "" },
    { label: "연락처/링크", value: club.contact || "" },
    { label: "인스타그램", value: club.instagram || "" },
    { label: "웹사이트", value: club.website || "" },
    ...(club.keywords || []).map((kw, i) => ({ label: `키워드 #${i + 1}`, value: kw })),
  ];

  for (const field of fieldsToCheck) {
    const check = containsProfanity(field.value);
    if (check.isBlocked) {
      return {
        isValid: false,
        error: `[${field.label}] 항목에 등록할 수 없는 부적절한 단어가 포함되어 있습니다.`,
      };
    }
  }

  return { isValid: true };
}
