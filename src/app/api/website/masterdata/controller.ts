"use server";
import Pages from "@/app/api/admin/pages/modal";

async function list() {
  return new Promise(async (resolve) => {
    try {
      const [pages] = await Promise.all([
        Pages.find({ status: true }, { _id: 1, name: 1, permalink: 1 })
          .sort({ createdAt: -1 })
          .lean(),
      ]);
      resolve({
        status: true,
        message: "masterdata",
        data: { pages },
      });
    } catch (err) {
      console.log("err", err);
      resolve({
        status: false,
        data: { categories: [], tags: [], pages: [] },
        message: "something went wrong",
      });
    }
  });
}

export { list };
