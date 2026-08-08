import { API } from "@/config/apis";

const BASE = `${API.BASE}/api/`;

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
    console.log("GetMasterData error", err);
    return { status: false, data: { categories: [], tags: [] } };
  }
};
