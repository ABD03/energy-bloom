"use server";
import Content from "../../content/modal";

async function trending(req: any) {
  return new Promise(async (resolve, reject) => {
    try {
      const topViews = await Content.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
              $lte: new Date(),
            },
            status: "published",
          },
        },
        {
          $sort: {
            views: -1,
          },
        },
        {
          $limit: 5,
        },
        {
          $project: {
            _id: 1,
            title: 1,
            permalink: 1,
            image: 1,
            status: 1,
            createdAt: 1,
            views: 1,
          },
        },
      ]);
      resolve({
        status: true,
        message: "trending content",
        data: topViews,
      });
    } catch (err) {
      console.log("err", err);
      resolve({
        status: false,
        data: {},
        message: "something went wrong",
      });
    }
  });
}

export { trending };
