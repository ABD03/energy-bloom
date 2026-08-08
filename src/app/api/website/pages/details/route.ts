"use server";
import { NextRequest, NextResponse } from "next/server";
import { pageDetails } from "./controller";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const data: any = await pageDetails(searchParams);
  return NextResponse.json({
    status: data?.status,
    data: data?.data,
    message: data?.message,
  });
}
