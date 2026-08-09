"use server";
import Users from "../users/modal";
import Contacts from "../contact/modal";
import Media from "../media/modal";
import Pages from "../pages/modal";
async function list(req: any) {
  return new Promise(async (resolve, reject) => {
    try {
      const [contacts, pages, files, users] = await Promise.all([
        Contacts.countDocuments(),
        Pages.countDocuments(),
        Media.countDocuments(),
        Users.countDocuments({ type: "editor" }),
      ]);

      resolve({
        status: true,
        message: "all statics",
        data: {
          counts: {
            contacts,
            pages,
            files,
            users,
          },
        },
      });
    } catch (err) {
      console.log("err  = = = >", err);
      resolve({
        status: false,
        data: {},
        message: "something went wrong",
      });
    }
  });
}

export { list };
