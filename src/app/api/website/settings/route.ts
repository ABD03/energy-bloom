import { NextResponse } from "next/server";
import { list } from "./controller";

export async function GET() {
  const data: any = await list();
  return NextResponse.json({
    status: data?.status,
    data: data?.data,
  });
}
