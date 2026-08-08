"use client";

import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { IoHome } from "react-icons/io5";
import {
  MdOutlineArrowForwardIos,
  MdOutlineArrowBackIosNew,
} from "react-icons/md";

type CategoryItem = {
  _id?: string;
  value: string;
  image?: string;
  position?: number;
};

export default function Category({
  categories = [],
}: {
  categories?: CategoryItem[];
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const rafId = useRef(0);

  const checkScroll = () => {
    cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      const el = scrollRef.current;
      if (!el) return;
      const left = el.scrollLeft > 0;
      const right = el.scrollLeft + el.clientWidth < el.scrollWidth - 1;
      setShowLeft(left);
      setShowRight(right);
    });
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);

    return () => {
      cancelAnimationFrame(rafId.current);
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [categories]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;

    el.scrollBy({
      left: direction === "left" ? -200 : 200,
      behavior: "smooth",
    });
  };

  if (!categories?.length) return null;

  return (
    <div className="border-b border-gray-500/20">
      <div className="max-w-7xl mx-auto relative">
        {showLeft && (
          <button
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-transparent  px-1 py-4 text-sm hidden sm:block"
          >
            <MdOutlineArrowBackIosNew size={20} />
          </button>
        )}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto whitespace-nowrap scrollbar-hide"
        >
          <Link
            href={`/`}
            prefetch={false}
            aria-label="Home"
            className="relative group shrink-0 text-[13px] font-medium"
          >
            <div className="border-l border-gray-500/20  px-4! py-2! flex hover:text-primary">
              <IoHome size={20} className="text-primary" />
            </div>
          </Link>
          {categories.map((item) => {
            return (
              <Link
                href={`/more?category=${encodeURIComponent(item.value)}`}
                prefetch={false}
                key={item._id ?? item.value}
                className="relative group shrink-0 text-[13px] font-medium"
              >
                <div className="border-l border-gray-500/20  px-4! py-2! flex hover:text-primary">
                  {item.value}
                </div>
              </Link>
            );
          })}
        </div>
        {showRight && (
          <button
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-transparent px-1 py-4 text-sm hidden sm:block"
          >
            <MdOutlineArrowForwardIos size={20} />
          </button>
        )}
      </div>
    </div>
  );
}
