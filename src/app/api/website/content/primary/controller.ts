"use server";
import Content from "@/app/api/admin/content/modal";

const PROJECTION = {
  title: 1,
  meta_title: 1,
  description: 1,
  permalink: 1,
  image: 1,
  category: 1,
  priority: 1,
  publishedAt: 1,
};

async function PrimaryContnents() {
  return new Promise(async (resolve) => {
    try {
      const [primary, secondary] = await Promise.all([
        Content.findOne({ status: "published", priority: "1" }, PROJECTION)
          .sort({ publishedAt: -1, createdAt: -1 })
          .lean(),
        Content.find({ status: "published", priority: "2" }, PROJECTION)
          .sort({ position: 1, createdAt: -1 })
          .limit(10)
          .lean(),
      ]);
      resolve({
        status: true,
        message: "content",
        data: { primary, secondary },
      });
    } catch (err) {
      console.log("err", err);
      resolve({
        status: false,
        data: { primary: null, secondary: [] },
        message: "something went wrong",
      });
    }
  });
}

export { PrimaryContnents };
