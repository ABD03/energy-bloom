import { Badge, message, Modal } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MdLogout } from "react-icons/md";
import { HiOutlineUserCircle } from "react-icons/hi";

import { ImageLoader } from "@/utils/common";
import { logout } from "@/redux/slice/userSlice";
import { useAppDispatch } from "@/redux/util/hooks";

import { ViewImage } from "@/utils/viewImage";
import { GET } from "@/utils/apiCalls";
import { API } from "@/config/apis";

export default function ProfilePopover(props: any) {
  const navigation = useRouter();
  const dispatch = useAppDispatch();

  const logouts = () => {
    Modal.confirm({
      title: "Are you sure you want to logout?",
      content:
        " You will be logged out of your account and redirected to the login page.",
      okText: "Yes, Logout",
      cancelText: "Cancel",
      centered: true,
      okButtonProps: {
        type: "primary",
        danger: true,
      },
      onOk() {
        logoutNow();
      },
    });
  };

  const logoutNow = async () => {
    try {
      const response: any = await GET(
        `${API.LOGOUT}?id=${props?.item?.user?._id}`,
        null,
      );
      if (response?.status) {
        document.cookie = "token=; path=/; max-age=0";
        dispatch(logout({}));
        navigation.push("/");
        message.success("Logout successfully");
      } else {
        message.error("Something went wrong");
      }
    } catch (err) {
      console.log(err);
      message.error("Something went wrong");
    }
  };

  return (
    <div className="w-53 text-center pt-4">
      <Badge color="green" dot={true}>
        <Image
          alt="profile"
          width={0}
          height={0}
          src={ViewImage(props?.item?.user?.image)}
          loader={ImageLoader}
          className="w-15 h-15 object-cover rounded-4xl!"
        />
      </Badge>
      <div className=" pb-4">
        <div>
          <div className="font-semibold text-[16px]">
            {props?.item?.user?.name || "Admin"}
          </div>
          <div className="mb-2 text-gray-500 text-[12px]">
            {props?.item?.user?.email || "admin@gmail.com"}
          </div>
        </div>
      </div>
      <div
        className="flex items-center gap-2 bg-sky-100 p-1.5 px-2 rounded-lg mb-2 text-blue-800 cursor-pointer"
        onClick={() => navigation.push("/profile")}
      >
        <div>
          <HiOutlineUserCircle size={17} />
        </div>
        <div className="font-medium text-[13px]">View Profile</div>
      </div>
      <div
        className="flex items-center gap-2 bg-red-100 p-1.5 px-2 rounded-lg text-red-500 cursor-pointer"
        onClick={() => logouts()}
      >
        <div>
          <MdLogout size={15} />
        </div>
        <div className="font-medium text-[13px]">Logout</div>
      </div>
    </div>
  );
}
