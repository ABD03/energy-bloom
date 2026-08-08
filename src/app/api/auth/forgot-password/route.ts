"use server";
import { NextRequest, NextResponse } from "next/server";
import { verifyEmail, resetPassword } from "../controller";

export async function POST(request: NextRequest) {
  try {
    const res = await request.json();
    const data: any = await verifyEmail(res);
    return NextResponse.json({
      status: data?.status,
      data: data?.data,
      message: data?.message,
    });
  } catch (error) {
    return NextResponse.json({
      status: false,
      data: {},
      message: "Something went wrong",
    });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const res = await request.json();
    const data: any = await resetPassword(res);
    return NextResponse.json({
      status: data?.status,
      data: data?.data,
      message: data?.message,
    });
  } catch (error) {
    return NextResponse.json({
      status: false,
      data: {},
      message: "Something went wrong",
    });
  }
}
