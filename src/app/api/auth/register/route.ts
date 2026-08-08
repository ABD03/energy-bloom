"use server";
import { NextRequest } from "next/server";

import { register } from "../controller";

export async function POST(request: NextRequest) {
  try {
    const res = await request.json();
    const data: any = await register(res);
    return Response.json({
      status: data?.status,
      data: data?.data,
      message: data?.message,
    });
  } catch (error) {
    return Response.json({
      status: false,
      data: {},
      message: "Something went wrong",
    });
  }
}
