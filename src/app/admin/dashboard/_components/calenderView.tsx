import React from "react";
import type {CalendarProps } from "antd";
import { Calendar, Card, Tag } from "antd";
import type { Dayjs } from "dayjs";

const getListData = (value: Dayjs) => {
  let listData: { type: string; content: string }[] = [];
  switch (value.date()) {
    case 8:
      listData = [{ type: "success", content: "10 Patients" }];
      break;
    case 10:
      listData = [{ type: "success", content: "25 Patients" }];
      break;
    case 15:
      listData = [{ type: "success", content: "15 Patients" }];
      break;
    default:
  }
  return listData || [];
};

const getMonthData = (value: Dayjs) => {
  if (value.month() === 8) {
    return 1394;
  }
};

const App: React.FC = () => {
  const monthCellRender = (value: Dayjs) => {
    const num = getMonthData(value);
    return num ? (
      <div style={{
          width: "100%",
          height: "90%",
          textAlign: "center",
          fontSize: 13,
          display:"flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
        <span>100 Patients</span>
      </div>
    ) : null;
  };

  const dateCellRender = (value: Dayjs) => {
    const listData = getListData(value);
    return listData.map((item) => (
      <Tag
        key={item.content}
        variant={"outlined"}
        color={"green-inverse"}
        style={{
          width: "100%",
          height: "90%",
          textAlign: "center",
          fontSize: 13,
          display:"flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {item.content}
      </Tag>
    ));
  };

  const cellRender: CalendarProps<Dayjs>["cellRender"] = (current, info) => {
    if (info.type === "date") {
      return dateCellRender(current);
    }
    if (info.type === "month") {
      return monthCellRender(current);
    }
    return info.originNode;
  };

  return (
    <Card
      title="New Appointments"
      size="small"
      extra={<a>Refresh</a>}
    >
      <Calendar cellRender={cellRender} />
    </Card>
  );
};

export default App;
