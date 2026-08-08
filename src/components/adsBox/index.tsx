"use client";
import { findAdds } from "@/utils/common";
import ImageAd from "./imageAd";

type AdsBoxProps = {
  data?: any;
  id?: any;
  screen?: any;
  className?: string;
};

export default function AdsBox({ data,id,screen, className = "" }: AdsBoxProps) {
  const adData = findAdds(data, id, screen);
  if (!adData || !adData?.status) return null;
  const type = adData?.type;
  if (type === "banner") {
    return <ImageAd data={adData} className={className} />;
  }
  return null;
}
