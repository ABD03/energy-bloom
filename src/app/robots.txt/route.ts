import { getSettings } from "../sitemap/service";

export async function GET() {
  const settings = await getSettings();
  const app = settings?.data?.app || {};
  const body = app.robots_txt;
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
    },
  });
}
