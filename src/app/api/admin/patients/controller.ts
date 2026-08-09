"use server";
import Patients from "./modal";
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
        { phone: { $regex: query, $options: "i" } },
      ];
    }
    if (status) filter.status = status === "active";
    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      filter.createdAt = { $gte: start, $lte: end };
    }
    const total = await Patients.countDocuments(filter);
    const meta = ApiMetaData(page, limit, total);
    const data = await Patients.find(filter)
      .sort({ createdAt: -1 })
      .skip(meta?.skip)
      .limit(limit)
      .lean();
    return { status: true, data, meta, message: "all patients" };
  } catch (err) {
    console.log("patients list err", err);
    return { status: false, data: [], message: "something went wrong" };
  }
}

async function add(req: any) {
  try {
    if (req.email) {
      const exists = await Patients.findOne({ email: req.email });
      if (exists?._id) {
        return { status: false, data: {}, message: "Patient already exists" };
      }
    }
    const patient = new Patients();
    if (req.createdBy) patient.createdBy = req.createdBy;
    patient.name = req.name;
    patient.email = req.email;
    patient.phone = req.phone;
    patient.gender = req.gender;
    patient.dob = req.dob;
    patient.image = req.image;
    patient.bloodGroup = req.bloodGroup;
    patient.address = req.address;
    patient.status = req.status ?? true;
    await patient.save();
    return { status: true, data: patient, message: "Patient created" };
  } catch (err) {
    console.log("patients add err", err);
    return { status: false, data: {}, message: "something went wrong" };
  }
}

async function update(req: any) {
  try {
    const patient = await Patients.findOne({ _id: req?._id });
    if (!patient?._id) {
      return { status: false, data: {}, message: "Patient not found" };
    }
    if (req.email && req.email !== patient.email) {
      const conflict = await Patients.findOne({
        _id: { $ne: req._id },
        email: req.email,
      });
      if (conflict?._id) {
        return { status: false, data: {}, message: "Email already exists" };
      }
    }
    patient.name = req.name;
    patient.email = req.email;
    patient.phone = req.phone;
    patient.gender = req.gender;
    patient.dob = req.dob;
    patient.image = req.image;
    patient.bloodGroup = req.bloodGroup;
    patient.address = req.address;
    if (typeof req.status === "boolean") patient.status = req.status;
    await patient.save();
    return { status: true, data: patient, message: "Patient updated" };
  } catch (err) {
    console.log("patients update err", err);
    return { status: false, data: {}, message: "something went wrong" };
  }
}

async function deleted(req: any) {
  try {
    const id = req.get("id");
    const patient = await Patients.findOne({ _id: id });
    if (!patient?._id) {
      return { status: false, data: {}, message: "Patient not found" };
    }
    await Patients.deleteOne({ _id: id });
    return { status: true, data: patient, message: "Patient deleted" };
  } catch (err) {
    return { status: false, data: {}, message: "something went wrong" };
  }
}

export { list, add, update, deleted };
