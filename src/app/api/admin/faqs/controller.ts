"use server";
import { revalidateTag } from "next/cache";
import Faqs from "./modal";
import { ApiMetaData } from "@/app/api/_helpers/apiMetaData";

async function list(req: any) {
  return new Promise(async (resolve) => {
    try {
      const page = parseInt(req.get("page") || "1");
      const limit = parseInt(req.get("limit") || "10");
      const query = req.get("search") || "";
      const status = req.get("status") || null;
      const filter: any = {};
      if (query) {
        filter.$or = [
          { question: { $regex: query, $options: "i" } },
          { answer: { $regex: query, $options: "i" } },
        ];
      }
      if (status) filter.status = status === "active";
      const total = await Faqs.countDocuments(filter);
      const meta = ApiMetaData(page, limit, total);
      const data = await Faqs.find(filter)
        .sort({ position: 1, createdAt: -1 })
        .skip(meta?.skip)
        .limit(limit);
      resolve({ status: true, message: "all faqs", data, meta });
    } catch (err) {
      console.log("err", err);
      resolve({ status: false, data: {}, message: "something went wrong" });
    }
  });
}

async function add(req: any) {
  return new Promise(async (resolve) => {
    try {
      const faq = new Faqs();
      if (req.createdBy) faq.createdBy = req.createdBy;
      faq.question = req.question;
      faq.answer = req.answer;
      faq.position = req.position ? req.position : 0;
      faq.status = req.status;
      await faq.save();
      revalidateTag("faqs");
      revalidateTag("home");
      resolve({
        status: true,
        data: faq,
        message: "FAQ created successfully",
      });
    } catch (err) {
      console.log(err);
      resolve({ status: false, data: {}, message: "something went wrong" });
    }
  });
}

async function update(req: any) {
  return new Promise(async (resolve) => {
    try {
      const faq = await Faqs.findOne({ _id: req?._id });
      if (faq?._id) {
        if (req.question) faq.question = req.question;
        if (req.answer) faq.answer = req.answer;
        faq.position = req.position ? req.position : 0;
        faq.status = req.status;
        await faq.save();
        revalidateTag("faqs");
        revalidateTag("home");
        resolve({
          status: true,
          data: faq,
          message: "FAQ updated successfully",
        });
      } else {
        resolve({ status: false, data: {}, message: "FAQ not found" });
      }
    } catch (err) {
      console.log("err", err);
      resolve({ status: false, data: {}, message: "something went wrong" });
    }
  });
}

async function deleted(req: any) {
  return new Promise(async (resolve) => {
    try {
      const id = req.get("id");
      const check = await Faqs.findOne({ _id: id });
      if (check?._id) {
        await Faqs.deleteOne({ _id: id });
        revalidateTag("faqs");
        revalidateTag("home");
        resolve({
          status: true,
          data: check,
          message: "FAQ deleted successfully",
        });
      } else {
        resolve({ status: false, data: {}, message: "FAQ not found" });
      }
    } catch (err) {
      resolve({ status: false, data: {}, message: "something went wrong" });
    }
  });
}

export { list, add, update, deleted };
