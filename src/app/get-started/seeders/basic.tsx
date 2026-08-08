import type { Connection, Types } from "mongoose";
import mongoose from "mongoose";

const looseSchema = () =>
  new mongoose.Schema({}, { strict: false, timestamps: true });

const DEFAULT_CATEGORIES = [
  { value: "General", position: 1 },
  { value: "Announcements", position: 2 },
];

const DEFAULT_TAGS = [{ value: "featured" }, { value: "trending" }];

const DEFAULT_PAGES = [
  {
    name: "About Us",
    permalink: "about-us",
    sections: "[]",
    author: "Admin",
    meta_description: "About us page",
  },
  {
    name: "Privacy Policy",
    permalink: "privacy-policy",
    sections: "[]",
    author: "Admin",
    meta_description: "Privacy policy",
  },
  {
    name: "Terms & Conditions",
    permalink: "terms-and-conditions",
    sections: "[]",
    author: "Admin",
    meta_description: "Terms and conditions",
  },
];

type SeedResult = {
  categories: { value: string; created: boolean }[];
  tags: { value: string; created: boolean }[];
  pages: { permalink: string; created: boolean }[];
};

export async function seedBasic(
  conn: Connection,
  createdBy: Types.ObjectId | string,
): Promise<SeedResult> {
  const Categories = conn.models.categories || conn.model("categories", looseSchema());
  const Tags = conn.models.tags || conn.model("tags", looseSchema());
  const Pages = conn.models.pages || conn.model("pages", looseSchema());

  const result: SeedResult = { categories: [], tags: [], pages: [] };

  for (const c of DEFAULT_CATEGORIES) {
    const existing = await Categories.findOne({ value: c.value }).lean();
    if (existing) {
      result.categories.push({ value: c.value, created: false });
      continue;
    }
    await Categories.create({ ...c, status: true, show_home: true, createdBy });
    result.categories.push({ value: c.value, created: true });
  }

  for (const t of DEFAULT_TAGS) {
    const existing = await Tags.findOne({ value: t.value }).lean();
    if (existing) {
      result.tags.push({ value: t.value, created: false });
      continue;
    }
    await Tags.create({ ...t, status: true, createdBy });
    result.tags.push({ value: t.value, created: true });
  }

  for (const p of DEFAULT_PAGES) {
    const existing = await Pages.findOne({ permalink: p.permalink }).lean();
    if (existing) {
      result.pages.push({ permalink: p.permalink, created: false });
      continue;
    }
    await Pages.create({ ...p, status: true, createdBy, editor: createdBy });
    result.pages.push({ permalink: p.permalink, created: true });
  }

  return result;
}
