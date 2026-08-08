"use server";
import Settings from "@/app/api/admin/settings/modal";

async function list() {
  try {
    const settings = await Settings.findOne().lean();
    return {
      status: true,
      data: settings || {},
    };
  } catch (err) {
    console.log("err", err);
    return {
      status: false,
      data: {},
    };
  }
}

export { list };
