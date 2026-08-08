"use server";
import Pages from "@/app/api/admin/pages/modal";

async function pageDetails(req: any) {
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
      const data = await Pages.findOne({
        permalink: permalink,
        status: true,
      }).lean();
      if (!data) {
        resolve({
          status: false,
          data: null,
          message: "Page not found",
        });
        return;
      }
      resolve({
        status: true,
        message: "page details",
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

export { pageDetails };
