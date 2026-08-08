"use server";
import { revalidateTag } from "next/cache";
import Users from "./modal";
import { ApiMetaData } from "@/app/api/_helpers/apiMetaData";
import { hashPassword } from "@/app/api/_helpers/password";

async function list(req: any) {
  return new Promise(async (resolve, reject) => {
    try {
      const page = parseInt(req.get("page") || "1");
      const limit = parseInt(req.get("limit") || "10");
      const query = req.get("search") || "";
      const date = req.get("date") || "";
      const status = req.get("status") || null;
      const type = req.get("type") || "subscriber";
      let filter: any = {};
      if (query) {
        filter.$or = [
          { name: { $regex: query, $options: "i" } },
          { email: { $regex: query, $options: "i" } },
        ];
      }
      if (status) {
        filter.status = status === "active" ? true : false;
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
      const total = await Users.countDocuments(filter);
      let meta = ApiMetaData(page, limit, total);
      var data = await Users.find(filter)
        .select("-password -token")
        .sort({ createdAt: -1 })
        .skip(meta?.skip)
        .limit(limit).lean();
      resolve({
        status: true,
        message: "all users",
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
      let filter: any = {
        type: "editor",
      };
      if (query) {
        filter.$or = [{ value: { $regex: query, $options: "i" } }];
      }
      var data = await Users.find(filter, { name: 1 }).lean();
      resolve({
        status: true,
        message: "all users",
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
      const check = await Users.findOne({
        $or: [{ username: req.username }, { email: req.email }],
      });
      if (!check?._id) {
        let user = new Users();
        if (req.createdBy) user.createdBy = req.createdBy;
        if (req.username) user.username = req.username;
        if (req.password) user.password = await hashPassword(req.password);
        if (req.name) user.name = req.name;
        if (req.email) user.email = req.email;
        if (req.phone) user.phone = req.phone;
        if (req.role) user.role = req.role;
        if (req.type) user.type = req.type;
        if (req.access) user.access = req.access;
        user.image = req.image;
        user.bio = req.bio;
        user.status = req.status;
        await user.save();
        revalidateTag(req.username);
        resolve({
          status: true,
          data: user,
          message: "User created successfully",
        });
      } else {
        resolve({
          status: false,
          data: {},
          message: "User already exist",
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
      const user = await Users.findOne({ _id: req?._id });
      if (user._id) {
        const check = await Users.findOne({
          _id: { $ne: req?._id },
          email: req?.email,
        });
        if (!check?._id) {
          if (req.username) user.username = req.username;
          if (req.password) user.password = await hashPassword(req.password);
          if (req.name) user.name = req.name;
          if (req.email) user.email = req.email;
          if (req.phone) user.phone = req.phone;
          if (req.role) user.role = req.role;
          if (req.type) user.type = req.type;
          if (req.access) user.access = req.access;
          user.image = req.image;
          user.bio = req.bio;
          user.status = req.status;
          await user.save();
          revalidateTag(req.username);
          resolve({
            status: true,
            data: user,
            message: "User updated successfully",
          });
        } else {
          resolve({
            status: false,
            data: {},
            message: "Email already exist",
          });
        }
      } else {
        resolve({
          status: false,
          data: {},
          message: "User not found",
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
      const check = await Users.findOne({ _id: id });
      if (check?._id) {
        await Users.deleteOne({ _id: id });
        revalidateTag(check.username);
        resolve({
          status: true,
          data: check,
          message: "User deleted successfully",
        });
      } else {
        resolve({
          status: false,
          data: {},
          message: "User not found",
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

export { list, add, update, deleted, picker };
