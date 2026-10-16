"use server";
import Appointments from "../appointments/modal";

const REPORT_STATUSES = ["all", "upcoming", "attended", "cancelled", "expired"];
const REPORT_GROUPS = ["month", "day", "healer"];
const round2 = (n: number) => Math.round(n * 100) / 100;

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
    console.log("reports err", err);
    return { status: false, data: {}, message: "something went wrong" };
  }
}

export { report };
