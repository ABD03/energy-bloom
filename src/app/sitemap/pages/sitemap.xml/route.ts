import { NextResponse } from "next/server";
import { getMasterData } from "../../service";
import { API } from "@/config/apis";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const masterData = await getMasterData();
    const base = API.BASE || "/";
    const pages = masterData?.data?.pages || [];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    for (const item of pages) {
      const lastmod = item?.updatedAt
        ? new Date(item.updatedAt).toISOString()
        : new Date().toISOString();
      xml += `  <url>\n`;
      xml += `    <loc>${base}/page/${encodeURIComponent(item.permalink)}</loc>\n`;
      xml += `    <lastmod>${lastmod}</lastmod>\n`;
      xml += `    <changefreq>monthly</changefreq>\n`;
      xml += `    <priority>0.5</priority>\n`;
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
    console.error("Error generating pages sitemap:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
