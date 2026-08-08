import { NextResponse } from "next/server";
import Content from "@/app/api/admin/content/modal";

export async function GET() {
  try {
    const [content] = await Promise.all([
      Content.countDocuments({ status: "published" }),
    ]);
    return NextResponse.json({
      status: true,
      data: {
        content,
      },
    });
  } catch {
    return NextResponse.json({
      status: false,
      data: {},
      message: "Something went wrong",
    });
  }
}
