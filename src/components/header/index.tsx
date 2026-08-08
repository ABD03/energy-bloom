"use client";
import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { Avatar, Button } from "antd";
import Link from "next/link";

import { useRouter } from "next/navigation";
import { RiMenu4Line } from "react-icons/ri";
import { IoSearch } from "react-icons/io5";
import { IoSunny } from "react-icons/io5";
import { BsMoon } from "react-icons/bs";
import { HiUser } from "react-icons/hi";

import { useAppDispatch, UseAppSelector } from "@/redux/util/hooks";
import { setDate } from "@/redux/slice/visitSlice";
import { setSettings } from "@/redux/slice/dataSlice";
import { API } from "@/config/apis";
import { POST } from "@/utils/apiCalls";

import MobileDrawer from "./drawer";
import Category from "./category";
import Logo from "@/components/logo";
import LoginModal from "@/app/(website)/login/loginModal";
import { ViewImage } from "@/utils/viewImage";

const Header = (props: any) => {
  const dispatch = useAppDispatch();
  const navigation = useRouter();
  const { theme, setTheme } = useTheme();
  const Auth = UseAppSelector((state: any) => state?.Auth);
  const Visits = UseAppSelector((state: any) => state.Visits);
  const settings = props?.settings?.app || {};
  const initialized = useRef(0);

  const [open, setOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      let obj = {
        categories: props?.data?.data?.categories || [],
        tags: props?.data?.data?.tags || [],
        settings: props?.settings || {},
      };
      dispatch(setSettings(obj));
    }
  }, []);

  const openProfile = () => {
    if (Auth?.auth) {
      navigation.push("/profile");
    } else {
      setLoginOpen(true);
    }
  };

  const visitor = async () => {
    try {
      let date = new Date();
      let date1 = new Date().toLocaleDateString();
      let date2 = new Date(Visits?.current).toLocaleDateString();
      let isMobile = window.matchMedia("(max-width: 600px)").matches;
      if (date1 !== date2) {
        let response: any = await POST(API.STATICS, {
          date: date,
          device: isMobile ? "mobile" : "desktop",
        });
        if (response.status) {
          dispatch(setDate(date.toISOString()));
        }
      } else {
        console.log("already counted");
      }
    } catch (err) {
      console.log("error", err);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (initialized.current === 0) {
        visitor();
      }
    }
    return () => {
      initialized.current = 1;
    };
  }, []);

  return (
    <div>
      <div className="fixed top-0 left-0 w-full z-999 border-b border-gray-500/20 bg-linear-to-r from-(--background)/95 via-(--background)/95 to-(--background)/95">
        <div className="h-[8vh] sm:h-[11vh] px-4 sm:px-0 flex gap-10 max-w-7xl mx-auto">
          <Link
            href={"/"}
            prefetch={true}
            className="flex items-center h-full gap-2"
          >
            <Logo
              priority={true}
              lightSrc={settings?.logo_light}
              darkSrc={settings?.logo_dark}
              className="w-40 h-10 sm:w-50 sm:h-14"
            />
          </Link>
          <div className="flex-1 flex items-center justify-end gap-4 sm:gap-6">
            <div className="hidden sm:block">
              <Button
                size="large"
                type="text"
                onClick={() => openProfile()}
                className="px-0!"
              >
                {Auth?.auth ? (
                  <Avatar
                    size={38}
                    src={
                      Auth?.user?.image
                        ? ViewImage(Auth?.user.image)
                        : undefined
                    }
                    className="bg-linear-to-r! from-primary/60! to-primary/10! text-white!"
                  >
                    {Auth?.user?.name?.charAt(0)?.toUpperCase()}
                  </Avatar>
                ) : (
                  <HiUser size={20} />
                )}
                <div className="font-medium max-w-12! overflow-hidden pr-2">
                  {Auth?.auth ? Auth?.user?.name : "Sign In"}
                </div>
              </Button>
            </div>
            <div className="hidden sm:block">
              <Button
                shape="circle"
                size="large"
                aria-label="Toggle theme"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? (
                  <IoSunny size={18} />
                ) : (
                  <BsMoon size={18} />
                )}
              </Button>
            </div>
            <div className="sm:hidden">
              <Button
                shape="circle"
                size="large"
                aria-label="Search"
                onClick={() => setSearchOpen(true)}
              >
                <IoSearch size={20} />
              </Button>
            </div>
            <Button
              shape="circle"
              size="large"
              aria-label="Menu"
              onClick={() => setOpen(true)}
            >
              <RiMenu4Line size={20} />
            </Button>
          </div>
        </div>
      </div>

      {open ? (
        <MobileDrawer
          open={open}
          close={() => setOpen(false)}
          Auth={Auth}
          categories={props?.data?.data?.categories || []}
          pages={props?.data?.data?.pages || []}
          settings={props?.settings}
        />
      ) : null}

      {loginOpen ? (
        <LoginModal open={loginOpen} close={() => setLoginOpen(false)} />
      ) : null}

      <div className="h-[8vh] sm:h-[11vh]"></div>
      <Category categories={props?.data?.data?.categories || []} />
    </div>
  );
};

export default Header;
