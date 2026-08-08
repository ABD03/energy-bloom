"use server";
import Users from "../admin/users/modal";
import { signToken } from "@/app/api/_helpers/jwt";
import { hashPassword, verifyPassword } from "@/app/api/_helpers/password";

async function login(req: any) {
  return new Promise(async (resolve, reject) => {
    try {
      var user = await Users.findOne({
        $or: [{ username: req.email }, { email: req.email }],
      });
      if (user) {
        const match = await verifyPassword(req.password, user.password);
        if (match) {
          const id = JSON.parse(JSON.stringify(user?._id));
          const token = await signToken({
            userId: id,
            email: user?.email,
            role: user?.type
          });
          user.token = token;
          user.lastLogin = Date.now();
          await user.save();
          resolve({
            status: user?.status,
            data: user?.status ? user : {},
            message: user?.status ? "Login successfully" : "Account blocked",
          });
        } else {
          resolve({
            status: false,
            data: {},
            message: "Password not match",
          });
        }
      } else {
        resolve({
          status: false,
          data: {},
          message: "user not found",
        });
      }
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

async function logout(req: any) {
  return new Promise(async (resolve, reject) => {
    try {
      const id = req.get("id");
      var user = await Users.findOne({ _id: id });
      resolve({
        status: true,
        data: user,
        message: "Logout successfully",
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

async function register(req: any) {
  return new Promise(async (resolve, reject) => {
    try {
      const check = await Users.findOne({
        $or: [{ username: req.username }, { email: req.email }],
      });
      if (!check?._id) {
        let user = new Users();
        if (req.username) user.username = req.username;
        if (req.password) user.password = await hashPassword(req.password);
        if (req.name) user.name = req.name;
        if (req.email) user.email = req.email;
        if (req.phone) user.phone = req.phone;
        user.role = "user";
        user.type = "subscriber";
        user.access = [];
        user.status = true;
        await user.save();
        resolve({
          status: true,
          data: user,
          message: "Registered successfully",
        });
      } else {
        resolve({
          status: false,
          data: {},
          message: "Please try another email or username",
        });
      }
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

async function changePassword(req: any) {
  return new Promise(async (resolve, reject) => {
    try {
      var user = await Users.findOne({ _id: req._id });
      const currentMatch =
        user && (await verifyPassword(req.current, user.password));
      if (user && currentMatch) {
        user.password = await hashPassword(req.password);
        await user.save();
        resolve({
          status: true,
          data: user,
          message: "Password updated successfully",
        });
      } else {
        resolve({
          status: false,
          data: {},
          message: "Current password not matching",
        });
      }
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

async function update(req: any) {
  return new Promise(async (resolve, reject) => {
    try {
      var user = await Users.findOne({ _id: req._id });
      if (user) {
        if (req.name) user.name = req.name;
        if (req.email) user.email = req.email;
        if (req.phone) user.phone = req.phone;
        if (req.bio) user.bio = req.bio;
        user.image = req.image;
        await user.save();
        resolve({
          status: true,
          data: user,
          message: "Profile updated successfully",
        });
      } else {
        resolve({
          status: false,
          data: {},
          message: "User not found",
        });
      }
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

async function deleteAccount(req: any) {
  return new Promise(async (resolve, reject) => {
    try {
      const id = req.get("id");
      const check = await Users.findOne({ _id: id });
      if (check?._id) {
        await Users.deleteOne({ _id: id });
        resolve({
          status: true,
          data: check,
          message: "account deleted successfully",
        });
      } else {
        resolve({
          status: false,
          data: {},
          message: "account not found",
        });
      }
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

async function profile(req: any) {
  return new Promise(async (resolve, reject) => {
    try {
      const id = req.get("id");
      console.log(id);
      resolve({
        status: true,
        counts: {
          content: 0,
          reads: 0,
        },
        message: "profile details",
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

async function verifyEmail(req: any) {
  return new Promise(async (resolve) => {
    try {
      const user = await Users.findOne(
        { email: req.email, type: "subscriber" },
        { password: 0 },
      );
      if (user?._id) {
        resolve({
          status: true,
          data: { email: user.email },
          message: "Email verified",
        });
      } else {
        resolve({
          status: false,
          data: {},
          message: "No account found with this email",
        });
      }
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

async function resetPassword(req: any) {
  return new Promise(async (resolve) => {
    try {
      const user = await Users.findOne({
        email: req.email,
        type: "subscriber",
      });
      if (user?._id) {
        user.password = await hashPassword(req.password);
        await user.save();
        resolve({
          status: true,
          data: {},
          message: "Password reset successfully",
        });
      } else {
        resolve({
          status: false,
          data: {},
          message: "No account found with this email",
        });
      }
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

export {
  login,
  logout,
  register,
  changePassword,
  update,
  deleteAccount,
  profile,
  verifyEmail,
  resetPassword,
};
