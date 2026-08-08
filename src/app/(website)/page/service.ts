import { API } from "@/config/apis";

export const getPageDetails = async (permalink: string) => {
  try {
    const response = await fetch(
      `${API.BASE}/api/${API.GET_PAGE_DETAILS}?permalink=${encodeURIComponent(permalink)}`,
      {
        method: "GET",
        headers: { Accept: "application/json" },
        next: { tags: ["refresh"] },
      },
    );
    const json = await response.json();
    return json;
  } catch (err) {
    console.log("getPageDetails error", err);
    return { status: false };
  }
};
