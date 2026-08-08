import { API } from "@/config/apis";

export const ViewImage = (name: any) => {
  try {
    let url: any = "/default/placeholder.png";
    if (name) {
      url = `${API.IMAGE_BASE}/uploads/${name}`;
    }
    return url;
  } catch (err) {
    ("/default/placeholder.png");
  }
};
