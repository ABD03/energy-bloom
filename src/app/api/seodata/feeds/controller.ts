"use server";
import Content from "@/app/api/admin/content/modal";

export async function getFeedData(limit: number = 30) {
  const articles = await Content.find(
    { status: "published" },
    {
      title: 1,
      description: 1,
      content: 1,
      permalink: 1,
      image: 1,
      category: 1,
      tags: 1,
      language: 1,
      author: 1,
      updatedAt: 1,
      publishedAt: 1,
      createdAt: 1,
      editor: 1,
    },
  )
    .populate("editor", "name image")
    .sort({ publishedAt: -1, createdAt: -1 })
    .limit(limit)
    .lean();

  return articles;
}
