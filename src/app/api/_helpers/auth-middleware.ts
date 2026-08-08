"use server";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./jwt";

type Handler = (req: NextRequest, user: any) => Promise<Response>;

export async function withAuth(handler: Handler, roles: string[] = []) {
  return async (req: NextRequest) => {
    try {
      const token: string = (await extractToken(req)) as string;
      if (token) {
        const verify: any = await verifyToken(token);
        if (roles.length > 0 && roles.includes(verify.role)) {
          return handler(req, verify);
        } else {
          return NextResponse.json(
            { status: false, message: "access denied" },
            { status: 401 },
          );
        }
      } else {
        return NextResponse.json(
          { status: false, message: "Authentication failed" },
          { status: 401 },
        );
      }
    } catch (err) {
      return NextResponse.json(
        { status: false, data: {}, message: "Something went wrong" },
        { status: 401 },
      );
    }
  };
}

// ── helpers ──────────────────────────────────────────────────────────────────

export async function setToken(res: NextResponse, token: string) {
  res.cookies.set("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });
  return res;
}

export async function clearToken(res: NextResponse, token: string) {
  res?.cookies?.set("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return res;
}

export async function extractToken(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      return authHeader.slice(7);
    }
    const cookie = req.cookies.get("token");
    if (cookie) return cookie.value;
    return null;
  } catch (err) {
    return null;
  }
}

