"use server";
import { NextRequest } from "next/server";

import { profile } from "../controller";

export async function GET(request: NextRequest) {
  try {
    const { searchParams }: any = new URL(request.url);
    const data: any = await profile(searchParams);
    return Response.json({
      status: data?.status,
      counts: data?.counts,
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
