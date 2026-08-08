"use client";
import { Modal, message } from "antd";
import { GoShieldLock } from "react-icons/go";
import { Store } from "@/redux/store"; // adjust path
import { logout } from "@/redux/slice/userSlice"; // adjust path
import { API } from "@/config/apis";
export const handleUnauthorized = async () => {
  document.cookie = "token=; path=/";
  Modal.error({
    title: "",
    icon: null,
    content: (
      <div className="flex flex-col items-center justify-center text-center">
        {/* Icon */}
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-5">
          <GoShieldLock size={30} color="red" />
        </div>
        <h2 className="text-lg font-medium">Session expired</h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
          Your session has timed out due to inactivity. Please log in again to
          continue.
        </p>

        <div className="text-green-500 mb-5">
          Your data is safe. No changes were made.
        </div>
      </div>
    ),
    centered: true,
    okText: "Login Now",
    onOk: async () => {
      try {
        const state: any = Store.getState();
        const userId = state?.auth?.user?._id;
        await fetch(
          `${API.BASE}/api/${API.LOGOUT}?id=${userId}`,
        );
        Store.dispatch(logout({}));
        message.success("Logged out");
        window.location.href = "/login";
      } catch (err) {
        console.log("Logout error", err);
        window.location.href = "/login";
      }
    },
  });
};
