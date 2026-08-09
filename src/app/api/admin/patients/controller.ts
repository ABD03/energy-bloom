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
        { patientId: { $regex: query, $options: "i" } },
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

async function nextPatientId() {
  const last = await Patients.findOne({ patientId: { $regex: /^P\d+$/ } })
    .sort({ patientId: -1 })
    .collation({ locale: "en_US", numericOrdering: true })
    .select("patientId")
    .lean<{ patientId?: string }>();
  const n = last?.patientId ? parseInt(last.patientId.slice(1), 10) : 0;
  return `P${String(n + 1).padStart(2, "0")}`;
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
    patient.patientId = await nextPatientId();
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

async function details(req: any) {
  try {
    const id = req.get("id");
    if (!id) return { status: false, data: {}, message: "id required" };
    const data = await Patients.findById(id).lean();
    if (!data) return { status: false, data: {}, message: "Patient not found" };
    return { status: true, data, message: "patient" };
  } catch (err) {
    console.log("patients details err", err);
    return { status: false, data: {}, message: "something went wrong" };
  }
}

async function picker(req: any) {
  try {
    const query = req.get("search") || "";
    const filter: any = { status: true };
    if (query) {
      filter.$or = [
        { patientId: { $regex: query, $options: "i" } },
        { name: { $regex: query, $options: "i" } },
        { phone: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ];
    }
    const data = await Patients.find(filter, {
      patientId: 1,
      name: 1,
      phone: 1,
      email: 1,
      image: 1,
    })
      .sort({ name: 1 })
      .limit(50)
      .lean();
    return { status: true, data, message: "patients" };
  } catch (err) {
    console.log("patients picker err", err);
    return { status: false, data: [], message: "something went wrong" };
  }
}

export { list, add, update, deleted, picker, details };
