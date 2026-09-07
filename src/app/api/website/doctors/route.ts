"use server";
import { NextRequest, NextResponse } from "next/server";
import Doctors from "@/app/api/admin/doctors/modal";
import connectDB from "@/config/dbConnect";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("search") || "";
    const filter: any = { status: true };
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { specialization: { $regex: q, $options: "i" } },
      ];
    }
    const data = await Doctors.find(filter, {
      doctorId: 1,
      name: 1,
      specialization: 1,
      qualification: 1,
      image: 1,
      consultationFee: 1,
      experienceYears: 1,
      slots: 1,
    })
      .sort({ name: 1 })
      .limit(100)
      .lean();
    return NextResponse.json({ status: true, data, message: "doctors" });
  } catch (err) {
    console.log("web doctors err", err);
    return NextResponse.json({
      status: false,
      data: [],
      message: "something went wrong",
    });
  }
}
