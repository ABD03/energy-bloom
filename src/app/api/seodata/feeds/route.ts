import { NextRequest, NextResponse } from "next/server";
import { getFeedData } from "./controller";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "30");
    const articles = await getFeedData(limit);

    return NextResponse.json({
      status: true,
      data: articles,
    });
  } catch {
    return NextResponse.json({
      status: false,
      data: {},
      message: "Something went wrong",
    });
  }
}
