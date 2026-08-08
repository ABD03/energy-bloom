"use server";
import Contacts from "./modal";
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
        filter.$or = [{ name: { $regex: query, $options: "i" } }];
      }
      if (status) {
        filter.status = status === "active" ? true : false;
      }
      const total = await Contacts.countDocuments(filter);
      let meta = ApiMetaData(page, limit, total);
      var data = await Contacts.find(filter)
        .sort({ createdAt: -1 })
        .skip(meta?.skip)
        .limit(limit).lean();
      resolve({
        status: true,
        message: "all Enquiries",
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
      const Contact = new Contacts();
      if (req.name) Contact.name = req.name;
      if (req.email) Contact.email = req.email;
      if (req.phone) Contact.phone = req.phone;
      if (req.message) Contact.message = req.message;
      await Contact.save();
      resolve({
        status: true,
        data: Contact,
        message: "Posted successfully",
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
      const Contact = await Contacts.findOne({ _id: req?._id });
      if (Contact._id) {
        if (req.name) Contact.name = req.name;
        if (req.email) Contact.email = req.email;
        if (req.phone) Contact.phone = req.phone;
        if (req.message) Contact.message = req.message;
        Contact.status = req.status;
        await Contact.save();
        resolve({
          status: true,
          data: Contact,
          message: "Enquiry updated successfully",
        });
      } else {
        resolve({
          status: false,
          data: {},
          message: "Enquiry not found",
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
      const check = await Contacts.findOne({ _id: id });
      if (check?._id) {
        await Contacts.deleteOne({ _id: id });
        resolve({
          status: true,
          data: check,
          message: "Enquiry deleted successfully",
        });
      } else {
        resolve({
          status: false,
          data: {},
          message: "Enquiry not found",
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