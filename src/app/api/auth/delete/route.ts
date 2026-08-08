"use server";
import { NextRequest } from "next/server";

import { deleteAccount } from "../controller";

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams }: any = new URL(request.url);
    const data: any = await deleteAccount(searchParams);
    return Response.json({
      status: data?.status,
      data: data?.data,
      message: data?.message,
    });
  } catch (error) {
    console.log("error", error);
    return Response.json({
      status: false,
      data: {},
      message: "Something went wrong",
    });
  }
}
