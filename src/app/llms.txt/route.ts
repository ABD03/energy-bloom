import { NextResponse } from "next/server";
import { API } from "@/config/apis";
import { getSettings } from "../sitemap/service";

export const dynamic = "force-dynamic";

export async function GET() {
  const settingsRes = await getSettings();
  const settings = settingsRes?.data ?? null;

  const app = settings?.app || {};
  const meta = settings?.meta_data || {};
  const base = API.BASE || "";
  const siteName = app.name || "Website";
  const description = meta.meta_description || app.tagline || "";

  let content = `# ${siteName}\n\n`;
  content += `> ${description}\n\n`;
  content += `Website: ${base}\n`;
  content += `Sitemap: ${base}/sitemap.xml\n`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
    },
  });
}
