"use server";

import { writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import { randomBytes } from "node:crypto";
import mongoose from "mongoose";
import { seedUsers } from "./seeders/users";
import { seedBasic } from "./seeders/basic";

export type Step1Payload = {
  name: string;
  databaseUri: string;
  encryptKey: string;
  s3Url: string;
  s3Bucket: string;
  s3Folder: string;
  s3Region: string;
  s3AccessKey: string;
  s3SecretKey: string;
  primaryColor: string;
};

const ENV_KEYS = {
  databaseUri: "DATABASE_URI",
  s3Url: "NEXT_PUBLIC_S3_URL",
  s3Bucket: "S3_BUCKET_NAME",
  s3Folder: "S3_FOLDER",
  s3Region: "S3_BUCKET_REGION",
  s3AccessKey: "S3_ACCESS_KEY",
  s3SecretKey: "S3_SECRET_KEY",
} as const;

const APP_NAME_KEY = "NEXT_PUBLIC_NAME";

function upsertEnv(source: string, key: string, value: string) {
  const line = `${key}=${JSON.stringify(value)}`;
  const re = new RegExp(`^${key}=.*$`, "m");
  return re.test(source) ? source.replace(re, line) : `${source.trim()}\n${line}\n`;
}

async function updatePrimaryColor(color: string) {
  const cssPath = path.join(process.cwd(), "src/app/globals.css");
  const css = await readFile(cssPath, "utf8");
  const re = /--color-primary:\s*[^;]+;/;
  const next = re.test(css) ? css.replace(re, `--color-primary: ${color};`) : css;
  if (next !== css) await writeFile(cssPath, next, "utf8");
}

export async function getExistingConfig() {
  const cssPath = path.join(process.cwd(), "src/app/globals.css");
  let primaryColor = "#6104cc";
  try {
    const css = await readFile(cssPath, "utf8");
    const m = css.match(/--color-primary:\s*([^;]+);/);
    if (m) primaryColor = m[1].trim();
  } catch {}

  return {
    name: process.env.NEXT_PUBLIC_NAME || "",
    databaseUri: process.env.DATABASE_URI || "",
    encryptKey: process.env.NEXT_PUBLIC_ENCRYPT_KEY || "",
    s3Url: process.env.NEXT_PUBLIC_S3_URL || "",
    s3Bucket: process.env.S3_BUCKET_NAME || "",
    s3Folder: process.env.S3_FOLDER || "",
    s3Region: process.env.S3_BUCKET_REGION || "",
    s3AccessKey: process.env.S3_ACCESS_KEY || "",
    s3SecretKey: process.env.S3_SECRET_KEY || "",
    primaryColor,
  };
}

export async function getExistingSettings() {
  const uri = process.env.DATABASE_URI;
  if (!uri) return null;
  try {
    const conn = await mongoose.createConnection(uri, {
      serverSelectionTimeoutMS: 5000,
    }).asPromise();
    try {
      const Settings =
        conn.models.settings ||
        conn.model(
          "settings",
          new mongoose.Schema({}, { strict: false, timestamps: true }),
        );
      const doc: any = await Settings.findOne({}).lean();
      if (!doc) return null;
      return {
        name: doc?.app?.name || "",
        tagline: doc?.app?.tagline || "",
        metaTitle: doc?.meta_data?.meta_title || "",
        metaDescription: doc?.meta_data?.meta_description || "",
        contactEmail: doc?.contact?.email || "",
      };
    } finally {
      await conn.close();
    }
  } catch {
    return null;
  }
}

export async function saveStep1(payload: Step1Payload) {
  const envPath = path.join(process.cwd(), ".env.local");
  let source = "";
  try {
    source = await readFile(envPath, "utf8");
  } catch {}

  (Object.keys(ENV_KEYS) as (keyof typeof ENV_KEYS)[]).forEach((k) => {
    source = upsertEnv(source, ENV_KEYS[k], (payload as any)[k] ?? "");
  });

  if (payload.encryptKey) {
    source = upsertEnv(source, "NEXT_PUBLIC_ENCRYPT_KEY", payload.encryptKey);
  } else if (!/^NEXT_PUBLIC_ENCRYPT_KEY=.+$/m.test(source)) {
    source = upsertEnv(
      source,
      "NEXT_PUBLIC_ENCRYPT_KEY",
      randomBytes(32).toString("hex"),
    );
  }

  await writeFile(envPath, source.trimStart(), "utf8");
  await updatePrimaryColor(payload.primaryColor);

  return { ok: true };
}

export async function commitAppName(name: string) {
  const trimmed = name?.trim();
  if (!trimmed) return { ok: false, message: "App name is empty" };
  const envPath = path.join(process.cwd(), ".env.local");
  let source = "";
  try {
    source = await readFile(envPath, "utf8");
  } catch {}
  source = upsertEnv(source, APP_NAME_KEY, trimmed);
  await writeFile(envPath, source.trimStart(), "utf8");
  return { ok: true };
}

export async function testDatabase(uri: string) {
  const target = uri?.trim() || process.env.DATABASE_URI || "";
  if (!target) return { ok: false, message: "No DATABASE_URI provided" };
  try {
    const conn = await mongoose.createConnection(target, {
      serverSelectionTimeoutMS: 8000,
    }).asPromise();
    await conn.close();
    return { ok: true, message: "Connected successfully" };
  } catch (err: any) {
    return { ok: false, message: err?.message || "Connection failed" };
  }
}

export async function testUpload() {
  const {
    NEXT_PUBLIC_S3_URL,
    S3_BUCKET_NAME,
    S3_FOLDER,
    S3_BUCKET_REGION,
    S3_ACCESS_KEY,
    S3_SECRET_KEY,
  } = process.env;

  if (
    !S3_BUCKET_NAME ||
    !S3_BUCKET_REGION ||
    !S3_ACCESS_KEY ||
    !S3_SECRET_KEY
  ) {
    return { ok: false, message: "Missing S3 env vars. Restart the dev server after step 1." };
  }

  let S3Mod: any;
  try {
    S3Mod = await import("@aws-sdk/client-s3");
  } catch {
    return {
      ok: false,
      message: "Install @aws-sdk/client-s3 to enable this check.",
    };
  }
  const { S3Client, PutObjectCommand, DeleteObjectCommand } = S3Mod;

  const client = new S3Client({
    region: S3_BUCKET_REGION,
    credentials: {
      accessKeyId: S3_ACCESS_KEY,
      secretAccessKey: S3_SECRET_KEY,
    },
  });

  const key = `${S3_FOLDER ? S3_FOLDER.replace(/\/+$/, "") + "/" : ""}.setup-check-${Date.now()}.txt`;
  try {
    await client.send(
      new PutObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: key,
        Body: "ok",
        ContentType: "text/plain",
      }),
    );
    await client.send(
      new DeleteObjectCommand({ Bucket: S3_BUCKET_NAME, Key: key }),
    );
    return {
      ok: true,
      message: `Uploaded & deleted test file${NEXT_PUBLIC_S3_URL ? ` at ${NEXT_PUBLIC_S3_URL}` : ""}`,
    };
  } catch (err: any) {
    return { ok: false, message: err?.message || "Upload failed" };
  }
}

export type SettingsPayload = {
  name: string;
  tagline?: string;
  metaTitle?: string;
  metaDescription?: string;
  contactEmail?: string;
};

export async function saveSettings(payload: SettingsPayload) {
  const uri = process.env.DATABASE_URI;
  if (!uri) return { ok: false, message: "DATABASE_URI missing. Restart the dev server." };

  const conn = await mongoose.createConnection(uri, {
    serverSelectionTimeoutMS: 8000,
  }).asPromise();

  try {
    const Settings =
      conn.models.settings ||
      conn.model(
        "settings",
        new mongoose.Schema({}, { strict: false, timestamps: true }),
      );

    await Settings.findOneAndUpdate(
      {},
      {
        $set: {
          "app.name": payload.name,
          "app.tagline": payload.tagline || "",
          "meta_data.meta_title": payload.metaTitle || "",
          "meta_data.meta_description": payload.metaDescription || "",
          "contact.email": payload.contactEmail || "",
        },
      },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
    );

    const { results: seeded, adminId } = await seedUsers(conn);
    const basicSeed = adminId ? await seedBasic(conn, adminId) : null;
    return { ok: true, seeded, basicSeed };
  } catch (err: any) {
    return { ok: false, message: err?.message || "Save failed" };
  } finally {
    await conn.close();
  }
}
