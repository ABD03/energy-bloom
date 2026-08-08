"use server";
import { revalidateTag } from "next/cache";
import Categories from "./modal";
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
      const total = await Categories.countDocuments(filter);
      let meta = ApiMetaData(page, limit, total);
      var data = await Categories.find(filter)
        .sort({ position: 1, createdAt: -1 })
        .skip(meta?.skip)
        .limit(limit).lean();
      resolve({
        status: true,
        message: "all Categories",
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
      if (query) {
        filter.$or = [{ value: { $regex: query, $options: "i" } }];
      }
      var data = await Categories.find(filter, { value: 1 }).lean();
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
      const check = await Categories.findOne({
        value: req.value,
      });
      if (!check?._id) {
        const category = new Categories();
        if (req.createdBy) category.createdBy = req.createdBy;
        if (req.value) category.value = req.value;
        if (req.image) category.image = req.image;
        category.show_home = req.show_home;
        category.status = req.status;
        category.position = req.position ? req.position : 1;
        await category.save();
        revalidateTag("masterdata");
        resolve({
          status: true,
          data: category,
          message: "Category created successfully",
        });
      } else {
        resolve({
          status: false,
          data: {},
          message: "Category already exist",
        });
      }
    } catch (err) {
      console.log(err);
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
      const category = await Categories.findOne({ _id: req?._id });
      if (category._id) {
        const check = await Categories.findOne({
          _id: { $ne: req?._id },
          value: req?.value,
        });
        if (!check?._id) {
          if (req.value) category.value = req.value;
          category.image = req.image;
          category.position = req.position ? req.position : 1;
          category.show_home = req.show_home;
          category.status = req.status;
          await category.save();
          revalidateTag("masterdata");
          resolve({
            status: true,
            data: category,
            message: "Category updated successfully",
          });
        } else {
          resolve({
            status: false,
            data: {},
            message: "Category already exist",
          });
        }
      } else {
        resolve({
          status: false,
          data: {},
          message: "Category not found",
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
      const check = await Categories.findOne({ _id: id });
      if (check?._id) {
        await Categories.deleteOne({ _id: id });
        revalidateTag("masterdata");
        resolve({
          status: true,
          data: check,
          message: "Category deleted successfully",
        });
      } else {
        resolve({
          status: false,
          data: {},
          message: "Category not found",
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
