"use server";
import { NextResponse } from "next/server";
import { PrimaryContnents } from "./controller";

export async function GET() {
  const data: any = await PrimaryContnents();
  return NextResponse.json({
    status: data?.status,
    data: data?.data,
    message: data?.message,
  });
}
