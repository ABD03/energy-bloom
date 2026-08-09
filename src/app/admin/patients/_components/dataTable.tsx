import { dayjs } from "@/utils/common";
import { useRouter } from "next/navigation";
import { Button, Pagination, Popconfirm, Table, Tag, Image } from "antd";
import { IoTrashOutline } from "react-icons/io5";
import { MdOutlineEditNote } from "react-icons/md";

import Empty from "../../_components/empty";
import { ViewImage } from "@/utils/viewImage";

const getAge = (dob: any) => {
  if (!dob) return null;
  const d = dayjs(dob);
  if (!d.isValid()) return null;
  return dayjs().diff(d, "year");
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
      title: "ID",
      dataIndex: "patientId",
      key: "patientId",
      width: 80,
      render: (item: any) => (
        <div className="font-mono text-[12px]">{item || "-"}</div>
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
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (item: any) => <div>{item || "-"}</div>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (item: any) => <div>{item || "-"}</div>,
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      width: 90,
      render: (item: any) => <div className="capitalize">{item || "-"}</div>,
    },
    {
      title: "Age",
      dataIndex: "dob",
      key: "dob",
      width: 70,
      render: (item: any) => <div>{getAge(item) ?? "-"}</div>,
    },
    {
      title: "Blood",
      dataIndex: "bloodGroup",
      key: "bloodGroup",
      width: 80,
      render: (item: any) => <div>{item || "-"}</div>,
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
            className="p-2!"
            href={`/admin/patients/details?id=${record?._id}`}
          >
            Details
          </Button>
          <Button
            size="small"
            onClick={() => props?.onEdit(record)}
            className="p-1!"
          >
            <MdOutlineEditNote size={20} />
          </Button>
          <Popconfirm
            title="Delete the patient"
            description="Are you sure to delete this patient?"
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
