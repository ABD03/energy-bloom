"use server";
import Appointments from "./modal";
import { ApiMetaData } from "@/app/api/_helpers/apiMetaData";

async function list(req: any) {
  try {
    const page = parseInt(req.get("page") || "1");
    const limit = parseInt(req.get("limit") || "10");
    const query = req.get("search") || "";
    const date = req.get("date") || "";
    const status = req.get("status") || null;
    const doctorId = req.get("doctor") || null;
    const patientId = req.get("patient") || null;

    const filter: any = {};
    if (status) filter.status = status;
    if (doctorId) filter.doctor = doctorId;
    if (patientId) filter.patient = patientId;
    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      filter.date = { $gte: start, $lte: end };
    }

    const total = await Appointments.countDocuments(filter);
    const meta = ApiMetaData(page, limit, total);

    let cursor = Appointments.find(filter)
      .sort({ date: -1 })
      .skip(meta?.skip)
      .limit(limit)
      .populate("patient", "patientId name phone email image")
      .populate(
        "doctor",
        "doctorId name specialization image consultationFee slots",
      );

    let data = await cursor.lean();

    if (query) {
      const q = query.toLowerCase();
      data = data.filter(
        (item: any) =>
          item?.patient?.name?.toLowerCase().includes(q) ||
          item?.patient?.patientId?.toLowerCase().includes(q) ||
          item?.doctor?.name?.toLowerCase().includes(q) ||
          item?.doctor?.doctorId?.toLowerCase().includes(q),
      );
    }

    return { status: true, data, meta, message: "all appointments" };
  } catch (err) {
    console.log("appointments list err", err);
    return { status: false, data: [], message: "something went wrong" };
  }
}

async function checkConflict(req: any, excludeId?: string) {
  if (!req.doctor || !req.date) return null;
  const dt = new Date(req.date);
  const dayStart = new Date(dt);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(dt);
  dayEnd.setHours(23, 59, 59, 999);
  const filter: any = {
    doctor: req.doctor,
    date: { $gte: dayStart, $lte: dayEnd },
    status: { $ne: "cancelled" },
  };
  if (req.slot?.startTime) {
    filter["slot.startTime"] = req.slot.startTime;
    filter["slot.endTime"] = req.slot.endTime;
  } else {
    filter.date = dt;
  }
  if (excludeId) filter._id = { $ne: excludeId };
  return Appointments.findOne(filter);
}

async function nextToken(doctor: any, date: any) {
  const dt = new Date(date);
  const dayStart = new Date(dt);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(dt);
  dayEnd.setHours(23, 59, 59, 999);
  const last = await Appointments.findOne({
    doctor,
    date: { $gte: dayStart, $lte: dayEnd },
  })
    .sort({ token: -1 })
    .select("token")
    .lean<{ token?: number }>();
  return (last?.token || 0) + 1;
}

async function add(req: any) {
  try {
    const conflict = await checkConflict(req);
    if (conflict?._id) {
      return {
        status: false,
        data: {},
        message: "This doctor already has an appointment for this slot",
      };
    }
    const appt = new Appointments();
    if (req.createdBy) appt.createdBy = req.createdBy;
    appt.patient = req.patient;
    appt.doctor = req.doctor;
    appt.date = req.date;
    appt.slot = req.slot || undefined;
    appt.token = await nextToken(req.doctor, req.date);
    appt.fee = req.fee ?? 0;
    appt.notes = req.notes;
    appt.status = req.status || "upcoming";
    await appt.save();
    return { status: true, data: appt, message: "Appointment created" };
  } catch (err) {
    console.log("appointments add err", err);
    return { status: false, data: {}, message: "something went wrong" };
  }
}

async function update(req: any) {
  try {
    const appt = await Appointments.findOne({ _id: req?._id });
    if (!appt?._id) {
      return { status: false, data: {}, message: "Appointment not found" };
    }
    const conflict = await checkConflict(req, req._id);
    if (conflict?._id) {
      return {
        status: false,
        data: {},
        message: "This doctor already has an appointment for this slot",
      };
    }
    const doctorChanged = req.doctor && String(req.doctor) !== String(appt.doctor);
    const dateChanged =
      req.date && new Date(req.date).getTime() !== new Date(appt.date).getTime();
    if (req.patient) appt.patient = req.patient;
    if (req.doctor) appt.doctor = req.doctor;
    if (req.date) appt.date = req.date;
    appt.slot = req.slot || undefined;
    if (doctorChanged || dateChanged) {
      appt.token = await nextToken(appt.doctor, appt.date);
    }
    if (typeof req.fee === "number") appt.fee = req.fee;
    appt.notes = req.notes;
    if (req.briefing !== undefined) appt.briefing = req.briefing;
    if (req.remark !== undefined) appt.remark = req.remark;
    if (Array.isArray(req.attachments)) appt.attachments = req.attachments;
    if (Array.isArray(req.feedback)) appt.feedback = req.feedback;
    if (req.status) appt.status = req.status;
    await appt.save();
    return { status: true, data: appt, message: "Appointment updated" };
  } catch (err) {
    console.log("appointments update err", err);
    return { status: false, data: {}, message: "something went wrong" };
  }
}

async function deleted(req: any) {
  try {
    const id = req.get("id");
    const appt = await Appointments.findOne({ _id: id });
    if (!appt?._id) {
      return { status: false, data: {}, message: "Appointment not found" };
    }
    await Appointments.deleteOne({ _id: id });
    return { status: true, data: appt, message: "Appointment deleted" };
  } catch (err) {
    return { status: false, data: {}, message: "something went wrong" };
  }
}

export { list, add, update, deleted };
