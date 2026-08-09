import { dayjs } from "@/utils/common";
import { useRouter } from "next/navigation";
import { Button, Pagination, Popconfirm, Table, Tag, Image } from "antd";
import { IoTrashOutline } from "react-icons/io5";
import { MdOutlineEditNote } from "react-icons/md";

import Empty from "../../_components/empty";
import { ViewImage } from "@/utils/viewImage";

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
      title: "",
      dataIndex: "image",
      key: "image",
      width: 20,
      render: (item: any) => (
        <Image
          src={ViewImage(item)}
          preview={ViewImage(item)}
          width={30}
          height={30}
          className="rounded-full!"
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 220,
      render: (item: any) => (
        <div className="font-semibold text-[14px]">{item}</div>
      ),
    },
    {
      title: "Specialization",
      dataIndex: "specialization",
      key: "specialization",
      render: (item: any) => <div>{item || "-"}</div>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (item: any) => <div>{item || "-"}</div>,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (item: any) => <div>{item || "-"}</div>,
    },
    {
      title: "Experience",
      dataIndex: "experienceYears",
      key: "experienceYears",
      width: 110,
      render: (item: any) => <div>{item ? `${item} yrs` : "-"}</div>,
    },
    {
      title: "Fee",
      dataIndex: "consultationFee",
      key: "consultationFee",
      width: 90,
      render: (item: any) => <div>{item ?? "-"}</div>,
    },
    {
      title: "Slots",
      dataIndex: "slots",
      key: "slots",
      width: 90,
      render: (item: any) => <Tag>{Array.isArray(item) ? item.length : 0}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (item: any) => (
        <Tag color={item ? "green" : "red"}>{item ? "active" : "Blocked"}</Tag>
      ),
    },
    {
      title: "Created At",
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
            onClick={() => props?.onEdit(record)}
            className="p-1!"
          >
            <MdOutlineEditNote size={20} />
          </Button>
          <Popconfirm
            title="Delete the doctor"
            description="Are you sure to delete this doctor?"
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
