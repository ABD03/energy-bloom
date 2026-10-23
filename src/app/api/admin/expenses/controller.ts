"use server";
import mongoose from "mongoose";
import Expenses from "./modal";
import Doctors from "../doctors/modal";

const NOTE_MAX = 500;
const round2 = (n: number) => Math.round(n * 100) / 100;
const pad = (n: number) => String(n).padStart(2, "0");

// Strict "YYYY-MM-DD" that is also a real calendar day (rejects 2026-02-31).
const isRealDate = (s: any) => {
  if (typeof s !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const [y, m, d] = s.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return (
    dt.getUTCFullYear() === y &&
    dt.getUTCMonth() === m - 1 &&
    dt.getUTCDate() === d
  );
};

const parseAmount = (v: any) => {
  const n = typeof v === "string" ? Number(v.trim()) : Number(v);
  return Number.isFinite(n) && n > 0 ? round2(n) : null;
};

// Returns an error message, or null when the (optional) healer is fine.
async function checkDoctor(id: any) {
  if (!id) return null;
  if (!mongoose.isValidObjectId(id)) return "Invalid healer";
  const found = await Doctors.exists({ _id: id });
  return found ? null : "Healer not found";
}

// Expenses for a year, or one month of it (month 0 = whole year).
async function list(req: any) {
  try {
    const year = parseInt(req.get("year") || String(new Date().getFullYear()), 10);
    const month = parseInt(req.get("month") || "0", 10);
    if (!Number.isInteger(year) || year < 2000 || year > 2100) {
      return { status: false, data: {}, message: "Invalid year" };
    }
    if (!Number.isInteger(month) || month < 0 || month > 12) {
      return { status: false, data: {}, message: "Invalid month" };
    }

    // Dates are ISO strings, so plain string comparison orders them correctly.
    const from = month ? `${year}-${pad(month)}-01` : `${year}-01-01`;
    const to = month
      ? month === 12
        ? `${year + 1}-01-01`
        : `${year}-${pad(month + 1)}-01`
      : `${year + 1}-01-01`;

    const rows: any[] = await Expenses.find({ date: { $gte: from, $lt: to } })
      .sort({ date: -1, createdAt: -1 })
      .populate("doctor", "name doctorId")
      .lean();

    const amount = round2(rows.reduce((sum, r) => sum + (Number(r.amount) || 0), 0));
    return {
      status: true,
      data: { year, month, rows, totals: { count: rows.length, amount } },
      message: "expenses",
    };
  } catch (err) {
    console.log("expenses list err", err);
    return { status: false, data: {}, message: "something went wrong" };
  }
}

async function add(req: any, userId?: string) {
  try {
    if (!isRealDate(req.date)) {
      return { status: false, data: {}, message: "Please pick a valid date" };
    }
    const amount = parseAmount(req.amount);
    if (amount === null) {
      return { status: false, data: {}, message: "Enter an amount above 0" };
    }
    const doctorError = await checkDoctor(req.doctor);
    if (doctorError) return { status: false, data: {}, message: doctorError };
    const note = String(req.note || "").trim();
    if (note.length > NOTE_MAX) {
      return {
        status: false,
        data: {},
        message: `Note is too long (${NOTE_MAX} characters max)`,
      };
    }

    const expense = new Expenses();
    expense.date = req.date;
    expense.amount = amount;
    if (req.doctor) expense.doctor = req.doctor;
    expense.note = note;
    if (userId && mongoose.isValidObjectId(userId)) expense.createdBy = userId;
    await expense.save();
    return { status: true, data: expense, message: "Expense added" };
  } catch (err) {
    console.log("expenses add err", err);
    return { status: false, data: {}, message: "something went wrong" };
  }
}

async function update(req: any) {
  try {
    if (!mongoose.isValidObjectId(req?._id)) {
      return { status: false, data: {}, message: "Expense not found" };
    }
    const expense = await Expenses.findById(req._id);
    if (!expense?._id) {
      return { status: false, data: {}, message: "Expense not found" };
    }

    if (req.date !== undefined) {
      if (!isRealDate(req.date)) {
        return { status: false, data: {}, message: "Please pick a valid date" };
      }
      expense.date = req.date;
    }
    if (req.amount !== undefined) {
      const amount = parseAmount(req.amount);
      if (amount === null) {
        return { status: false, data: {}, message: "Enter an amount above 0" };
      }
      expense.amount = amount;
    }
    // null / empty clears the healer; leaving the key out keeps it.
    if (req.doctor !== undefined) {
      const doctorError = await checkDoctor(req.doctor);
      if (doctorError) return { status: false, data: {}, message: doctorError };
      expense.doctor = req.doctor || undefined;
    }
    if (req.note !== undefined) {
      const note = String(req.note || "").trim();
      if (note.length > NOTE_MAX) {
        return {
          status: false,
          data: {},
          message: `Note is too long (${NOTE_MAX} characters max)`,
        };
      }
      expense.note = note;
    }

    await expense.save();
    return { status: true, data: expense, message: "Expense updated" };
  } catch (err) {
    console.log("expenses update err", err);
    return { status: false, data: {}, message: "something went wrong" };
  }
}

async function deleted(req: any) {
  try {
    const id = req.get("id");
    if (!mongoose.isValidObjectId(id)) {
      return { status: false, data: {}, message: "Expense not found" };
    }
    const expense = await Expenses.findById(id);
    if (!expense?._id) {
      return { status: false, data: {}, message: "Expense not found" };
    }
    await Expenses.deleteOne({ _id: id });
    return { status: true, data: expense, message: "Expense deleted" };
  } catch (err) {
    console.log("expenses delete err", err);
    return { status: false, data: {}, message: "something went wrong" };
  }
}

export { list, add, update, deleted };
