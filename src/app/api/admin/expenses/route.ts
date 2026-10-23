"use server";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/app/api/_helpers/auth-middleware";
import { list, add, update, deleted } from "./controller";

export const GET = await withAuth(
  async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    const data: any = await list(searchParams);
    return NextResponse.json({
      status: data?.status,
      data: data?.data,
      message: data?.message,
    });
  },
  ["editor"],
);

export const POST = await withAuth(
  async (request: NextRequest, user: any) => {
    const res = await request.json();
    // Who added it comes from the verified token, not from the request body.
    const data: any = await add(res, user?.userId);
    return NextResponse.json({
      status: data?.status,
      data: data?.data,
      message: data?.message,
    });
  },
  ["editor"],
);

export const PUT = await withAuth(
  async (request: NextRequest) => {
    const res = await request.json();
    const data: any = await update(res);
    return NextResponse.json({
      status: data?.status,
      data: data?.data,
      message: data?.message,
    });
  },
  ["editor"],
);

export const DELETE = await withAuth(
  async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    const data: any = await deleted(searchParams);
    return NextResponse.json({
      status: data?.status,
      data: data?.data,
      message: data?.message,
    });
  },
  ["editor"],
);
