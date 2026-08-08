"use client";

import DynamicIcon from "@/utils/dynamicIcons";
import { Card } from "antd";

export default function StaticCard(props: any) {
  return (
    <Card
      size="small"
      loading={props?.loading}
      className="flex-1 mb-2!"
      styles={{ body: { padding: "10px 12px", paddingBottom: 8 } }}
    >
      <div className="flex gap-2">
        <div className="flex flex-1 gap-4 justify-between">
          <div className="text-gray-500 text-[12px] font-medium">{props?.title || "Title"}</div>
          <div className="text-primary bg-primary/10 p-2 rounded-full">
            <DynamicIcon size={20} name={props?.icon} />
          </div>
        </div>
      </div>
      <div className="text-xl font-bold text-gray-700">
        {props?.value || 0}
      </div>
    </Card>
  );
}
