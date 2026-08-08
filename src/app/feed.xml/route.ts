import { NextResponse } from "next/server";
import { escapeXml, FindFileType } from "@/utils/common";
import { ViewImage } from "@/utils/viewImage";
import { API } from "@/config/apis";
import { getSettings, getFeeds } from "../sitemap/service";

export const dynamic = "force-dynamic";

export async function GET() {
  const base = API.BASE || "/";
  let app: any = {};
  let meta: any = {};
  let dEditor: any = {};
  let articles: any[] = [];

  try {
    const [settingsRes, feedData] = await Promise.allSettled([
      getSettings(),
      getFeeds(50),
    ]);

    if (settingsRes.status === "fulfilled") {
      const settings = settingsRes.value?.data;
      app = settings?.app || {};
      meta = settings?.meta_data || {};
      dEditor = settings?.default_editor || {};
    }

    if (feedData.status === "fulfilled") {
      articles = Array.isArray(feedData.value) ? feedData.value : [];
    }
  } catch {
    // continue with empty data
  }

  const siteName = app.name || "Website";
  const description = meta.meta_description || app.tagline || "";
  const language = app.language?.locale || "en-US";

  const lastBuild = articles.length
    ? new Date(articles[0].publishedAt || articles[0].createdAt).toUTCString()
    : new Date().toUTCString();

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<rss version="2.0"`;
  xml += ` xmlns:atom="http://www.w3.org/2005/Atom"`;
  xml += ` xmlns:media="http://search.yahoo.com/mrss/"`;
  xml += ` xmlns:content="http://purl.org/rss/1.0/modules/content/"`;
  xml += ` xmlns:dc="http://purl.org/dc/elements/1.1/"`;
  xml += `>\n`;
  xml += `  <channel>\n`;
  xml += `    <title>${escapeXml(siteName)}</title>\n`;
  xml += `    <link>${base}</link>\n`;
  xml += `    <description>${escapeXml(description)}</description>\n`;
  xml += `    <language>${language}</language>\n`;
  xml += `    <pubDate>${lastBuild}</pubDate>\n`;
  xml += `    <lastBuildDate>${lastBuild}</lastBuildDate>\n`;
  xml += `    <atom:link href="${base}/feed.xml" rel="self" type="application/rss+xml" />\n`;

  if (app.favicon) {
    xml += `    <image>\n`;
    xml += `      <url>${ViewImage(app.favicon)}</url>\n`;
    xml += `      <title>${escapeXml(siteName)}</title>\n`;
    xml += `      <link>${base}</link>\n`;
    xml += `    </image>\n`;
  }

  for (const article of articles) {
    try {
      const pubDate = new Date(
        article.publishedAt || article.createdAt,
      ).toUTCString();
      const imageUrl = article.image ? ViewImage(article.image) : "";
      const imageType = article.image ? FindFileType(article.image) : "";
      const editorName =
        (article.editor as any)?.name || dEditor.name || article.author || "";
      const articleUrl = `${base}/${encodeURIComponent(article.permalink)}`;

      xml += `    <item>\n`;
      xml += `      <title>${escapeXml(article.title)}</title>\n`;
      xml += `      <link>${articleUrl}</link>\n`;
      xml += `      <guid isPermaLink="true">${articleUrl}</guid>\n`;
      xml += `      <pubDate>${pubDate}</pubDate>\n`;

      if (editorName) {
        xml += `      <dc:creator>${escapeXml(editorName)}</dc:creator>\n`;
      }

      if (article.description) {
        xml += `      <description>${escapeXml(article.description)}</description>\n`;
      }

      if (article.content) {
        xml += `      <content:encoded><![CDATA[${article.content}]]></content:encoded>\n`;
      }

      const categories = article.category || [];
      for (const cat of categories) {
        if (cat.label) {
          xml += `      <category>${escapeXml(cat.label)}</category>\n`;
        }
      }

      const tags = article.tags || [];
      for (const tag of tags) {
        if (tag.label) {
          xml += `      <category>${escapeXml(tag.label)}</category>\n`;
        }
      }

      if (imageUrl) {
        xml += `      <media:content url="${imageUrl}" medium="image" type="${imageType}" width="1200" height="630" />\n`;
        xml += `      <media:thumbnail url="${imageUrl}" width="1200" height="630" />\n`;
      }

      xml += `    </item>\n`;
    } catch {
      // skip malformed article
    }
  }

  xml += `  </channel>\n`;
  xml += `</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
    },
  });
}
