import { NextRequest, NextResponse } from "next/server";
import { getContents } from "../../../service";
import { API } from "@/config/apis";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ page: string }> },
) {
  try {
    const { page } = await params;
    const pageNum = parseInt(page, 10);
    if (isNaN(pageNum) || pageNum < 1) {
      return new NextResponse("Invalid page", { status: 400 });
    }

    const base = API.BASE || "/";
    const response = await getContents(pageNum, 100);
    const contents = response?.data || [];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    for (const content of contents) {
      const lastmod = content.updatedAt
        ? new Date(content.updatedAt).toISOString()
        : new Date().toISOString();
      xml += `  <url>\n`;
      xml += `    <loc>${base}/${encodeURIComponent(content.permalink)}</loc>\n`;
      xml += `    <lastmod>${lastmod}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.7</priority>\n`;
      xml += `  </url>\n`;
    }
    xml += `</urlset>`;

    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
      },
    });
  } catch (error) {
    console.error("Error generating content sitemap page:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
