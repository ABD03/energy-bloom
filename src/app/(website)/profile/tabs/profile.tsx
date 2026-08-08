"use client";

import { useState } from "react";
import { Button, Card, message } from "antd";
import { useRouter } from "next/navigation";
import { MdOutlineEmail, MdOutlinePhone } from "react-icons/md";
import { IoLogOutOutline } from "react-icons/io5";
import { RiEditLine } from "react-icons/ri";
import { HiUser } from "react-icons/hi2";

import ProfileForm from "../_components/profileForm";
import DeleteForm from "../_components/deleteForm";

import { useAppDispatch } from "@/redux/util/hooks";
import { logout as logoutAction } from "@/redux/slice/userSlice";
import { GET } from "@/utils/apiCalls";
import { API } from "@/config/apis";

export default function Profile({ Auth }: any) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = Auth?.user || {};
  const [editing, setEditing] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await GET(`${API.LOGOUT}?id=${user?._id}`, null);
    } catch {
      /* ignore */
    }
    document.cookie = "token=; path=/; max-age=0";
    dispatch(logoutAction({} as any));
    message.success("Logged out");
    router.push("/");
  };

  const infoItems = [
    {
      icon: <HiUser size={18} />,
      label: "Name",
      value: user?.name || "-",
    },
    {
      icon: <MdOutlineEmail size={18} />,
      label: "Email",
      value: user?.email || "-",
    },
    {
      icon: <MdOutlinePhone size={18} />,
      label: "Phone",
      value: user?.phone || "-",
    },
  ];

  return (
    <div className="w-full pb-10 sm:mt-4">
      <Card
        title="Profile Information"
        size="small"
        className="mt-4!"
        extra={
          !editing && (
            <Button
              type="link"
              className="p-0!"
              icon={<RiEditLine size={16} />}
              onClick={() => setEditing(true)}
            >
              Edit
            </Button>
          )
        }
      >
        {infoItems.map((item) => (
          <div key={item.label} className="flex gap-4 py-2 px-2">
            <div className="text-primary">{item.icon}</div>
            <div className="flex-1 -mt-1">
              <div className="text-[11px] text-gray-400">{item.label}</div>
              <div className="text-sm font-medium">{item.value}</div>
            </div>
          </div>
        ))}
        <div className="flex gap-4 py-2 px-2">
          <div className="text-primary">
            <IoLogOutOutline size={20} />
          </div>
          <div className="flex-1 -mt-1">
            <div className="text-[11px] text-gray-400">Logout</div>
            <div className="text-sm font-medium">
              Are you sure you want to log out? You'll need to sign in again to
              access your account.
            </div>
          </div>
          <Button
            loading={logoutLoading}
            onClick={handleLogout}
            danger
            className="bg-red-600! text-white!"
          >
            Logout
          </Button>
        </div>
      </Card>

      <ProfileForm
        open={editing}
        user={user}
        onClose={() => setEditing(false)}
      />

      <DeleteForm user={user} />
    </div>
  );
}
