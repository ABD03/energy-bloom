"use server";
import Users from "../users/modal";
import Contacts from "../contact/modal";
import Media from "../media/modal";
import Pages from "../pages/modal";
import Doctors from "../doctors/modal";
import Patients from "../patients/modal";
import Appointments from "../appointments/modal";

async function list(req: any) {
  return new Promise(async (resolve, reject) => {
    try {
      const [
        contacts,
        pages,
        files,
        users,
        doctors,
        patients,
        appointments,
      ] = await Promise.all([
        Contacts.countDocuments(),
        Pages.countDocuments(),
        Media.countDocuments(),
        Users.countDocuments({ type: "editor" }),
        Doctors.countDocuments(),
        Patients.countDocuments(),
        Appointments.countDocuments(),
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
            doctors,
            patients,
            appointments,
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
