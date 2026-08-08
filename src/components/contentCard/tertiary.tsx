"use client";

import Link from "next/link";
import Image from "next/image";
import { ImageLoader } from "@/utils/common";
import { ViewImage } from "@/utils/viewImage";

export default function Tertiary(props: any) {
  const item = props?.item;
  if (!item?._id) return null;

  return (
    <Link
      href={item?.permalink ? `/${encodeURIComponent(item.permalink)}` : "/"}
      prefetch={false}
      className="hover:text-primary flex gap-3"
    >
      <Image
        src={ViewImage(item?.image)}
        alt=""
        width={0}
        height={0}
        loader={ImageLoader}
        className="w-30 h-20 shrink-0 rounded object-cover"
      />
      <div className="flex-1 flex flex-col min-w-0">
        <h2 className="font-bold leading-snug mb-1 text-[14px]">
          {item?.title}
        </h2>
        <div className="mt-auto" />
        <div className="text-[12px] text-gray-500 hover:text-primary font-medium">
          {item?.category?.[0]?.label ? (
            <>
              <span className="text-primary">{item.category[0].label}</span>
            </>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
