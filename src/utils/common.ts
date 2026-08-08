import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";

//1. dayjs configuration
dayjs.extend(localizedFormat);

//2. reading time
function getReadingTimeString(text: string, wordsPerMinute = 200): string {
  if (!text) return "0 min";
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  if (minutes < 1) {
    return "less than 1 min";
  }
  if (minutes < 60) {
    return `${minutes} min${minutes > 1 ? "s" : ""}`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${hours} hour${hours > 1 ? "s" : ""}`;
  }
  return `${hours} hour${hours > 1 ? "s" : ""} ${remainingMinutes} min${
    remainingMinutes > 1 ? "s" : ""
  }`;
}

//3. rate limit
const requests = new Map<string, { count: number; resetAt: number }>();
function RateLimit(
  ip: string,
  { limit = 5, windowMs = 60_000 } = {},
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = requests.get(ip);

  if (!entry || now > entry.resetAt) {
    requests.set(ip, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  entry.count++;
  if (entry.count > limit) {
    return { allowed: false, remaining: 0 };
  }
  return { allowed: true, remaining: limit - entry.count };
}

//4. find file type
const FindFileType = (image: any) => {
  const imageType = (() => {
    if (!image || typeof image !== "string") return "image/png";
    const lower = image.toLowerCase().split("?")[0];
    if (lower.endsWith(".webp")) return "image/webp";
    if (lower.endsWith(".png")) return "image/png";
    if (lower.endsWith(".gif")) return "image/gif";
    if (lower.endsWith(".svg")) return "image/svg+xml";
    if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
    return "image/png";
  })();
  return imageType;
};

//5. detect language
function DetectLanguage(text: string): any {
  try {
    if (text) {
      const detected = /[ഀ-ൿ]/.test(text) ? "ml-IN" : "en-IN";
      const isMalayalam = detected === "ml-IN";
      const ogLocale = isMalayalam ? "ml_IN" : "en_IN";
      const ogAlternateLocale = isMalayalam ? ["en_IN"] : ["ml_IN"];
      const lDLocale = isMalayalam ? "ml" : "en";
      return {
        ogLocale: ogLocale,
        ogAlternateLocale: ogAlternateLocale,
        lDLocale: lDLocale,
      };
    } else {
      return {
        ogLocale: "ml-IN",
        ogAlternateLocale: ["en_IN"],
        lDLocale: "ml",
      };
    }
  } catch (err) {
    return {
      ogLocale: "ml-IN",
      ogAlternateLocale: ["en_IN"],
      lDLocale: "ml",
    };
  }
}

//6. find word count
const FindWordCount = (body: any) => {
  try {
    const clean = body
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/\s+/g, " ")
      .trim();
    const plainBody = clean;
    const count = plainBody
      ? plainBody.split(/\s+/).filter(Boolean).length
      : undefined;
    return {
      plainBody: plainBody,
      count: count,
    };
  } catch (err) {
    return 200;
  }
};

//7. escape xml
function escapeXml(value: string): string {
  if (!value) return "";
  return value
    .replace(/[​-‏⁠﻿]/g, "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
    .trim();
}

//8. format permalink
const FormatPermalink = (link: any) => {
  try {
    link = link
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-zA-Z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "")
      .toLowerCase()
      .slice(0, 80);
    return link || String(Date.now());
  } catch {
    return String(Date.now());
  }
};

//9. find adds
const findAdds = (value: any[], id: string, screen: string) => {
  try {
    var filteredItems = value.filter(
      (item) => item.position === id && item.screen === screen,
    );
    if (filteredItems.length !== 0) {
      return filteredItems[0];
    } else {
      return {};
    }
  } catch (err) {
    console.error("Error filtering items:", err);
    return {};
  }
};

//10. image loader
const ImageLoader = ({ src, quality }: any) => {
  return `${src}?w=${200}&q=${quality || 75}`;
};

export {
  dayjs,
  getReadingTimeString,
  RateLimit,
  FindFileType,
  DetectLanguage,
  FindWordCount,
  escapeXml,
  FormatPermalink,
  findAdds,
  ImageLoader,
};
