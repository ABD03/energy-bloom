"use client";
import { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { findAdds } from "@/utils/common";
import ImageAd from "./imageAd";

type StickyAdProps = {
  data?: any;
  id?: any;
  screen?: any;
};

export default function StickyAd({ data, id, screen }: StickyAdProps) {
  const [visible, setVisible] = useState(true);
  const adData = findAdds(data, id, screen);

  if (!visible || !adData || !adData?.status) return null;

  const type = adData?.type;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.08)] h-[110px]">
      <div className="max-w-7xl mx-auto relative">
        <button
          onClick={() => setVisible(false)}
          className="absolute -top-8 right-2 w-7 h-7 flex items-center justify-center rounded-t-lg bg-white border border-b-0 border-gray-200 text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
          aria-label="Close ad"
        >
          <IoCloseOutline size={18} />
        </button>
        <div className="flex items-center justify-center py-1.5 px-3">
          {type === "banner" && <ImageAd data={adData} className="w-full" />}
        </div>
      </div>
    </div>
  );
}
