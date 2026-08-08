import { dayjs } from "@/utils/common";
import { useRouter } from "next/navigation";
import { Button, Pagination, Popconfirm, Table, Tag } from "antd";
import { LuTags } from "react-icons/lu";
import { IoTrashOutline } from "react-icons/io5";
import { MdOutlineEditNote } from "react-icons/md";
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
      title: "",
      dataIndex: "name",
      key: "name",
      width: 20,
      render: (item: any, record: any) => (
        <Button
          shape="circle"
          size="middle"
          className="bg-slate-300!"
        >
          <LuTags size={20} color="#fff" />
        </Button>
      ),
    },
    {
      title: "Tag Label",
      dataIndex: "value",
      key: "value",
      render: (item: any, record: any) => <Tag>#{item}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (item: any) => (
        <Tag color={item ? "green" : "red"}>{item ? "active" : "disabled"}</Tag>
      ),
    },
    {
      title: "Created At",
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
            className="p-1!"
          >
            <MdOutlineEditNote size={20} />
          </Button>
          <Popconfirm
            title="Delete the tag"
            description="Are you sure to delete this tag?"
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
