"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Popover } from "antd";
import { CircleUserRound,ChevronDown } from "lucide-react";
import Menu from "./menu.json";

import Item from "./item";
import ProfilePopover from "./profilePopover";
import { UseAppSelector } from "@/redux/util/hooks";
import { ImageLoader } from "@/util/imageLoader";

export default function SiderBar() {
  const navigation = useRouter();
  const Auth = UseAppSelector((state: any) => state?.Auth);

  const checkAccess = (item: any) => {
    if (Auth?.user?.access?.includes(item)) {
      return true;
    } else {
      return true;
    }
  };

  return (
    <div className="dashboard-siderbar">
      <div className="dashboard-siderbar-LogoBox">
        <Image
          alt="dashboard-logo"
          width={0}
          height={0}
          src={"/logo1.png"}
          className="dashboard-siderbar-Logo"
          loader={ImageLoader}
        />
      </div>
      <div className="dashboard-siderbar-Box1">
        {Menu[0]?.items?.map((item: any, index: any) =>
          checkAccess(item?.id) ? <Item item={item} key={index} /> : null
        )}
      </div>
      <div className="dashboard-siderbar-Box2">
        {Menu[1]?.items?.map((item: any, index: any) =>
          checkAccess(item?.id) ? <Item item={item} key={index} /> : null
        )}
        <Popover
              content={<ProfilePopover item={Auth} />}
              placement="bottomLeft"
            >
        <div className="dashboard-siderbar-Box3">
          <div className="avatar">
            <CircleUserRound/>
          </div>
          <div style={{flex:1}}>
            <div className="text1">{Auth?.user?.name || "Admin User"}</div>
            <div className="text2">{Auth?.user?.email || "szjK8@example.com"}</div>
          </div>
          <div>
            <ChevronDown size={20} color="grey"/>
          </div>
        </div>
        </Popover>
      </div>
    </div>
  );
}
