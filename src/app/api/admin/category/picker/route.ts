"use server";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/app/api/_helpers/auth-middleware";
import { picker } from "../controller";

export const GET = await withAuth(
  async (request: NextRequest, user: any) => {
    const { searchParams } = new URL(request.url);
    const data: any = await picker(searchParams);
    return NextResponse.json({
      status: data?.status,
      data: data?.data,
      message: data?.message,
    });
  },
  ["editor"],
);
