"use server";

import { NextRequest, NextResponse } from "next/server";
import { add, list } from "./controller";

export async function GET(request: NextRequest) {
  try {
    const data: any = await list(request.nextUrl.searchParams);
    return NextResponse.json({
      status: data?.status,
      data: data?.data,
      meta: data?.meta,
      message: data?.message,
    });
  } catch (error) {
    return NextResponse.json({
      status: false,
      data: [],
      message: "Something went wrong",
    });
  }
}

export async function POST(request: any) {
  try {
    const res = await request.json();
    const data: any = await add(res);
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
