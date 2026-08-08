import { NextResponse } from "next/server";
import { getIndex } from "../../service";
import { API } from "@/config/apis";

export const dynamic = "force-dynamic";

const PER_PAGE = 100;

export async function GET() {
  try {
    const base = API.BASE || "/";
    const indexData = await getIndex();
    const total = indexData?.data?.content || 0;
    const pages = Math.ceil(total / PER_PAGE) || 1;

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    for (let i = 1; i <= pages; i++) {
      xml += `  <sitemap><loc>${base}/sitemap/content/${i}/sitemap.xml</loc></sitemap>\n`;
    }
    xml += `</sitemapindex>`;

    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
      },
    });
  } catch (error) {
    console.error("Error generating content sitemap index:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
