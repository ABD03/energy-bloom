"use server";
import { NextRequest, NextResponse } from "next/server";
import { filters } from "./controller";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const data: any = await filters(searchParams);
  return NextResponse.json({
    status: data?.status,
    data: data?.data,
    meta: data?.meta,
    message: data?.message,
  });
}
