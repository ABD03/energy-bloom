import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const configured = !!process.env.NEXT_PUBLIC_NAME?.trim();
  const { pathname } = req.nextUrl;

  if (!configured && pathname !== "/get-started") {
    const url = req.nextUrl.clone();
    url.pathname = "/get-started";
    return NextResponse.redirect(url);
  }

  if (configured && pathname === "/get-started") {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};