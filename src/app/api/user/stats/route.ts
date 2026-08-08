"use server";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/app/api/_helpers/auth-middleware";
import Content from "@/app/api/admin/content/modal";

export const GET = await withAuth(
  async (request: NextRequest, user: any) => {
    try {
      const { searchParams } = new URL(request.url);
      const userId = searchParams.get("id") || user._id;
      const [contents] = await Promise.all([
        Content.countDocuments({ createdBy: userId }),
      ]);
      return NextResponse.json({
        status: true,
        data: { contents },
      });
    } catch (error) {
      return NextResponse.json({
        status: false,
        data: {},
        message: "Something went wrong",
      });
    }
  },
  ["editor"],
);
