import React from "react";
import { Card, Statistic } from "antd";
import DynamicIcon from "@/util/dynamicIcons";

const StatusCard = (props: any) => {
  return (
    <Card size="small" style={{ margin: 10 }}>
      <Statistic
        title={props?.title}
        value={props?.total}
        style={{ fontWeight: "semibold" }}
        prefix={
          <div style={{ width: "100%", marginRight:20,}}>
            <DynamicIcon size={20} name={props?.icon} />
          </div>
        }
      />
    </Card>
  );
};

export default StatusCard;
