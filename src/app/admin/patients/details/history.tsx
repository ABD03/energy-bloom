"use client";
import { Button, Table, Tag } from "antd";
import Empty from "../../_components/empty";
import { dayjs } from "@/utils/common";

const STATUS_COLORS: Record<string, string> = {
  upcoming: "blue",
  attended: "green",
  expired: "gold",
  cancelled: "red",
};

function HistoryTab({
  data = [] as any[],
  loading,
  onAttend,
}: {
  data?: any[];
  loading?: boolean;
  onAttend?: (appt: any) => void;
}) {
  const columns = [
    {
      title: "Token",
      dataIndex: "token",
      key: "token",
      width: 90,
      render: (item: any, record: any) => (
        <div className="font-mono text-[12px]">
          {item
            ? `${dayjs(record?.date).format("DDMM")}/${String(item).padStart(2, "0")}`
            : "-"}
        </div>
      ),
    },
    {
      title: "Doctor",
      dataIndex: "doctor",
      key: "doctor",
      render: (item: any) => (
        <div>
          <div className="font-semibold text-[13px]">{item?.name || "-"}</div>
          <div className="text-[11px] text-gray-500">
            {item?.specialization}
          </div>
        </div>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: 140,
      render: (item: any) => (
        <div className="text-[12px]">
          {item ? dayjs(item).format("ll") : "-"}
        </div>
      ),
    },
    {
      title: "Slot",
      dataIndex: "slot",
      key: "slot",
      width: 140,
      render: (item: any) =>
        item?.startTime ? (
          <div className="text-[12px]">
            {item?.day} {item.startTime}–{item.endTime}
          </div>
        ) : (
          <span className="text-gray-400">—</span>
        ),
    },
    {
      title: "Fee",
      dataIndex: "fee",
      key: "fee",
      width: 90,
      render: (item: any) => <div>{item ?? "-"}</div>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 110,
      render: (item: any) => (
        <Tag color={STATUS_COLORS[item] || "default"} className="capitalize">
          {item}
        </Tag>
      ),
    },
    {
      title: "",
      key: "action",
      width: 90,
      render: (_: any, record: any) =>
        record?.status === "upcoming" ? (
          <Button
            size="small"
            type="primary"
            className="bg-green-500!"
            onClick={() => onAttend?.(record)}
          >
            Attend
          </Button>
        ) : null,
    },
  ];

  return (
    <Table
      size="small"
      rowKey="_id"
      dataSource={data}
      columns={columns}
      pagination={false}
      loading={loading}
      locale={{ emptyText: <Empty /> }}
      scroll={{ x: "max-content" }}
    />
  );
}

export default HistoryTab;
