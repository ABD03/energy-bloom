"use client";

import { Button } from "antd";
import Link from "next/link";
import Image from "next/image";
import { CalendarPlus2, MessageCircleQuestionMark } from "lucide-react";

import { ImageLoader } from "@/util/imageLoader";

export default function Header() {
  return (
    <>
      <div className="fixed top-0 left-0 w-full  bg-transparent font-sans">
        <div className="h-[7vh] sm:h-[8vh] max-w-7xl mx-auto px-2 sm:px-3 flex items-center gap-10">
          <div className="flex-1 flex items-center">
            <Link href={"/"} className="Header-logoBox" prefetch={false}>
              <Image
                alt="logo"
                width={0}
                height={0}
                src={"/logo.png"}
                loader={ImageLoader}
                priority={true}
                className="w-10 h-10 sm:w-15 sm:h-15 object-cover"
              />
            </Link>
            <div className="text-lg sm:text-xl font-semibold">
              <span className="bg-linear-to-r from-(--primary) to-(--scondary) bg-clip-text text-transparent">
                Energy Bloom
              </span>
            </div>
          </div>
          <div>
            <Button type="primary">
              <span className="hidden sm:block">Request Appointment</span>
              <CalendarPlus2 size={20} />
            </Button>
          </div>
          <div className="hidden sm:block text-sm">
            <Button type="text">
              Contact Us <MessageCircleQuestionMark size={20} />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
