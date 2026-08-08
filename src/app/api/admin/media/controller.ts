"use server";
import Media from "./modal";
import { ApiMetaData } from "@/app/api/_helpers/apiMetaData";

async function list(req: any) {
  return new Promise(async (resolve, reject) => {
    try {
      const page = parseInt(req.get("page") || "1");
      const limit = parseInt(req.get("limit") || "10");
      const query = req.get("search") || "";
      const date = req.get("date") || null;
      let filter: any = {};
      if (query) {
        filter.$or = [
          { caption: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
          { name: { $regex: query, $options: "i" } },
        ];
      }
      if (date) {
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);
        filter.createdAt = {
          $gte: startDate,
          $lte: endDate,
        };
      }
      const total = await Media.countDocuments(filter);
      let meta = ApiMetaData(page, limit, total);
      var data = await Media.find(filter)
        .sort({ createdAt: -1 })
        .skip(meta?.skip)
        .limit(limit).lean();
      resolve({
        status: true,
        message: "all File",
        data: data,
        meta: meta,
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

async function add(req: any) {
  return new Promise(async (resolve, reject) => {
    try {
      const tag = new Media();
      if (req.createdBy) tag.createdBy = req.createdBy;
      if (req.caption) tag.caption = req.caption;
      if (req.description) tag.description = req.description;
      if (req.name) tag.name = req.name;
      if (req.type) tag.type = req.type;
      if (req.size) tag.size = req.size;
      if (req.url) tag.url = req.url;
      await tag.save();
      resolve({
        status: true,
        data: tag,
        message: "File created successfully",
      });
    } catch (err) {
      resolve({
        status: false,
        data: {},
        message: "something went wrong",
      });
    }
  });
}

async function update(req: any) {
  return new Promise(async (resolve, reject) => {
    try {
      const tag = await Media.findOne({ _id: req?._id });
      if (tag._id) {
        if (req.caption) tag.caption = req.caption;
        if (req.description) tag.description = req.description;
        if (req.name) tag.name = req.name;
        if (req.type) tag.type = req.type;
        if (req.size) tag.size = req.size;
        if (req.url) tag.url = req.url;
        await tag.save();
        resolve({
          status: true,
          data: tag,
          message: "File updated successfully",
        });
      } else {
        resolve({
          status: false,
          data: {},
          message: "File not found",
        });
      }
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

async function deleted(req: any) {
  return new Promise(async (resolve, reject) => {
    try {
      const id = req.get("id");
      const check = await Media.findOne({ _id: id });
      if (check?._id) {
        await Media.deleteOne({ _id: id });
        resolve({
          status: true,
          data: check,
          message: "File deleted successfully",
        });
      } else {
        resolve({
          status: false,
          data: {},
          message: "File not found",
        });
      }
    } catch (err) {
      resolve({
        status: false,
        data: {},
        message: "something went wrong",
      });
    }
  });
}

export { list, add, update, deleted };
