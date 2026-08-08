"use server";
import { NextRequest, NextResponse } from "next/server";

import { logout } from "../controller";
import { clearToken } from "@/app/api/_helpers/auth-middleware";

export async function GET(request: NextRequest) {
  try {
    const { searchParams }: any = new URL(request.url);
    const data: any = await logout(searchParams);
    const res = NextResponse.json({
      status: data?.status,
      data: data?.data,
      message: data?.message,
    });
    if (data?.status && data?.data?.token) {
      clearToken(res, data.data.token);
    }
    return res;
  } catch (error) {
    console.log("error", error);
    return NextResponse.json({
      status: false,
      data: {},
      message: "Something went wrong",
    });
  }
}
