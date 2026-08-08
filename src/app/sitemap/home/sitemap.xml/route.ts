import { API } from "@/config/apis";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const base = API.BASE || "/";

    const pages = [
      { loc: base, changefreq: "daily", priority: "1.0" },
      { loc: `${base}/quiz`, changefreq: "daily", priority: "0.8" },
      { loc: `${base}/contact-us`, changefreq: "monthly", priority: "0.5" },
      { loc: `${base}/register`, changefreq: "monthly", priority: "0.3" },
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    for (const p of pages) {
      xml += `  <url>\n`;
      xml += `    <loc>${p.loc}</loc>\n`;
      xml += `    <changefreq>${p.changefreq}</changefreq>\n`;
      xml += `    <priority>${p.priority}</priority>\n`;
      xml += `  </url>\n`;
    }
    xml += `</urlset>`;

    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
      },
    });
  } catch (error) {
    console.error("Error generating home sitemap:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
