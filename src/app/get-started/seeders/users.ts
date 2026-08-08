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
  access: number[];
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
    access: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
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
    conn.model(
      "users",
      new mongoose.Schema({}, { strict: false, timestamps: true }),
    );

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
