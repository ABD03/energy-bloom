import { NextResponse } from "next/server";
import { getSettings } from "../sitemap/service";

export async function GET() {
  try {
    const settings = await getSettings();
    const app = settings?.data?.app || {};
    if (app.manifest_json) {
      return new NextResponse(app.manifest_json, {
        headers: {
          "Content-Type": "application/manifest+json; charset=utf-8",
          "Cache-Control":
            "public, s-maxage=86400, stale-while-revalidate=43200",
        },
      });
    }else {
      return new NextResponse(JSON.stringify({ name: "App", start_url: "/" }), {
        headers: { "Content-Type": "application/manifest+json" },
      });
    }
  } catch {
    return new NextResponse(JSON.stringify({ name: "App", start_url: "/" }), {
      headers: { "Content-Type": "application/manifest+json" },
    });
  }
}
