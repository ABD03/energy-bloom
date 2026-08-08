"use client";
import { useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { ImageLoader } from "@/utils/common";
import { ViewImage } from "@/utils/viewImage";

interface LogoProps {
  lightSrc?: string;
  darkSrc?: string;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  priority?: boolean;
  alt?: string;
}

export default function Logo({
  lightSrc,
  darkSrc,
  width = 160,
  height = 40,
  className = "",
  style,
  priority = false,
  alt = "logo",
}: LogoProps) {
  const { theme } = useTheme();
  const [error, setError] = useState(false);

  const src =
    theme === "dark"
      ? lightSrc
        ? ViewImage(lightSrc)
        : null
      : darkSrc
        ? ViewImage(darkSrc)
        : null;

  const hasSource = theme === "dark" ? !!lightSrc : !!darkSrc;

  if (!hasSource || error) {
    return (
      <div
        className={`flex items-center gap-2 rounded-lg font-bold text-primary/40 ${className}`}
        style={{ width, height, ...style }}
      >
        <div className={`bg-primary/30 rounded h-[90%] w-[25%]`}></div>
        Website Logo
      </div>
    );
  }

  return (
    <Image
      alt={alt}
      width={width}
      height={height}
      src={src!}
      loader={ImageLoader}
      priority={priority}
      onError={() => setError(true)}
      className={`object-contain ${className}`}
      style={style}
    />
  );
}
