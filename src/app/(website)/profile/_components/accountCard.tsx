"use client";

import { useRef, useState } from "react";
import { Avatar, Tag, message } from "antd";
import { MdOutlineCameraAlt } from "react-icons/md";
import { IoIosCheckmarkCircle } from "react-icons/io";

import { dayjs } from "@/utils/common";
import { ViewImage } from "@/utils/viewImage";
import { useAppDispatch } from "@/redux/util/hooks";
import { update as updateUser } from "@/redux/slice/userSlice";
import { UPLOAD_FILE, PUT } from "@/utils/apiCalls";
import { API } from "@/config/apis";

export default function AccountCard({ Auth }: any) {
  const user = Auth?.user || {};
  const dispatch = useAppDispatch();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const uploaded: any = await UPLOAD_FILE(file, true);
      if (uploaded?.file) {
        const response: any = await PUT(API.UPDATE_PROFILE, {
          _id: user?._id,
          image: uploaded.file,
        });
        if (response?.status) {
          dispatch(updateUser(response.data));
          message.success("Profile picture updated");
        } else {
          message.error(response?.message || "Failed to update");
        }
      }
    } catch {
      message.error("Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="w-full bg-(--background) rounded-2xl overflow-hidden">
      <div className="h-36 sm:h-45 w-full relative overflow-hidden bg-linear-to-tr from-primary/50 to-primary/10">
        <div className="flex items-end justify-end p-2 px-4">
          <span>
            <Tag color="blue">{user?.role}</Tag>
          </span>
        </div>
        <svg
          className="absolute inset-0 w-full h-full text-primary"
          preserveAspectRatio="none"
          viewBox="0 0 800 300"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,200 C150,160 300,240 500,180 C650,140 750,200 800,170 L800,300 L0,300 Z"
            fill="currentColor"
            fillOpacity="0.08"
          />
          <path
            d="M0,240 C200,200 350,260 550,220 C700,190 770,240 800,220 L800,300 L0,300 Z"
            fill="currentColor"
            fillOpacity="0.1"
          />
          <path
            d="M0,270 C100,250 250,280 400,260 C550,240 700,270 800,250 L800,300 L0,300 Z"
            fill="currentColor"
            fillOpacity="0.12"
          />
        </svg>
      </div>
      <div className="px-4 sm:pl-10 pb-4 -mt-16 sm:-mt-18 flex flex-col items-center sm:items-start">
        <div className="relative group">
          <Avatar
            size={120}
            src={user?.image ? ViewImage(user.image) : undefined}
            className="border-3 border-white! bg-gray-100! text-primary! text-4xl! font-bold!"
          >
            {user?.name?.charAt(0)?.toUpperCase()}
          </Avatar>
          <div
            onClick={() => !uploading && fileRef.current?.click()}
            className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity"
          >
            <MdOutlineCameraAlt size={24} className="text-white" />
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
          {uploading && (
            <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        <div className="mt-6 text-center sm:text-left">
          <div className="text-xl sm:text-2xl font-semibold">
            {user?.name || "-"}
          </div>
        </div>
        <div className="text-sm text-gray-500"> @{user?.username || "-"}</div>

        <div className="w-full flex items-center justify-between gap-3 mt-6 sm:mt-2 text-[13px] text-gray-500">
          <span>
            Joined on{" "}
            {user?.createdAt
              ? dayjs(user.createdAt).format("DD MMM YYYY")
              : "-"}
          </span>
          <Tag
            variant="solid"
            color={user?.status ? "green" : "red"}
            className="flex! items-center! gap-2!"
          >
            <IoIosCheckmarkCircle />
            {user?.status ? "Active" : "Blocked"}
          </Tag>
        </div>
      </div>
    </div>
  );
}
