"use server";
import { revalidateTag } from "next/cache";
import Reviews from "./modal";
import { ApiMetaData } from "@/app/api/_helpers/apiMetaData";

async function list(req: any) {
  return new Promise(async (resolve) => {
    try {
      const page = parseInt(req.get("page") || "1");
      const limit = parseInt(req.get("limit") || "10");
      const query = req.get("search") || "";
      const status = req.get("status") || null;
      let filter: any = {};
      if (query) {
        filter.$or = [
          { name: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
        ];
      }
      if (status) {
        filter.status = status === "active" ? true : false;
      }
      const total = await Reviews.countDocuments(filter);
      let meta = ApiMetaData(page, limit, total);
      var data = await Reviews.find(filter)
        .sort({ position: 1, createdAt: -1 })
        .skip(meta?.skip)
        .limit(limit);
      resolve({ status: true, message: "all reviews", data, meta });
    } catch (err) {
      console.log("err", err);
      resolve({ status: false, data: {}, message: "something went wrong" });
    }
  });
}

async function add(req: any) {
  return new Promise(async (resolve) => {
    try {
      const review = new Reviews();
      if (req.createdBy) review.createdBy = req.createdBy;
      if (req.name) review.name = req.name;
      if (req.description) review.description = req.description;
      if (req.rating != null) review.rating = req.rating;
      if (req.image) review.image = req.image;
      review.status = req.status;
      review.position = req.position ? req.position : 0;
      await review.save();
      revalidateTag("reviews");
      revalidateTag("home");
      resolve({
        status: true,
        data: review,
        message: "Review created successfully",
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
      const review = await Reviews.findOne({ _id: req?._id });
      if (review?._id) {
        if (req.name) review.name = req.name;
        review.description = req.description;
        if (req.rating != null) review.rating = req.rating;
        review.image = req.image;
        review.position = req.position ? req.position : 0;
        review.status = req.status;
        await review.save();
        revalidateTag("reviews");
        revalidateTag("home");
        resolve({
          status: true,
          data: review,
          message: "Review updated successfully",
        });
      } else {
        resolve({ status: false, data: {}, message: "Review not found" });
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
      const check = await Reviews.findOne({ _id: id });
      if (check?._id) {
        await Reviews.deleteOne({ _id: id });
        revalidateTag("reviews");
        revalidateTag("home");
        resolve({
          status: true,
          data: check,
          message: "Review deleted successfully",
        });
      } else {
        resolve({ status: false, data: {}, message: "Review not found" });
      }
    } catch (err) {
      resolve({ status: false, data: {}, message: "something went wrong" });
    }
  });
}

export { list, add, update, deleted };
