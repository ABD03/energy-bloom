"use server";
import mongoose from "mongoose";

import Statics from "@/app/api/statistics/modal";
import Users from "@/app/api/admin/users/modal";
import Media from "@/app/api/admin/media/modal";
import Settings from "@/app/api/admin/settings/modal";
import Contacts from "@/app/api/admin/contact/modal";
import Pages from "@/app/api/admin/pages/modal";

const DATABASE_URI: any = process.env.DATABASE_URI;

let cached = (global as any).mongoose;
if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}
async function connectDB() {
  try {
    if (cached.conn) {
      console.log("DB-OLD == == == == == == == == == == ==");
      return cached.conn;
    }
    if (!cached.promise) {
      const opts = {
        bufferCommands: true,
      };
      cached.promise = await mongoose
        .connect(DATABASE_URI, opts)
        .then((mongoose) => {
          console.log("DB-NEW == == == == == == == == == == ==");
          return mongoose;
        });
    }
    cached.conn = await cached.promise;
    Statics.init();
    Users.init();
    Media.init();
    Settings.init();
    Contacts.init();
    Pages.init();
    return cached.conn;
  } catch (err) {
    console.log("DB-ERROR == == == == == == == == == == ==", err);
  }
}

export default connectDB;
