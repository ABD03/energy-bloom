"use server";
import { NextRequest, NextResponse } from "next/server";
import Patients from "@/app/api/admin/patients/modal";
import Appointments from "@/app/api/admin/appointments/modal";
import connectDB from "@/config/dbConnect";

async function nextPatientId() {
  const last = await Patients.findOne({ patientId: { $regex: /^P\d+$/ } })
    .sort({ patientId: -1 })
    .collation({ locale: "en_US", numericOrdering: true })
    .select("patientId")
    .lean<{ patientId?: string }>();
  const n = last?.patientId ? parseInt(last.patientId.slice(1), 10) : 0;
  return `P${String(n + 1).padStart(2, "0")}`;
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const name = String(body?.name || "").trim();
    const phone = String(body?.phone || "").trim();
    const address = String(body?.address || "").trim();
    const date = body?.date ? new Date(body.date) : null;
    const notes = body?.notes;

    if (!name || !phone || !date) {
      return NextResponse.json({
        status: false,
        message: "Name, phone and date are required",
      });
    }

    let patient: any = await Patients.findOne({ phone });
    if (!patient?._id) {
      patient = new Patients();
      patient.name = name;
      patient.phone = phone;
      patient.address = address;
      patient.status = true;
      patient.patientId = await nextPatientId();
      await patient.save();
    } else {
      let changed = false;
      if (name && patient.name !== name) {
        patient.name = name;
        changed = true;
      }
      if (address && patient.address !== address) {
        patient.address = address;
        changed = true;
      }
      if (changed) await patient.save();
    }

    const appt: any = new Appointments();
    appt.patient = patient._id;
    appt.date = date;
    appt.notes = notes;
    appt.status = "upcoming";
    await appt.save();

    return NextResponse.json({
      status: true,
      data: { appointment: appt, patient },
      message: "Appointment request submitted",
    });
  } catch (err) {
    console.log("web appointment book err", err);
    return NextResponse.json({
      status: false,
      message: "something went wrong",
    });
  }
}
