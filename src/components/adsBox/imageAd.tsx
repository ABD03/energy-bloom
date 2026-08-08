"use client";
import Image from "next/image";
import { ImageLoader } from "@/utils/common";
import { ViewImage } from "@/utils/viewImage";

type ImageAdProps = {
  data: any;
  className?: string;
};

export default function ImageAd({ data, className = "" }: ImageAdProps) {
  const height = data?.height ? `${data.height}px` : "auto";
  const hasLink = !!data?.link;

  const Wrapper = hasLink ? "a" : "div";
  const wrapperProps = hasLink
    ? {
        href: data.link,
        target: "_blank" as const,
        rel: "noopener noreferrer sponsored",
      }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      className={`block overflow-hidden bg-primary/5 ${className} my-2!`}
      style={{ minHeight: height }}
    >
      {/* Desktop image */}
      {data?.desk_image && (
        <div
          className="hidden sm:block relative w-full"
          style={{ minHeight: height }}
        >
          <Image
            src={ViewImage(data.desk_image)}
            alt="ad"
            width={0}
            height={0}
            loader={ImageLoader}
            className="w-full h-auto object-contain"
            style={{ height }}
          />
        </div>
      )}

      {/* Mobile image */}
      {data?.mobile_image ? (
        <div
          className="block sm:hidden relative w-full"
          style={{ minHeight: height }}
        >
          <Image
            src={ViewImage(data.mobile_image)}
            alt="ad"
            width={0}
            height={0}
            loader={ImageLoader}
            className="w-full h-auto object-contain"
            style={{ height }}
          />
        </div>
      ) : data?.desk_image ? (
        <div
          className="block sm:hidden relative w-full"
          style={{ minHeight: height }}
        >
          <Image
            src={ViewImage(data.desk_image)}
            alt="ad"
            width={0}
            height={0}
            loader={ImageLoader}
            className="w-full h-auto object-contain"
            style={{ height }}
          />
        </div>
      ) : null}
    </Wrapper>
  );
}
