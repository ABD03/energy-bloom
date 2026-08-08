"use client";

import Link from "next/link";
import Image from "next/image";
import { dayjs, ImageLoader } from "@/utils/common";
import { ViewImage } from "@/utils/viewImage";

export default function Primary(props: any) {
  const item = props?.item;
  if (!item?._id) return null;

  return (
    <Link
      href={item?.permalink ? `/${encodeURIComponent(item.permalink)}` : "/"}
      prefetch={false}
    >
      <h1 className="text-2xl sm:text-3xl font-bold leading-snug hover:text-primary">
        {item?.title}
      </h1>
      <div className="flex items-center gap-3 text-[12px] mb-2 text-gray-500 font-medium">
        <span className="text-primary">{item?.category[0]?.label}</span>
        <span>•</span>
        <span>
          {dayjs(item?.publishedAt || item?.createdAt).format("DD MMM YYYY")}
        </span>
      </div>
      <Image
        src={ViewImage(item?.image)}
        alt=""
        width={1200}
        height={630}
        sizes="(max-width: 640px) 100vw, 1280px"
        loader={ImageLoader}
        priority={true}
        fetchPriority="high"
        className="w-full h-60 sm:h-80 overflow-hidden object-cover"
      />
      {item?.description ? (
        <p className="hidden sm:block text-[14px] line-clamp-2 text-gray-600">
          {item.description}
        </p>
      ) : null}
    </Link>
  );
}
