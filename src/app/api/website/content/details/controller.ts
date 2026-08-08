"use server";
import Content from "@/app/api/admin/content/modal";

async function contentDetails(req: any) {
  return new Promise(async (resolve) => {
    try {
      const permalink = req.get("permalink");
      if (!permalink) {
        resolve({
          status: false,
          data: null,
          message: "permalink is required",
        });
        return;
      }
      const data = await Content.findOne({
        permalink: permalink,
        status: "published",
      })
        .populate("editor", "name _id image bio username")
        .lean();
      if (!data) {
        resolve({
          status: false,
          data: null,
          message: "Content not found",
        });
        return;
      }
      resolve({
        status: true,
        message: "content details",
        data: data,
      });
    } catch (err) {
      console.log("err", err);
      resolve({
        status: false,
        data: null,
        message: "something went wrong",
      });
    }
  });
}

export { contentDetails };
