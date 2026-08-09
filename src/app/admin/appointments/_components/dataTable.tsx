import { dayjs } from "@/utils/common";
import { useRouter } from "next/navigation";
import { Button, Pagination, Popconfirm, Table, Tag } from "antd";
import { IoTrashOutline } from "react-icons/io5";
import { MdOutlineEditNote } from "react-icons/md";
import Link from "next/link";

import Empty from "../../_components/empty";

const STATUS_COLORS: Record<string, string> = {
  upcoming: "blue",
  attended: "green",
  expired: "gold",
  cancelled: "red",
};

function DataTable(props: any) {
  const navigation = useRouter();

  const pageChange = (page: number, take: number) => {
    const params = new URLSearchParams(location.search);
    params.set("page", page.toString());
    params.set("limit", take.toString());
    navigation.push(`?${params.toString()}`);
  };

  const columns = [
    {
      title: "Token",
      dataIndex: "token",
      key: "token",
      width: 70,
      render: (item: any) => (
        <div className="font-mono text-[12px]">
          {item ? `T${String(item).padStart(2, "0")}` : "-"}
        </div>
      ),
    },
    {
      title: "Patient",
      dataIndex: "patient",
      key: "patient",
      width: 200,
      render: (item: any) => (
        <Link href={`/admin/patients/details?id=${item?._id}`}>
          <div className="font-semibold text-[14px]">{item?.name || "-"}</div>
          <div className="text-[11px] text-gray-500">{item?.phone}</div>
        </Link>
      ),
    },
    {
      title: "Doctor",
      dataIndex: "doctor",
      key: "doctor",
      width: 200,
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
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 110,
      render: (item: any) => (
        <div className="text-[12px]">{dayjs(item).format("ll")}</div>
      ),
    },
    {
      title: "Action",
      width: 100,
      render: (_: any, record: any) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            size="small"
            className="p-2! bg-green-500!"
            type="primary"
            href={`/admin/patients/details?id=${record?.patient?._id}`}
          >
            Attend
          </Button>
          <Button
            size="small"
            onClick={() => props?.onEdit(record)}
            className="p-1!"
          >
            <MdOutlineEditNote size={20} />
          </Button>
          <Popconfirm
            title="Delete the appointment"
            description="Are you sure to delete this appointment?"
            onConfirm={() => props?.onDelete(record)}
            okText="Yes"
            cancelText="No"
            placement="left"
          >
            <Button size="small" danger className="p-1!">
              <IoTrashOutline size={15} color="red" />
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <>
      <Table
        size="small"
        rowKey="_id"
        dataSource={props?.data}
        columns={columns}
        pagination={false}
        loading={props?.loading}
        locale={{ emptyText: <Empty /> }}
        scroll={{ x: "max-content" }}
      />
      <div className="flex justify-end p-2">
        <Pagination
          size="small"
          defaultCurrent={props?.meta?.page}
          current={props?.meta?.page}
          defaultPageSize={props?.meta?.limit}
          total={props?.meta?.total}
          showSizeChanger
          onChange={(page, pageSize) => pageChange(page, pageSize)}
        />
      </div>
    </>
  );
}

export default DataTable;
