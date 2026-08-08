import React from "react";
import { useTheme } from "next-themes";
import moment from "moment";
import { Avatar, Button, Drawer } from "antd";
import { IoHelpCircleOutline, IoMoon, IoSunny } from "react-icons/io5";
import { MdKeyboardArrowRight } from "react-icons/md";
import { HiOutlineUser } from "react-icons/hi";
import { LuLayoutDashboard } from "react-icons/lu";
import {
  FaFacebookF,
  FaXTwitter,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
  FaWhatsapp,
  FaThreads,
  FaPinterestP,
} from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { PiTelegramLogo } from "react-icons/pi";
import { RiArrowRightCircleLine } from "react-icons/ri";
import Link from "next/link";

import { ViewImage } from "@/utils/viewImage";

type PageItem = {
  _id?: string;
  name: string;
  permalink: string;
};

const SOCIAL_CONFIG = [
  { key: "facebook", Icon: FaFacebookF, label: "Facebook" },
  { key: "twitter", Icon: FaXTwitter, label: "X" },
  { key: "instagram", Icon: FaInstagram, label: "Instagram" },
  { key: "youtube", Icon: FaYoutube, label: "YouTube" },
  { key: "linkedin", Icon: FaLinkedinIn, label: "LinkedIn" },
  { key: "whatsapp", Icon: FaWhatsapp, label: "WhatsApp" },
  { key: "telegram", Icon: PiTelegramLogo, label: "Telegram" },
  { key: "threads", Icon: FaThreads, label: "Threads" },
  { key: "pinterest", Icon: FaPinterestP, label: "Pinterest" },
];
type CategoryItem = {
  _id?: string;
  value: string;
};

const MobileDrawer = (props: any) => {
  const { theme, setTheme } = useTheme();
  const categories: CategoryItem[] = props?.categories || [];
  const pages: PageItem[] = props?.pages || [];
  const user = props?.Auth?.user || {};
  const settings = props?.settings?.app || {};
  const social = props?.settings?.contact || {};
  const socials = SOCIAL_CONFIG.filter((s) => social[s.key]);

  return (
    <Drawer
      open={props?.open}
      closeIcon={null}
      onClose={() => props?.close()}
      placement="right"
      size={"350"}
      styles={{
        body: { padding: 0 },
      }}
    >
      <div className="min-h-screen p-4">
        <div className="flex justify-between pb-4">
          <div className="flex gap-4">
            <Button
              shape="circle"
              size="large"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <IoSunny size={20} /> : <IoMoon size={20} />}
            </Button>
            <Link href={`/contact-us`} prefetch={false}>
              <Button shape="circle" size="large">
                <IoHelpCircleOutline size={25} />
              </Button>
            </Link>
          </div>

          <Button shape="circle" size="large" onClick={() => props?.close()}>
            <IoMdClose size={20} />
          </Button>
        </div>

        <Link
          href={props?.Auth?.auth ? "/profile" : "/login"}
          prefetch={false}
          onClick={() => props?.close()}
          className="flex gap-3 rounded-2xl mb-6 mt-2"
        >
          <Avatar
            size={50}
            src={user?.image ? ViewImage(user.image) : undefined}
            icon={<HiOutlineUser size={20} />}
            className="bg-linear-to-r! from-primary/60! to-primary/10! text-white!"
          >
            {user?.name?.charAt(0)?.toUpperCase()}
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="text-[18px] font-semibold text-(--foreground) truncate">
              {user?.name || "Login now"}
            </div>
            <div className="text-[12px] text-gray-500 truncate">
              {user?.email || "to access your account"}
            </div>
          </div>
          {props?.Auth?.auth ? <div className="pr-2">Account</div> : null}
        </Link>

        {props?.Auth?.user?.type === "editor" ? (
          <Link
            href={"/admin/overview"}
            className="w-full flex items-center p-1 rounded-full mb-4 gap-2 bg-linear-to-r from-primary/90 to-primary/60 text-white!"
          >
            <div className="p-2 bg-white rounded-full">
              <LuLayoutDashboard size={20} className="text-primary" />
            </div>
            <div className="flex-1 text-[15px] font-medium">Dashboard</div>

            <div>
              <RiArrowRightCircleLine size={35} className="text-white/50" />
            </div>
          </Link>
        ) : null}

        <div className="mt-1 pt-6 border-t border-slate-500/20">
          <div className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-1">
            Explore
          </div>
          {categories.length > 0 && (
            <ul className="">
              {categories.map((cat) => {
                return (
                  <li key={cat._id} className="py-3">
                    <Link
                      href={`/more?category=${encodeURIComponent(cat.value)}`}
                      className="w-full flex items-center justify-between text-left text-(--foreground)!"
                      style={{
                        textDecoration: "none",
                      }}
                    >
                      <span className="text-[15px] font-semibold">
                        {cat.value}
                      </span>
                      <MdKeyboardArrowRight size={20} />
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        {pages.length > 0 && (
          <div className="mt-1 pt-6 border-t border-slate-500/20">
            <div className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-3">
              Learn More
            </div>
            <ul className="grid grid-cols-2 gap-y-2">
              {pages.map((page) => (
                <li key={page._id}>
                  <Link
                    href={`/page/${page.permalink}`}
                    prefetch={false}
                    onClick={() => props?.close()}
                    className="text-[13px] text-(--foreground)! hover:text-primary! hover:underline!"
                  >
                    {page.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        {socials.length > 0 && (
          <div className="mt-6 pt-6 border-t border-slate-500/20">
            <div className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-3">
              Follow us
            </div>
            <div className="flex flex-wrap gap-2">
              {socials.map(({ key, Icon, label }) => (
                <Link
                  key={key}
                  href={social[key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  prefetch={false}
                  className="w-9 h-9 inline-flex items-center justify-center rounded-full border border-slate-500/20 text-(--foreground)!"
                >
                  <Icon size={15} />
                </Link>
              ))}
            </div>
          </div>
        )}
        <div className="mt-6 pt-4 border-t border-slate-500/20 text-[11px] text-gray-500">
          <p className="text-xs">
            &copy; {moment().year()} {settings?.name || "Website"}. All rights
            reserved.
          </p>
        </div>
      </div>
    </Drawer>
  );
};

export default MobileDrawer;
