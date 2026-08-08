"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Breadcrumb } from "antd";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  customLabels?: Record<string, string>;
  autoHideOnHome?: boolean;
  nonClickableSegments?: string[];
  hiddenSegments?: string[];
  className?: string;
}

const Breadcrumbs: React.FC<BreadcrumbProps> = ({
  items: extraItems = [],
  customLabels = {},
  autoHideOnHome = true,
  nonClickableSegments = [],
  hiddenSegments = [],
}) => {
  const pathname = usePathname();

  if (!pathname || (pathname === "/" && autoHideOnHome)) {
    return null;
  }

  const pathSegments = pathname.split("/").filter(Boolean);
  const filteredSegments = pathSegments.filter(
    (segment) => !hiddenSegments.includes(segment),
  );

  const formatText = (text: string) => {
    if (customLabels[text]) return customLabels[text];
    try {
      text = decodeURIComponent(text);
    } catch (e) {}
    return text
      .split("-")
      .map((word) => {
        if (word.toLowerCase() === "biz") return "Business Type";
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(" ");
  };

  const hasExtra = extraItems.length > 0;

  const items = [
    {
      title: (
        <Link href="/">
          <div className="flex items-center">
            <span className="text-[12px] px-1 text-gray-600">Home</span>
          </div>
        </Link>
      ),
    },
    ...filteredSegments.map((segment, index) => {
      const originalIndex = pathSegments.indexOf(segment);
      const isLast = !hasExtra && index === filteredSegments.length - 1;
      const href = `/${pathSegments.slice(0, originalIndex + 1).join("/")}`;
      const isNonClickable = nonClickableSegments.includes(segment);

      return {
        title:
          isLast || isNonClickable ? (
            <span className="font-normal text-[12px] px-1 text-gray-600">
              {formatText(segment)}
            </span>
          ) : (
            <Link href={href}>
              <span className="font-normal text-[12px] px-1 text-gray-600">
                {formatText(segment)}
              </span>
            </Link>
          ),
      };
    }),
    ...extraItems.map((item, index) => {
      const isLast = index === extraItems.length - 1;
      return {
        title:
          isLast || !item.href ? (
            <span className="font-normal text-[12px] px-1 text-gray-600">{item.label}</span>
          ) : (
            <Link href={item.href}>
              <span className="font-normal text-[12px] px-1 text-gray-600">{item.label}</span>
            </Link>
          ),
      };
    }),
  ];

  return (
    <Breadcrumb
      items={items}
      separator={<span className="text-[10px] text-gray-500">{"/"}</span>}
    />
  );
};

export default Breadcrumbs;
