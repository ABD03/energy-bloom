"use client";

import { Button } from "antd";
import Link from "next/link";
import Image from "next/image";

import { ImageLoader } from "@/util/imageLoader";

export default function Header() {
  return (
    <>
      <div className="fixed top-0 left-0 w-full  bg-white shadow z-50 font-sans">
        <div className="max-w-screen-xl mx-auto px-6 h-[8vh] flex items-center gap-10">
          <div className="flex-1 flex items-center">
            <Link href={"/"} className="Header-logoBox" prefetch={false}>
              <Image
                alt="logo"
                width={60}
                height={60}
                src={"/logo.png"}
                loader={ImageLoader}
                priority={true}
              />
            </Link>
            <div className="font-bold text-2xl text-(--primary)">
              Energy <span className="text-(--scondary) font-medium">Bloom</span>
            </div>
          </div>
          <div>
            <Button type="primary">Book Now</Button>
          </div>
          <div>Contact Us</div>
        </div>
      </div>
      <div className="pt-[8vh]"></div>
    </>
  );
}
