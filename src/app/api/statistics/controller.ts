"use server";
import Statics from "./modal";

async function add(req: any) {
  try {
    const startOfDay = new Date(req.date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(req.date);
    endOfDay.setHours(23, 59, 59, 999);

    const isMobile = req?.device === "mobile";
    const data = await Statics.findOneAndUpdate(
      { date: { $gte: startOfDay, $lte: endOfDay } },
      {
        $inc: {
          views: 1,
          mobile: isMobile ? 1 : 0,
          desktop: isMobile ? 0 : 1,
        },
        $setOnInsert: { date: startOfDay },
      },
      { upsert: true, returnDocument: "after" },
    ).lean();

    return { status: true, data, message: "Static updated successfully" };
  } catch {
    return { status: false, data: {}, message: "something went wrong" };
  }
}

async function list(req: any) {
  return new Promise(async (resolve) => {
    try {
      const page = parseInt(req.get("page") || "1");
      const limit = parseInt(req.get("limit") || "30");
      const skip = (page - 1) * limit;
      const from = req.get("from");
      const to = req.get("to");

      const filter: any = {};
      if (from || to) {
        filter.date = {};
        if (from) filter.date.$gte = new Date(from);
        if (to) {
          const end = new Date(to);
          end.setHours(23, 59, 59, 999);
          filter.date.$lte = end;
        }
      }

      const [data, total] = await Promise.all([
        Statics.find(filter).sort({ date: -1 }).skip(skip).limit(limit).lean(),
        Statics.countDocuments(filter),
      ]);

      resolve({
        status: true,
        data,
        meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        message: "Statistics fetched",
      });
    } catch (err) {
      console.log("err", err);
      resolve({ status: false, data: [], message: "Something went wrong" });
    }
  });
}

export { add, list };
