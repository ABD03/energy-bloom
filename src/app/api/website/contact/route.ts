"use server";
import { NextRequest, NextResponse } from "next/server";
import { add } from "@/app/api/admin/contact/controller";
import { RateLimit } from "@/utils/common";

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const { allowed } = RateLimit(ip, { limit: 5, windowMs: 60_000 });
    if (!allowed) {
      return NextResponse.json(
        { status: false, data: {}, message: "Too many requests, please try again later" },
        { status: 429 },
      );
    }

    const body = await request.json();
    const data: any = await add(body);
    return NextResponse.json({
      status: data?.status,
      data: data?.data,
      message: data?.message,
    });
  } catch (err) {
    return NextResponse.json({
      status: false,
      data: {},
      message: "something went wrong",
    });
  }
}
