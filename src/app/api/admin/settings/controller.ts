"use server";
import { revalidateTag } from "next/cache";
import Settings from "./modal";
import Languages from "@/config/applanguages.json";

function resolveLanguage(code: string) {
  return Languages.find((l: any) => l.code === code) || { code };
}

async function list(req: any) {
  return new Promise(async (resolve, reject) => {
    try {
      const settings = await Settings.findOne();
      resolve({
        status: true,
        data: settings,
        message: "settings fetched successfully",
      });
    } catch (err) {
      console.log("err", err);
      resolve({
        status: false,
        data: {},
        message: "something went wrong",
      });
    }
  });
}

async function add(req: any) {
  return new Promise(async (resolve, reject) => {
    try {
      var settings = await Settings.findOne();
      if (!settings?._id) {
        settings = new Settings();
      }
      if (req.contact) settings.contact = req.contact;
      if (req.default_editor) settings.default_editor = req.default_editor;
      if (req.meta_data) settings.meta_data = req.meta_data;
      if (req.schema) settings.schema = req.schema;
      if (req.app) {
        if (typeof req.app.language === "string") {
          req.app.language = resolveLanguage(req.app.language);
        }
        if (Array.isArray(req.app.meta_alt_language)) {
          req.app.meta_alt_language = req.app.meta_alt_language.map(
            (code: any) => (typeof code === "string" ? resolveLanguage(code) : code),
          );
        }
        settings.app = req.app;
      }
      if (req.scripts) settings.scripts = req.scripts;
      await settings.save();
      revalidateTag("settings");
      resolve({
        status: true,
        data: settings,
        message: "settings updated successfully",
      });
    } catch (err) {
      console.log("err", err);
      resolve({
        status: false,
        data: {},
        message: "something went wrong",
      });
    }
  });
}

export { list, add };
