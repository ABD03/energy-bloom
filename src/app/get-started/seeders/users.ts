import type { Connection } from "mongoose";
import mongoose from "mongoose";
import { hashPassword } from "@/app/api/_helpers/password";

type SeededUser = {
  name: string;
  email: string;
  username: string;
  password: string;
  role: string;
  type: "editor" | "subscriber";
  access: string[];
  verify: boolean;
  status: boolean;
};

const DEFAULTS: SeededUser[] = [
  {
    name: "Admin",
    email: "admin@example.com",
    username: "admin",
    password: "admin@123",
    role: "admin",
    type: "editor",
    access: ["*"],
    verify: true,
    status: true,
  },
  {
    name: "User",
    email: "user@example.com",
    username: "user",
    password: "user@123",
    role: "user",
    type: "subscriber",
    access: [],
    verify: true,
    status: true,
  },
];

export async function seedUsers(conn: Connection) {
  const Users =
    conn.models.users ||
    conn.model("users", new mongoose.Schema({}, { strict: false, timestamps: true }));

  const results: { email: string; created: boolean }[] = [];
  let adminId: any = null;

  for (const u of DEFAULTS) {
    const existing: any = await Users.findOne({ email: u.email }).lean();
    if (existing) {
      results.push({ email: u.email, created: false });
      if (u.role === "admin") adminId = existing._id;
      continue;
    }
    const created: any = await Users.create({
      ...u,
      password: await hashPassword(u.password),
    });
    results.push({ email: u.email, created: true });
    if (u.role === "admin") adminId = created._id;
  }
  return { results, adminId };
}
