"use server";
import Content from "../../../admin/content/modal";

async function viewed(req: any) {
  try {
    const permalink = req.get("permalink");
    const result = await Content.updateOne(
      { permalink },
      { $inc: { views: 1 } },
    );
    if (result.matchedCount > 0) {
      return { status: true, data: {}, message: "viewed successfully" };
    }
    return { status: false, data: {}, message: "content not found" };
  } catch {
    return { status: false, data: {}, message: "something went wrong" };
  }
}

export { viewed };
  