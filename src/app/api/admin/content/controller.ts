"use server";
import { dayjs } from "@/utils/common";
import Content from "./modal";
import { ApiMetaData } from "@/app/api/_helpers/apiMetaData";
import { revalidateTag } from "next/cache";

async function list(req: any) {
  return new Promise(async (resolve, reject) => {
    try {
      const page = parseInt(req.get("page") || "1");
      const limit = parseInt(req.get("limit") || "10");
      const query = req.get("search") || "";
      const status = req.get("status") || null;
      const date = req.get("date") || null;
      const type = req.get("type") || null;
      let filter: any = {};
      if (query) {
        filter.$or = [{ title: { $regex: query, $options: "i" } }];
      }
      if (status) {
        filter.status = status;
      }
      if (type) {
        filter.type = type;
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
      const total = await Content.countDocuments(filter);
      let meta = ApiMetaData(page, limit, total);
      var data = await Content.find(filter, {
        title: 1,
        meta_title: 1,
        permalink: 1,
        image: 1,
        status: 1,
        priority: 1,
        createdAt: 1,
        views: 1,
        is_video: 1,
        is_live: 1,
        is_premium: 1,
        notification_count:1
      })
        .sort({ createdAt: -1 })
        .skip(meta?.skip)
        .limit(limit)
        .lean();
      resolve({
        status: true,
        message: "all content",
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
      var data = await Content.findOne(filter).lean();
      resolve({
        status: true,
        message: "Content details",
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
      const check = await Content.findOne({ permalink: req.permalink });
      if (!check?._id) {
        const contents = new Content();
        if (req.createdBy) contents.createdBy = req.createdBy;
        if (req.title) contents.title = req.title;
        if (req.description) contents.description = req.description;
        if (req.category) contents.category = req.category;
        if (req.tags) contents.tags = req.tags;
        if (req.live) contents.live = req.live;
        if (req.priority) contents.priority = req.priority;
        if (req.position) contents.position = req.position;
        if (req.image) contents.image = req.image;
        if (req.video) contents.video = req.video;
        if (req.content) contents.content = req.content;
        if (req.permalink) contents.permalink = req.permalink;
        if (req.meta_title) contents.meta_title = req.meta_title;
        if (req.meta_description)
          contents.meta_description = req.meta_description;
        if (req.meta_image) contents.meta_image = req.meta_image;
        if (req.author) contents.author = req.author;
        contents.reading_time = req.reading_time;
        contents.editor = req.editor;
        contents.language = req.language;
        contents.is_video = req.is_video;
        contents.is_live = req.is_live;
        contents.is_premium = req.is_premium;
        contents.status = req.status;
        if (req.status === "published") {
          contents.publishedAt = dayjs().format();
          revalidateTag("content");
          revalidateTag("home");
        }
        await contents.save();
        resolve({
          status: true,
          data: contents,
          message: "Content created successfully",
        });
      } else {
        resolve({
          status: false,
          data: {},
          message: "Permalink already exists",
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
      console.log(req?._id);
      const check = await Content.findOne({
        _id: { $ne: req?._id },
        permalink: req?.permalink,
      });
      if (!check?._id) {
        const contents = await Content.findOne({ _id: req?._id });
        if (contents._id) {
          if (req.title) contents.title = req.title;
          if (req.description) contents.description = req.description;
          if (req.category) contents.category = req.category;
          if (req.tags) contents.tags = req.tags;
          if (req.live) contents.live = req.live;
          if (req.priority) contents.priority = req.priority;
          if (req.position) contents.position = req.position;
          if (req.image) contents.image = req.image;
          if (req.video) contents.video = req.video;
          if (req.content) contents.content = req.content;
          if (req.permalink) contents.permalink = req.permalink;
          if (req.meta_title) contents.meta_title = req.meta_title;
          if (req.meta_description)
            contents.meta_description = req.meta_description;
          if (req.meta_image) contents.meta_image = req.meta_image;
          if (req.author) contents.author = req.author;
          contents.reading_time = req.reading_time;
          contents.editor = req.editor;
          contents.language = req.language;
          contents.is_video = req.is_video;
          contents.is_live = req.is_live;
          contents.is_premium = req.is_premium;
          contents.status = req.status;
          contents.publishedAt = dayjs().format();
          revalidateTag("content");
          revalidateTag("home");
          await contents.save();
          resolve({
            status: true,
            data: contents,
            message: "Content updated successfully",
          });
        } else {
          resolve({
            status: false,
            data: {},
            message: "Content not found",
          });
        }
      } else {
        resolve({
          status: false,
          data: {},
          message: "Permalink already exists",
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
      const check = await Content.findOne({ _id: id });
      if (check?._id) {
        await Content.deleteOne({ _id: id });
        revalidateTag("content");
        revalidateTag("home");
        resolve({
          status: true,
          data: check,
          message: "Content deleted successfully",
        });
      } else {
        resolve({
          status: false,
          data: {},
          message: "Content not found",
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
