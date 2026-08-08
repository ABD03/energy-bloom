"use server";
import Statics from "../../../statistics/modal";

async function chart(req: any) {
  return new Promise(async (resolve, reject) => {
    const date = req.get("date");
    const charts = await Statics.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
            $lte: new Date(),
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$date",
            },
          },
          views: { $sum: "$views" },
        },
      },
      {
        $project: {
          _id: 0,
          day: "$_id",
          views: 1,
        },
      },
      {
        $sort: {
          day: 1,
        },
      },
    ]);

    try {
      resolve({
        status: true,
        message: "chart data",
        data: charts,
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

export { chart };
