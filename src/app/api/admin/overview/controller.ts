"use server";
import Statics from "../../statistics/modal";
import Users from "../users/modal";
import Contacts from "../contact/modal";
import Media from "../media/modal";
import Pages from "../pages/modal";

function getCompare(today: number, yesterday: number) {
  const diff = today - yesterday;
  const percentage =
    yesterday > 0 ? Math.round((diff / yesterday) * 100) : today > 0 ? 100 : 0;
  return {
    today,
    yesterday,
    diff,
    percentage,
    trend: diff > 0 ? "positive" : diff < 0 ? "negative" : "neutral",
  };
}

async function list(req: any) {
  return new Promise(async (resolve, reject) => {
    try {
      const date = req.get("date");

      // today range
      var startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      var endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      // yesterday range
      var yesterdayStart = new Date(startOfDay);
      yesterdayStart.setDate(yesterdayStart.getDate() - 1);
      var yesterdayEnd = new Date(yesterdayStart);
      yesterdayEnd.setHours(23, 59, 59, 999);

      const [today, yesterday] = await Promise.all([
        Statics.findOne({ date: { $gte: startOfDay, $lte: endOfDay } }),
        Statics.findOne({ date: { $gte: yesterdayStart, $lte: yesterdayEnd } }),
      ]);

      const todayViews = today?.views || 0;

      const yesterdayViews = yesterday?.views || 0;

      const comparison = {
        views: getCompare(todayViews, yesterdayViews),
      };

      const [contacts, pages, files, users] = await Promise.all([
        Contacts.countDocuments(),
        Pages.countDocuments(),
        Media.countDocuments(),
        Users.countDocuments({ type: "editor" }),
      ]);

      resolve({
        status: true,
        message: "all statics",
        data: {
          today: today,
          yesterday: yesterday,
          comparison: comparison,
          counts: {
            contacts,
            pages,
            files,
            users,
          },
        },
      });
    } catch (err) {
      console.log("err  = = = >", err);
      resolve({
        status: false,
        data: {},
        message: "something went wrong",
      });
    }
  });
}

export { list };
