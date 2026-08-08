import { API } from "@/config/apis";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const base = API.BASE || "/";
    const now = new Date().toISOString();
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    xml += `  <sitemap><loc>${base}/sitemap/home/sitemap.xml</loc><lastmod>${now}</lastmod></sitemap>\n`;
    xml += `  <sitemap><loc>${base}/sitemap/pages/sitemap.xml</loc><lastmod>${now}</lastmod></sitemap>\n`;
    xml += `  <sitemap><loc>${base}/sitemap/content/sitemap.xml</loc><lastmod>${now}</lastmod></sitemap>\n`;
    xml += `  <sitemap><loc>${base}/sitemap/category/sitemap.xml</loc><lastmod>${now}</lastmod></sitemap>\n`;
    xml += `</sitemapindex>`;
    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
      },
    });
  } catch (error) {
    console.error("Error generating root sitemap index:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
