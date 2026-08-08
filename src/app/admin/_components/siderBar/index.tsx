"use client";
import Image from "next/image";
import { MdKeyboardArrowRight } from "react-icons/md";
import { Popover } from "antd";
import Link from "next/link";

import Menu from "./menu.json";

import Item from "./item";
import ProfilePopover from "./profilePopover";
import { UseAppSelector } from "@/redux/util/hooks";
import { ImageLoader } from "@/utils/common";
import { ViewImage } from "@/utils/viewImage";

export default function SiderBar() {
  const Auth = UseAppSelector((state: any) => state?.Auth);
  const Data = UseAppSelector((state: any) => state?.Data);

  const checkAccess = (item: any) => {
    if (Auth?.user?.access?.includes(item)) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-y-scroll overflow-x-hidden bg-white scrollbar-hide border-r border-primary/10">
      <Link href="/admin/overview">
        <div className="p-2.5 h-15 flex items-center gap-3">
          {Data?.settings?.settings?.app?.favicon ? (
            <Image
              alt="dashboard-logo"
              width={0}
              height={0}
              src={ViewImage(Data?.settings?.settings?.app?.favicon)}
              className="w-[5vh] h-[5vh] object-contain rounded-[10px]"
              loader={ImageLoader}
            />
          ) : null}
          <div>
            <div className="text-lg font-bold bg-linear-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              {Data?.settings?.settings?.app?.name || "Dashboard"}
            </div>
          </div>
        </div>
      </Link>
      <div className="p-2.5">
        {Menu[0]?.items?.map((item: any, index: any) =>
          checkAccess(item?.id) ? <Item item={item} key={index} /> : null,
        )}
      </div>
      <div className="p-2.5 border-t border-primary/10  flex-1">
        {Menu[1]?.items?.map((item: any, index: any) =>
          checkAccess(item?.id) ? <Item item={item} key={index} /> : null,
        )}
      </div>
      <Popover
        content={<ProfilePopover item={Auth} />}
        placement="top"
        arrow={false}
      >
        <div className="flex gap-2.5 bg-linear-to-r from-primary/10 to-sky-200/20 border border-primary/10 px-2 py-2.5 rounded-md mx-2.5 mb-3">
          <div>
            <Image
              alt="profile"
              width={0}
              height={0}
              src={ViewImage(Auth?.user?.image)}
              loader={ImageLoader}
              className="w-9 h-9 object-cover rounded-4xl!"
            />
          </div>
          <div className="flex-1">
            <div className="text-[14px] font-semibold text-gray-900">
              {Auth?.user?.name || "Admin User"}
            </div>
            <div className="text-[12px] text-gray-500">
              {Auth?.user?.email || "admin@gmail.com"}
            </div>
          </div>
          <div>
            <MdKeyboardArrowRight />
          </div>
        </div>
      </Popover>
      <div className="flex items-center justify-between p-2 px-4 text-[12px] text-gray-400 border-t border-primary/10">
        <div>Aqua</div>
        <div className="text-gray-900 font-bold"> 1.0.1</div>
      </div>
    </div>
  );
}
