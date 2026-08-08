import { API } from "@/config/apis";

const BASE = `${API.BASE}/api/`;

export const getIndex = async () => {
  try {
    const response = await fetch(`${BASE}${API.GET_SEO_INDEX}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      next: { tags: ["quizzes", "stories", "content", "refresh"] },
    });
    const json = await response.json();
    return json;
  } catch (err) {
    console.log("getSettings error", err);
    return { status: false };
  }
};

export const getSettings = async () => {
  try {
    const response = await fetch(`${BASE}${API.GET_SETTINGS}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      next: { tags: ["settings", "refresh"] },
    });
    const json = await response.json();
    return json;
  } catch (err) {
    console.log("getSettings error", err);
    return { status: false };
  }
};

export const getMasterData = async () => {
  try {
    const response = await fetch(`${BASE}${API.GET_MASTERDATA}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      next: { tags: ["masterdata", "refresh"] },
    });
    const json = await response.json();
    return json;
  } catch (err) {
    console.log("getMasterData error", err);
    return { status: false, data: { categories: [], tags: [] } };
  }
};

export const getContents = async (page: number = 1, limit: number = 100) => {
  try {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    const response = await fetch(
      `${BASE}${API.GET_CONTENT_FILTERS}?${params.toString()}`,
      {
        method: "GET",
        headers: { Accept: "application/json" },
        next: { tags: ["content", "refresh"] },
      },
    );
    const json = await response.json();
    return json;
  } catch (err) {
    console.log("getQuizzes error", err);
    return { status: false };
  }
};

export const getFeeds = async (limit: number = 30) => {
  try {
    const params = new URLSearchParams({ limit: String(limit) });
    const response = await fetch(
      `${BASE}${API.GET_SEO_FEED}?${params.toString()}`,
      {
        method: "GET",
        headers: { Accept: "application/json" },
        next: { tags: ["content", "refresh"] },
      },
    );
    const json = await response.json();
    return json?.data || [];
  } catch (err) {
    console.log("getFeeds error", err);
    return [];
  }
};
