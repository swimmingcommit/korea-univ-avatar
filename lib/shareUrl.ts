import { UserPreferences } from "./recommendEngine";
import { AvatarConfiguration, AvatarArchetypeId } from "./avatarEngine";

/**
 * Encodes UserPreferences into a URL-safe Base64 string.
 * Supports Unicode (Korean characters) safely.
 */
export function encodeShareData(prefs: UserPreferences): string {
  try {
    const payload = {
      c: prefs.categories || [],
      u: prefs.college || "",
      k: prefs.interests || "",
      b: prefs.currentClub || "",
      q: prefs.quizTraits,
    };
    const json = JSON.stringify(payload);
    if (typeof window !== "undefined") {
      return encodeURIComponent(btoa(encodeURIComponent(json)));
    }
    return encodeURIComponent(Buffer.from(json, "utf-8").toString("base64"));
  } catch (e) {
    console.error("Failed to encode share data", e);
    return "";
  }
}

/**
 * Decodes a Base64 string into UserPreferences.
 */
export function decodeShareData(encoded: string): UserPreferences | null {
  try {
    const raw = decodeURIComponent(encoded);
    let json = "";
    if (typeof window !== "undefined") {
      json = decodeURIComponent(atob(raw));
    } else {
      json = Buffer.from(raw, "base64").toString("utf-8");
    }
    const parsed = JSON.parse(json);
    return {
      categories: parsed.c || parsed.categories || [],
      college: parsed.u || parsed.college || undefined,
      interests: parsed.k || parsed.interests || undefined,
      currentClub: parsed.b || parsed.currentClub || undefined,
      quizTraits: parsed.q || parsed.quizTraits,
    };
  } catch {
    try {
      const raw = decodeURIComponent(encoded);
      const json = typeof window !== "undefined" ? atob(raw) : Buffer.from(raw, "base64").toString("utf-8");
      const parsed = JSON.parse(json);
      return {
        categories: parsed.c || parsed.categories || [],
        college: parsed.u || parsed.college || undefined,
        interests: parsed.k || parsed.interests || undefined,
        currentClub: parsed.b || parsed.currentClub || undefined,
        quizTraits: parsed.q || parsed.quizTraits,
      };
    } catch (err) {
      console.error("Failed to decode share data", err);
      return null;
    }
  }
}

/**
 * Builds a complete share URL that encodes all user selections and archetype details.
 */
export function buildShareUrl(avatar: AvatarConfiguration, prefs?: UserPreferences): string {
  if (typeof window === "undefined") return "";
  
  const url = new URL(window.location.origin + "/result");
  
  url.searchParams.set("archetype", avatar.archetypeId);
  url.searchParams.set("title", avatar.title);
  if (avatar.subtitle) {
    url.searchParams.set("subtitle", avatar.subtitle);
  }

  if (prefs) {
    const encoded = encodeShareData(prefs);
    if (encoded) {
      url.searchParams.set("d", encoded);
    }
    if (prefs.categories && prefs.categories.length > 0) {
      url.searchParams.set("cat", prefs.categories.join(","));
    }
    if (prefs.college) {
      url.searchParams.set("college", prefs.college);
    }
    if (prefs.interests) {
      url.searchParams.set("interests", prefs.interests);
    }
    if (prefs.currentClub) {
      url.searchParams.set("club", prefs.currentClub);
    }
  }

  return url.toString();
}

/**
 * Parses user preferences from URL search parameters.
 */
export function parsePrefsFromUrl(searchParams: URLSearchParams): UserPreferences | null {
  const d = searchParams.get("d") || searchParams.get("data");
  if (d) {
    const decoded = decodeShareData(d);
    if (decoded && (decoded.categories?.length || decoded.college || decoded.interests || decoded.currentClub)) {
      return decoded;
    }
  }

  const catParam = searchParams.get("cat") || searchParams.get("categories");
  const collegeParam = searchParams.get("college");
  const interestsParam = searchParams.get("interests");
  const clubParam = searchParams.get("club") || searchParams.get("currentClub");

  if (catParam || collegeParam || interestsParam || clubParam) {
    return {
      categories: catParam ? catParam.split(",").filter(Boolean) : [],
      college: collegeParam || undefined,
      interests: interestsParam || undefined,
      currentClub: clubParam || undefined,
    };
  }

  return null;
}
