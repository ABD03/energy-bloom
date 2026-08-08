import { useState } from "react";
import { Button, Drawer } from "antd";
import { useRouter } from "next/navigation";
import DynamicIcon from "@/utils/dynamicIcons";
import { IoIosArrowBack } from "react-icons/io";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import SiderBar from "../siderBar";

export default function PageHeader(props: any) {
  const navigation = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex items-center gap-2 sm:gap-6 px-3 sm:px-3 py-2 h-14 sm:h-15 text-[14px]">
      {(props?.showMobileMenu !== false || props?.showMenu) && (
        <Button
          onClick={() => setDrawerOpen(true)}
          className={`p-2! ${props?.showMenu && props?.showMobileMenu !== false ? "" : props?.showMenu ? "hidden! lg:flex!" : "lg:hidden!"}`}
        >
          <HiOutlineMenuAlt2 size={20} />
        </Button>
      )}

      {(props?.showMobileBack || props?.showBack) && (
        <Button
          type="default"
          onClick={() => navigation.back()}
          className={`p-2! ${props?.showBack && props?.showMobileBack ? "" : props?.showBack ? "hidden! lg:flex!" : "lg:hidden!"}`}
        >
          <IoIosArrowBack size={18} />
        </Button>
      )}

      <div className="flex items-center gap-2">
        <span className="text-primary ml-1">
          <DynamicIcon size={20} name={props?.icon} />
        </span>
        <div className="flex-1 text-base sm:text-lg font-semibold line-clamp-1">
          {props?.title}{" "}
          {props?.total ? (
            <span className="text-[12px] text-gray-500">
              - [ {props?.total} ]
            </span>
          ) : null}
        </div>
      </div>
      <div className="flex-1" />
      {props?.children ? (
        <div className="flex items-center gap-2">{props?.children}</div>
      ) : null}

      <Drawer
        placement="left"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        size="default"
        styles={{ body: { padding: 0 }, wrapper: { width: 280 } }}
        closable={false}
      >
        <SiderBar />
      </Drawer>
    </div>
  );
}
