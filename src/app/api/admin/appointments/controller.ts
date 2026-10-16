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
    if (status && status !== "all") filter.status = status;
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
  if (!req.slot?.startTime) return null;
  const dt = new Date(req.date);
  const dayStart = new Date(dt);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(dt);
  dayEnd.setHours(23, 59, 59, 999);
  const filter: any = {
    doctor: req.doctor,
    date: { $gte: dayStart, $lte: dayEnd },
    status: { $ne: "cancelled" },
    "slot.startTime": req.slot.startTime,
    "slot.endTime": req.slot.endTime,
  };
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
        message: "This healer already has an appointment for this slot",
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
    appt.otherFee = req.otherFee ?? 0;
    if (req.notes !== undefined) appt.notes = req.notes;
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
        message: "This healer already has an appointment for this slot",
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
    if (typeof req.otherFee === "number") appt.otherFee = req.otherFee;
    if (req.notes !== undefined) appt.notes = req.notes;
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

async function calendar(req: any) {
  try {
    const month = req.get("month");
    const tz = req.get("tz") || "UTC";
    const base = month ? new Date(`${month}-01T00:00:00`) : new Date();
    const start = new Date(base.getFullYear(), base.getMonth(), 1);
    const end = new Date(base.getFullYear(), base.getMonth() + 1, 1);
    const DAY = 24 * 60 * 60 * 1000;
    const startExp = new Date(start.getTime() - DAY);
    const endExp = new Date(end.getTime() + DAY);
    const monthKey = `${base.getFullYear()}-${String(base.getMonth() + 1).padStart(2, "0")}`;

    const rows: any[] = await Appointments.find(
      { date: { $gte: startExp, $lt: endExp } },
      { date: 1, status: 1 },
    ).lean();

    const makeFormatter = (timeZone: string) =>
      new Intl.DateTimeFormat("en-US", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    let formatter: Intl.DateTimeFormat;
    try {
      formatter = makeFormatter(tz);
    } catch {
      formatter = makeFormatter("UTC");
    }
    const dayKey = (d: Date) => {
      const parts: Record<string, string> = {};
      for (const part of formatter.formatToParts(d)) parts[part.type] = part.value;
      return `${parts.year}-${parts.month}-${parts.day}`;
    };

    const map: Record<string, any> = {};
    for (const r of rows) {
      const key = dayKey(new Date(r.date));
      if (!key.startsWith(monthKey)) continue;
      const day =
        map[key] ??
        (map[key] = { count: 0, upcoming: 0, attended: 0, cancelled: 0 });
      day.count += 1;
      if (
        r.status === "upcoming" ||
        r.status === "attended" ||
        r.status === "cancelled"
      ) {
        day[r.status] += 1;
      }
    }
    return { status: true, data: map, message: "calendar" };
  } catch (err) {
    console.log("appointments calendar err", err);
    return { status: false, data: {}, message: "something went wrong" };
  }
}

async function stats(req: any) {
  try {
    const patientId = req.get("patient") || null;
    const doctorId = req.get("doctor") || null;
    const match: any = {};
    if (patientId) match.patient = new (require("mongoose").Types.ObjectId)(patientId);
    if (doctorId) match.doctor = new (require("mongoose").Types.ObjectId)(doctorId);

    const [row]: any = await Appointments.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          upcoming: {
            $sum: { $cond: [{ $eq: ["$status", "upcoming"] }, 1, 0] },
          },
          attended: {
            $sum: { $cond: [{ $eq: ["$status", "attended"] }, 1, 0] },
          },
          cancelled: {
            $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] },
          },
          expired: {
            $sum: { $cond: [{ $eq: ["$status", "expired"] }, 1, 0] },
          },
          feedback: { $push: "$feedback" },
        },
      },
    ]);

    const byFeedback: Record<string, number> = {
      helpful: 0,
      better: 0,
      no_improvement: 0,
    };
    if (row?.feedback) {
      for (const arr of row.feedback) {
        if (!Array.isArray(arr)) continue;
        for (const v of arr) {
          if (byFeedback[v] !== undefined) byFeedback[v] += 1;
        }
      }
    }

    return {
      status: true,
      data: {
        total: row?.total || 0,
        byStatus: {
          upcoming: row?.upcoming || 0,
          attended: row?.attended || 0,
          cancelled: row?.cancelled || 0,
          expired: row?.expired || 0,
        },
        byFeedback,
      },
      message: "stats",
    };
  } catch (err) {
    console.log("appointments stats err", err);
    return { status: false, data: {}, message: "something went wrong" };
  }
}


const REPORT_STATUSES = ["all", "upcoming", "attended", "cancelled", "expired"];
const REPORT_GROUPS = ["month", "day", "healer"];
const round2 = (n: number) => Math.round(n * 100) / 100;

// Appointment count and fee sums, grouped one of three ways:
//   group=month  -> one row per month of `year`
//   group=day    -> one row per day of `month` in `year` (month required)
//   group=healer -> one row per healer for `year`, or only `month` if given
async function report(req: any) {
  try {
    const year = parseInt(req.get("year") || String(new Date().getFullYear()), 10);
    const month = parseInt(req.get("month") || "0", 10); // 0 = whole year
    const group = req.get("group") || "month";
    const status = req.get("status") || "attended";
    const tz = req.get("tz") || "UTC";
    if (!Number.isInteger(year) || year < 2000 || year > 2100) {
      return { status: false, data: {}, message: "Invalid year" };
    }
    if (!Number.isInteger(month) || month < 0 || month > 12) {
      return { status: false, data: {}, message: "Invalid month" };
    }
    if (!REPORT_GROUPS.includes(group)) {
      return { status: false, data: {}, message: "Invalid group" };
    }
    if (!REPORT_STATUSES.includes(status)) {
      return { status: false, data: {}, message: "Invalid status" };
    }
    if (group === "day" && month < 1) {
      return { status: false, data: {}, message: "Month is required" };
    }

    // One month when a month is given, otherwise the whole year. Widened by a
    // day each side so timezone shifts can't drop edge appointments; the
    // per-row checks below keep only the exact period.
    const DAY = 24 * 60 * 60 * 1000;
    const from = month ? new Date(year, month - 1, 1) : new Date(year, 0, 1);
    const to = month ? new Date(year, month, 1) : new Date(year + 1, 0, 1);
    const filter: any = {
      date: {
        $gte: new Date(from.getTime() - DAY),
        $lt: new Date(to.getTime() + DAY),
      },
    };
    if (status !== "all") filter.status = status;

    const query: any = Appointments.find(filter, {
      date: 1,
      fee: 1,
      otherFee: 1,
      doctor: 1,
    });
    if (group === "healer") {
      query.populate("doctor", "name doctorId specialization");
    }
    const appts: any[] = await query.lean();

    // Group in Node (not Mongo) so legacy tz aliases like Asia/Calcutta work.
    const makeFormatter = (timeZone: string) =>
      new Intl.DateTimeFormat("en-US", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    let formatter: Intl.DateTimeFormat;
    try {
      formatter = makeFormatter(tz);
    } catch {
      formatter = makeFormatter("UTC");
    }

    type Row = {
      key: number | string;
      name?: string;
      sub?: string;
      count: number;
      fee: number;
      otherFee: number;
      total: number;
    };
    const blank = (key: number | string, extra: Partial<Row> = {}): Row => ({
      key,
      count: 0,
      fee: 0,
      otherFee: 0,
      total: 0,
      ...extra,
    });

    // Month and day reports list every period (zeros included); the healer
    // report only lists healers that actually have appointments.
    const rows: Row[] = [];
    const byKey = new Map<number | string, Row>();
    const periods =
      group === "month"
        ? 12
        : group === "day"
          ? new Date(year, month, 0).getDate()
          : 0;
    for (let i = 1; i <= periods; i++) {
      const row = blank(i);
      rows.push(row);
      byKey.set(i, row);
    }

    for (const a of appts) {
      const parts: Record<string, string> = {};
      for (const part of formatter.formatToParts(new Date(a.date))) {
        parts[part.type] = part.value;
      }
      if (Number(parts.year) !== year) continue;
      if (month && Number(parts.month) !== month) continue;

      let key: number | string;
      let extra: Partial<Row> = {};
      if (group === "month") {
        key = Number(parts.month);
      } else if (group === "day") {
        key = Number(parts.day);
      } else if (a.doctor?._id) {
        key = String(a.doctor._id);
        extra = {
          name: a.doctor.name,
          sub: [a.doctor.doctorId, a.doctor.specialization]
            .filter(Boolean)
            .join(" · "),
        };
      } else {
        key = "unassigned";
        extra = { name: "No healer assigned" };
      }

      let row = byKey.get(key);
      if (!row) {
        row = blank(key, extra);
        rows.push(row);
        byKey.set(key, row);
      }
      row.count += 1;
      row.fee += Number(a.fee) || 0;
      row.otherFee += Number(a.otherFee) || 0;
    }

    const totals = { count: 0, fee: 0, otherFee: 0, total: 0 };
    for (const row of rows) {
      row.fee = round2(row.fee);
      row.otherFee = round2(row.otherFee);
      row.total = round2(row.fee + row.otherFee);
      totals.count += row.count;
      totals.fee += row.fee;
      totals.otherFee += row.otherFee;
    }
    totals.fee = round2(totals.fee);
    totals.otherFee = round2(totals.otherFee);
    totals.total = round2(totals.fee + totals.otherFee);

    // Highest earning healer first.
    if (group === "healer") {
      rows.sort(
        (a, b) =>
          b.total - a.total ||
          b.count - a.count ||
          String(a.name).localeCompare(String(b.name)),
      );
    }

    return {
      status: true,
      data: { group, year, month, status, rows, totals },
      message: "report",
    };
  } catch (err) {
    console.log("appointments report err", err);
    return { status: false, data: {}, message: "something went wrong" };
  }
}

export { list, add, update, deleted, calendar, stats, report };
