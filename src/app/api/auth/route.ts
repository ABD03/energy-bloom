"use server";
import { NextRequest, NextResponse } from "next/server";

import { login } from "./controller";
import { setToken } from "@/app/api/_helpers/auth-middleware";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data: any = await login(body);
    const res = NextResponse.json({
      status: data?.status,
      data: data?.data,
      message: data?.message,
    });
    if (data?.status && data?.data?.token) {
      setToken(res, data.data.token);
    }
    return res;
  } catch (error) {
    return NextResponse.json({
      status: false,
      data: {},
      message: "Something went wrong",
    });
  }
}
