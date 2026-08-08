"use server";
import mongoose from "mongoose";
import Content from "@/app/api/admin/content/modal";
import Users from "@/app/api/admin/users/modal";
import { ApiMetaData } from "@/app/api/_helpers/apiMetaData";

const toList = (val: string | null) => {
  if (!val) return [];
  return val
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
};

const toRegexList = (list: string[]) =>
  list.map((v) => {
    const escaped = v.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const flexible = escaped.replace(/\s+/g, "\\s+");
    return new RegExp(`^${flexible}$`, "i");
  });

async function filters(req: any) {
  return new Promise(async (resolve) => {
    try {
      const page = parseInt(req.get("page") || "1");
      const limit = parseInt(req.get("limit") || "10");
      const title = req.get("title") || "";
      const categories = toList(req.get("categories"));
      const editor = (req.get("editor") || "").trim();
      const tags = toList(req.get("tags"));

      const filter: any = { status: "published" };
      if (title) {
        const escaped = title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        filter.$or = [
          { title: { $regex: escaped, $options: "i" } },
          { description: { $regex: escaped, $options: "i" } },
        ];
      }
      if (categories.length)
        filter["category.label"] = { $in: toRegexList(categories) };
      if (tags.length) filter["tags.label"] = { $in: toRegexList(tags) };
      if (editor) {
        if (editor === "default") {
          filter.editor = { $exists: false };
        } else if (mongoose.Types.ObjectId.isValid(editor)) {
          filter.editor = new mongoose.Types.ObjectId(editor);
        } else {
          const user = await Users.findOne(
            { name: editor, type: "editor" },
            { _id: 1 },
          ).lean();
          filter.editor = (user as any)?._id || new mongoose.Types.ObjectId();
        }
      }

      const total = await Content.countDocuments(filter);
      const meta = ApiMetaData(page, limit, total);

      const data = await Content.find(filter, {
        _id: 1,
        title: 1,
        description: 1,
        permalink: 1,
        image: 1,
        category: 1,
        language: 1,
        publishedAt: 1,
        createdAt: 1,
      })
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip(meta.skip)
        .limit(limit)
        .lean();

      resolve({
        status: true,
        message: "filtered content",
        data,
        meta,
      });
    } catch (err) {
      console.log("err", err);
      resolve({
        status: false,
        data: [],
        message: "something went wrong",
      });
    }
  });
}

export { filters };
