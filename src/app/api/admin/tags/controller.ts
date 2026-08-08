"use server";
import { revalidateTag } from "next/cache";
import Tags from "./modal";
import { ApiMetaData } from "@/app/api/_helpers/apiMetaData";

async function list(req: any) {
  return new Promise(async (resolve, reject) => {
    try {
      const page = parseInt(req.get("page") || "1");
      const limit = parseInt(req.get("limit") || "10");
      const query = req.get("search") || "";
      const status = req.get("status") || null;
      let filter: any = {};
      if (query) {
        filter.$or = [{ value: { $regex: query, $options: "i" } }];
      }
      if (status) {
        filter.status = status === "active" ? true : false;
      }
      const total = await Tags.countDocuments(filter);
      let meta = ApiMetaData(page, limit, total);
      var data = await Tags.find(filter)
        .sort({ createdAt: -1 })
        .skip(meta?.skip)
        .limit(limit).lean();
      resolve({
        status: true,
        message: "all tags",
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
async function picker(req: any) {
  return new Promise(async (resolve, reject) => {
    try {
      const query = req.get("search") || "";
      let filter: any = {};
      filter.status = true;
      if (query) {
        filter.$or = [{ value: { $regex: query, $options: "i" } }];
      }
      var data = await Tags.find(filter).limit(20).sort({ createdAt: -1 }).lean();
      resolve({
        status: true,
        message: "all Categories",
        data: data,
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
      const check = await Tags.findOne({ value: req.value });
      if (!check?._id) {
        const tag = new Tags();
        if (req.createdBy) tag.createdBy = req.createdBy;
        if (req.value) tag.value = req.value;
        if (req.image) tag.image = req.image;
        tag.status = req.status;
        await tag.save();
        revalidateTag("masterdata");
        resolve({
          status: true,
          data: tag,
          message: "Tag created successfully",
        });
      } else {
        resolve({
          status: false,
          data: {},
          message: "Tag already exist",
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

async function update(req: any) {
  return new Promise(async (resolve, reject) => {
    try {
      const tag = await Tags.findOne({ _id: req?._id });
      if (tag._id) {
        const check = await Tags.findOne({
          _id: { $ne: req?._id },
          value: req?.value,
        });
        if (!check?._id) {
          if (req?.value) tag.value = req?.value;
          if (req?.image) tag.image = req?.image;
          tag.status = req.status;
          await tag.save();
          revalidateTag("masterdata");
          resolve({
            status: true,
            data: tag,
            message: "Tag updated successfully",
          });
        } else {
          resolve({
            status: false,
            data: {},
            message: "Tag already exist",
          });
        }
      } else {
        resolve({
          status: false,
          data: {},
          message: "Tag not found",
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
      const check = await Tags.findOne({ _id: id });
      if (check?._id) {
        await Tags.deleteOne({ _id: id });
        revalidateTag("masterdata");
        resolve({
          status: true,
          data: check,
          message: "Tag deleted successfully",
        });
      } else {
        resolve({
          status: false,
          data: {},
          message: "Tag not found",
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

export { list, picker, add, update, deleted };
