import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { writeFile } from "fs/promises";

import { withAuth } from "@/app/api/_helpers/auth-middleware";
import { API } from "@/config/apis";

export const POST = await withAuth(
  async (request: NextRequest) => {
    try {
      const formData: any = await request.formData();
      const file = formData.get("file");
      const compress = formData.get("compress") !== "false";
      if (file) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const uploadDir = path.join(process.cwd(), "uploads");
        const originalName = path.basename(file.name.replaceAll(" ", "_"));
        const baseName = path.parse(originalName).name;
        const ext = path.extname(originalName);
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        let filename: string;
        if (compress) {
          const webpBuffer = await sharp(buffer)
            .webp({ quality: 70 })
            .toBuffer();
          filename = `${baseName}.webp`;
          await writeFile(path.join(uploadDir, filename), webpBuffer);
        } else {
          filename = `${baseName}${ext}`;
          await writeFile(path.join(uploadDir, filename), buffer);
        }
        return NextResponse.json({
          status: true,
          data: {
            url: API.BASE + "/uploads/" + filename,
            filename: filename,
          },
          message: "File uploaded successfully",
        });
      } else {
        return NextResponse.json({
          status: false,
          data: { url: null },
          message: "File not found",
        });
      }
    } catch (error: any) {
      return NextResponse.json({
        status: false,
        data: {},
        message: error.message || "Something went wrong",
      });
    }
  },
  ["editor", "subscriber"],
);
