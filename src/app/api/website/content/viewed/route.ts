"use server";

import { NextResponse } from "next/server";
import { viewed } from "./controller";

export async function GET(request: any) {
  try {
    const { searchParams } = new URL(request.url);
    const data: any = await viewed(searchParams);
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
