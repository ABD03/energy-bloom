"use server";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/app/api/_helpers/auth-middleware";
import Users from "@/app/api/admin/users/modal";
import Patients from "@/app/api/admin/patients/modal";
import Doctors from "@/app/api/admin/doctors/modal";
import { add } from "@/app/api/admin/appointments/controller";

async function ensurePatient(userId: string) {
  const user = await Users.findById(userId).lean<any>();
  if (!user) return null;
  let patient: any = null;
  if (user.email) patient = await Patients.findOne({ email: user.email });
  if (!patient && user.phone) patient = await Patients.findOne({ phone: user.phone });
  if (patient?._id) return patient;
  // create a lightweight patient record so appointments reference stays consistent
  const created = new Patients();
  created.name = user.name || user.username || "Patient";
  if (user.email) created.email = user.email;
  if (user.phone) created.phone = user.phone;
  created.image = user.image;
  created.status = true;
  // patientId auto-generation: use next by counting
  const last = await Patients.findOne({ patientId: { $regex: /^P\d+$/ } })
    .sort({ patientId: -1 })
    .collation({ locale: "en_US", numericOrdering: true })
    .select("patientId")
    .lean<{ patientId?: string }>();
  const n = last?.patientId ? parseInt(last.patientId.slice(1), 10) : 0;
  created.patientId = `P${String(n + 1).padStart(2, "0")}`;
  await created.save();
  return created;
}

export const POST = await withAuth(
  async (request: NextRequest, user: any) => {
    try {
      const body = await request.json();
      const patient = await ensurePatient(user?._id || user?.id);
      if (!patient?._id) {
        return NextResponse.json({
          status: false,
          message: "Could not resolve your account",
        });
      }
      let fee = 0;
      if (body?.doctor) {
        const doc = await Doctors.findById(body.doctor)
          .select("consultationFee")
          .lean<any>();
        fee = doc?.consultationFee ?? 0;
      }
      const res: any = await add({
        createdBy: user?._id || user?.id,
        patient: patient._id,
        doctor: body?.doctor,
        date: body?.date,
        slot: body?.slot || null,
        fee,
        notes: body?.notes,
        status: "upcoming",
      });
      return NextResponse.json({
        status: res?.status,
        data: res?.data,
        message: res?.message,
      });
    } catch (err) {
      console.log("web appointment book err", err);
      return NextResponse.json({
        status: false,
        message: "something went wrong",
      });
    }
  },
  ["user"],
);
