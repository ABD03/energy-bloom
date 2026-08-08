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