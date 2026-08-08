import type { Connection, Types } from "mongoose";
import mongoose from "mongoose";

const looseSchema = () =>
  new mongoose.Schema({}, { strict: false, timestamps: true });

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
  pages: { permalink: string; created: boolean }[];
};

export async function seedBasic(
  conn: Connection,
  createdBy: Types.ObjectId | string,
): Promise<SeedResult> {
  const Pages = conn.models.pages || conn.model("pages", looseSchema());

  const result: SeedResult = { pages: [] };

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
