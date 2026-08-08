import { dayjs } from "@/utils/common";
import { useRouter } from "next/navigation";
import { Button, Pagination, Popconfirm, Table, Tag } from "antd";
import { IoTrashOutline } from "react-icons/io5";
import { CiRead } from "react-icons/ci";
import Empty from "../../_components/empty";

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
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (item: any) => (
        <div className="font-semibold text-[14px]">{item}</div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 200,
      render: (item: any) => <div>{item}</div>,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      width: 200,
      render: (item: any) => <div>{item}</div>,
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
      render: (item: any) => <div>{item}</div>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 50,
      render: (item: any) => (
        <Tag color={item ? "green" : "orange"}>{item ? "readed" : "new"}</Tag>
      ),
    },
    {
      title: "Posted At",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      render: (item: any) => (
        <div className="text-[12px]">{dayjs(item).format("lll")}</div>
      ),
    },
    {
      title: "Action",
      width: 100,
      render: (item: any, record: any) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            size="small"
            onClick={() => props?.onEdit(record)}
            disabled={record?._id === props?.user?._id}
            className="p-1!"
          >
            <CiRead size={18} />
          </Button>
          <Popconfirm
            title="Delete the Member"
            description="Are you sure to delete this Member?"
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
