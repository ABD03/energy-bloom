import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

export const dynamic = "force-dynamic"; 

export async function GET(request: NextRequest) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const url: any = searchParams.get("url");
    const tag: any = searchParams.get("tag");
    if (url || tag) {
      if (tag) {
        revalidateTag(`${tag}`);
        return NextResponse.json({
          status: true,
          message: "Tag revalidated successfully",
        });
      }
      if (url) {
        revalidatePath(url);
        return NextResponse.json({
          status: true,
          message: "Path revalidated successfully",
        });
      }
    } else {
      return NextResponse.json({
        status: false,
        message: "Page url not found",
      });
    }
  } catch (error) {
    console.log("error", error);
    return NextResponse.json({
      status: false,
      data: {},
      message: "Something went wrong",
    });
  }
}
