"use server";
import Categories from "@/app/api/admin/category/modal";
import Pages from "@/app/api/admin/pages/modal";

async function list() {
  return new Promise(async (resolve) => {
    try {
      const [categories, pages] = await Promise.all([
        Categories.find(
          { status: true },
          { _id: 1, value: 1, image: 1, position: 1 }
        )
          .sort({ position: 1, createdAt: -1 })
          .lean(),
        Pages.find({ status: true }, { _id: 1, name: 1, permalink: 1 })
          .sort({ createdAt: -1 })
          .lean(),
      ]);
      resolve({
        status: true,
        message: "masterdata",
        data: { categories, pages },
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
