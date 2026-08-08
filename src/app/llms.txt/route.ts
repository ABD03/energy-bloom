import { NextResponse } from "next/server";
import { API } from "@/config/apis";
import { getSettings, getFeeds } from "../sitemap/service";

export const dynamic = "force-dynamic";

export async function GET() {
  const [settingsRes, feedRes] = await Promise.allSettled([
    getSettings(),
    getFeeds(20),
  ]);

  const settings =
    settingsRes.status === "fulfilled" ? settingsRes.value?.data : null;
  const items =
    feedRes.status === "fulfilled" && Array.isArray(feedRes.value)
      ? feedRes.value
      : [];

  const app = settings?.app || {};
  const meta = settings?.meta_data || {};
  const base = API.BASE || "";
  const siteName = app.name || "Website";
  const description = meta.meta_description || app.tagline || "";

  let content = `# ${siteName}\n\n`;
  content += `> ${description}\n\n`;
  content += `Website: ${base}\n`;
  content += `RSS Feed: ${base}/feed.xml\n`;
  content += `Sitemap: ${base}/sitemap.xml\n\n`;
  content += `## Recent Articles\n\n`;

  for (const article of items) {
    const url = `${base}/${encodeURIComponent(article.permalink)}`;
    content += `- [${article.title}](${url})\n`;
  }

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
    },
  });
}
