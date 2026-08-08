"use client";

import Link from "next/link";
import Image from "next/image";
import { dayjs, ImageLoader } from "@/utils/common";
import { ViewImage } from "@/utils/viewImage";

export default function Secondary(props: any) {
  const item = props?.item;
  if (!item?._id) return null;

  return (
    <Link
      href={item?.permalink ? `/${encodeURIComponent(item.permalink)}` : "/"}
      prefetch={false}
      className="hover:text-primary"
    >
      <Image
        src={ViewImage(item?.image)}
        alt=""
        width={0}
        height={0}
        loader={ImageLoader}
        className="w-full h-43.5 rounded-t-lg! object-cover"
      />
      <div className="flex items-center justify-between gap-3 text-[12px] my-2 text-gray-500 hover:text-primary font-medium">
        {item?.category?.length ? (
          <span>{item?.category[0]?.label}</span>
        ) : null}
        <span>
          {dayjs(item?.publishedAt || item?.createdAt).format("DD MMM YYYY")}
        </span>
      </div>
      <h2 className="text-base font-bold leading-snug line-clamp-3">
        {item?.title}
      </h2>
    </Link>
  );
}
