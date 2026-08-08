"use server";
import { revalidateTag } from "next/cache";
import Pages from "./modal";
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
        filter.$or = [
          { name: { $regex: query, $options: "i" } },
          { permalink: { $regex: query, $options: "i" } },
        ];
      }
      if (status) {
        filter.status = status === "active" ? true : false;
      }
      const total = await Pages.countDocuments(filter);
      let meta = ApiMetaData(page, limit, total);
      var data = await Pages.find(filter, {
        name: 1,
        permalink: 1,
        images_count: 1,
        status: 1,
        createdAt: 1,
      })
        .sort({ createdAt: -1 })
        .skip(meta?.skip)
        .limit(limit)
        .lean();
      resolve({
        status: true,
        message: "all stories",
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

async function details(req: any) {
  return new Promise(async (resolve, reject) => {
    try {
      const id = req.get("id");
      let filter: any = {};
      filter._id = id;
      var data = await Pages.findOne(filter).lean();
      resolve({
        status: true,
        message: "Pages details",
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
      const Page = new Pages();
      if (req.createdBy) Page.createdBy = req.createdBy;
      if (req.name) Page.name = req.name;
      if (req.sections) Page.sections = req.sections;
      if (req.permalink) Page.permalink = req.permalink;
      if (req.meta_description) Page.meta_description = req.meta_description;
      if (req.meta_image) Page.meta_image = req.meta_image;
      if (req.author) Page.author = req.author;
      Page.editor = req.editor;
      Page.status = req.status;
      await Page.save();
      revalidateTag("masterdata");
      resolve({
        status: true,
        data: Page,
        message: "Page created successfully",
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

async function update(req: any) {
  return new Promise(async (resolve, reject) => {
    try {
      const Page = await Pages.findOne({ _id: req?._id });
      if (Page._id) {
        if (req.createdBy) Page.createdBy = req.createdBy;
        if (req.name) Page.name = req.name;
        if (req.sections) Page.sections = req.sections;
        if (req.permalink) Page.permalink = req.permalink;
        if (req.meta_description) Page.meta_description = req.meta_description;
        if (req.meta_image) Page.meta_image = req.meta_image;
        if (req.author) Page.author = req.author;
        Page.editor = req.editor;
        Page.status = req.status;
        await Page.save();
        revalidateTag("masterdata");
        resolve({
          status: true,
          data: Page,
          message: "Page updated successfully",
        });
      } else {
        resolve({
          status: false,
          data: {},
          message: "Page not found",
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
      const check = await Pages.findOne({ _id: id });
      if (check?._id) {
        await Pages.deleteOne({ _id: id });
        revalidateTag("masterdata");
        resolve({
          status: true,
          data: check,
          message: "Page deleted successfully",
        });
      } else {
        resolve({
          status: false,
          data: {},
          message: "Page not found",
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

export { list, details, add, update, deleted };
