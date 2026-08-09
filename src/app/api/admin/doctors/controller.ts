"use server";
import Doctors from "./modal";
import { ApiMetaData } from "@/app/api/_helpers/apiMetaData";

async function list(req: any) {
  try {
    const page = parseInt(req.get("page") || "1");
    const limit = parseInt(req.get("limit") || "10");
    const query = req.get("search") || "";
    const date = req.get("date") || "";
    const status = req.get("status") || null;
    const filter: any = {};
    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
        { specialization: { $regex: query, $options: "i" } },
      ];
    }
    if (status) {
      filter.status = status === "active";
    }
    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      filter.createdAt = { $gte: start, $lte: end };
    }
    const total = await Doctors.countDocuments(filter);
    const meta = ApiMetaData(page, limit, total);
    const data = await Doctors.find(filter)
      .sort({ createdAt: -1 })
      .skip(meta?.skip)
      .limit(limit)
      .lean();
    return { status: true, data, meta, message: "all doctors" };
  } catch (err) {
    console.log("doctors list err", err);
    return { status: false, data: [], message: "something went wrong" };
  }
}

async function add(req: any) {
  try {
    if (req.email) {
      const exists = await Doctors.findOne({ email: req.email });
      if (exists?._id) {
        return { status: false, data: {}, message: "Doctor already exists" };
      }
    }
    const doctor = new Doctors();
    if (req.createdBy) doctor.createdBy = req.createdBy;
    doctor.name = req.name;
    doctor.email = req.email;
    doctor.phone = req.phone;
    doctor.gender = req.gender;
    doctor.image = req.image;
    doctor.specialization = req.specialization;
    doctor.qualification = req.qualification;
    doctor.experienceYears = req.experienceYears;
    doctor.consultationFee = req.consultationFee;
    doctor.bio = req.bio;
    doctor.slots = Array.isArray(req.slots) ? req.slots : [];
    doctor.status = req.status ?? true;
    await doctor.save();
    return { status: true, data: doctor, message: "Doctor created" };
  } catch (err) {
    console.log("doctors add err", err);
    return { status: false, data: {}, message: "something went wrong" };
  }
}

async function update(req: any) {
  try {
    const doctor = await Doctors.findOne({ _id: req?._id });
    if (!doctor?._id) {
      return { status: false, data: {}, message: "Doctor not found" };
    }
    if (req.email && req.email !== doctor.email) {
      const conflict = await Doctors.findOne({
        _id: { $ne: req._id },
        email: req.email,
      });
      if (conflict?._id) {
        return { status: false, data: {}, message: "Email already exists" };
      }
    }
    doctor.name = req.name;
    doctor.email = req.email;
    doctor.phone = req.phone;
    doctor.gender = req.gender;
    doctor.image = req.image;
    doctor.specialization = req.specialization;
    doctor.qualification = req.qualification;
    doctor.experienceYears = req.experienceYears;
    doctor.consultationFee = req.consultationFee;
    doctor.bio = req.bio;
    if (Array.isArray(req.slots)) doctor.slots = req.slots;
    if (typeof req.status === "boolean") doctor.status = req.status;
    await doctor.save();
    return { status: true, data: doctor, message: "Doctor updated" };
  } catch (err) {
    console.log("doctors update err", err);
    return { status: false, data: {}, message: "something went wrong" };
  }
}

async function deleted(req: any) {
  try {
    const id = req.get("id");
    const doctor = await Doctors.findOne({ _id: id });
    if (!doctor?._id) {
      return { status: false, data: {}, message: "Doctor not found" };
    }
    await Doctors.deleteOne({ _id: id });
    return { status: true, data: doctor, message: "Doctor deleted" };
  } catch (err) {
    return { status: false, data: {}, message: "something went wrong" };
  }
}

export { list, add, update, deleted };
