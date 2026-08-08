"use client";
import { dayjs } from "@/utils/common";
import Breadcrumbs from "@/components/breadcrumb";

export default function PageContainer(props: any) {
  const item = props?.data;
  if (!item?._id) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-0 py-3 sm:py-4">
      <Breadcrumbs
        hiddenSegments={["page"]}
        items={item?.name ? [{ label: item.name }] : []}
      />
      <h1 className="text-2xl sm:text-4xl font-bold leading-tight mb-3">
        {item?.name}
      </h1>
      <div className="flex items-center gap-2 text-[12px] text-gray-500 font-medium mb-8">
        {item?.author && <span>By {item.author}</span>}
        {item?.author && <span>•</span>}
        <span>
          {dayjs(item?.updatedAt || item?.createdAt).format("DD MMM YYYY")}
        </span>
      </div>
      <div
        className="article-content"
        dangerouslySetInnerHTML={{ __html: item?.sections || "" }}
      />
    </div>
  );
}
