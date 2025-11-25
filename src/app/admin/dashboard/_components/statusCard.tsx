import React from "react";
import { Card, Statistic } from "antd";
import DynamicIcon from "@/util/dynamicIcons";

const StatusCard = (props: any) => {
  return (
    <Card size="small">
      <Statistic
        title={
          <div className="flex gap-2 align-center">
            <div className="text-(--primary) bg-gray-200 p-1 rounded">
              <DynamicIcon size={20} name={props?.icon} />
            </div>
            {props?.title}
          </div>
        }
        value={props?.total}
        style={{ fontWeight: "semibold" }}
      />
    </Card>
  );
};

export default StatusCard;
