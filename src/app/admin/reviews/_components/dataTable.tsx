import { dayjs } from "@/utils/common";
import { useRouter } from "next/navigation";
import { Button, Image, Pagination, Popconfirm, Rate, Table, Tag } from "antd";
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

  const columns: any = [
    {
      title: "",
      dataIndex: "image",
      key: "image",
      width: 20,
      render: (item: any) => (
        <Image
          src={ViewImage(item)}
          preview={ViewImage(item)}
          width={40}
          height={30}
          className="rounded-md! object-cover"
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (item: any) => <div className="font-medium">{item}</div>,
    },
    {
      title: "Review",
      dataIndex: "description",
      key: "description",
      render: (item: any) => (
        <div className="text-[12px] text-gray-600 line-clamp-2 max-w-md">
          {item}
        </div>
      ),
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      width: 140,
      render: (item: any) => (
        <Rate disabled defaultValue={item ?? 5} style={{ fontSize: 12 }} />
      ),
    },
    {
      title: "Order",
      dataIndex: "position",
      key: "position",
      width: 100,
      render: (item: any) => <Tag>{item ?? 0}</Tag>,
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
      render: (_: any, record: any) => (
        <div className="flex items-center justify-end gap-2">
          <Button size="small" onClick={() => props?.onEdit(record)} className="p-1!">
            <MdOutlineEditNote size={20} />
          </Button>
          <Popconfirm
            title="Delete review"
            description="Are you sure to delete this review?"
            onConfirm={() => props?.onDelete(record)}
            okText="Yes"
            cancelText="No"
            placement="left"
          >
            <Button danger size="small" className="p-1!">
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
