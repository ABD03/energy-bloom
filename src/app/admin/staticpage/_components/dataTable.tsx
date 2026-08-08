import { dayjs } from "@/utils/common";
import { useRouter } from "next/navigation";
import { Button, Pagination, Popconfirm, Table, Tag, Image } from "antd";
import { IoTrashOutline } from "react-icons/io5";
import { MdOutlineEditNote } from "react-icons/md";
import { GoLinkExternal } from "react-icons/go";

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

  const openLink = (record: any) => {
    const link = `/page/${record?.permalink}`;
    window.open(link, "_blank", "noopener noreferrer");
  };

  const columns: any = [
    {
      title: "",
      dataIndex: "meta_image",
      key: "meta_image",
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
      title: "Page name",
      dataIndex: "name",
      key: "name",
      render: (item: any) => <div className="font-medium">{item}</div>,
    },
    {
      title: "Permalink",
      dataIndex: "permalink",
      key: "permalink",
      render: (item: any) => (
        <span className="text-[12px] text-gray-500">/{item}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (item: any) => (
        <Tag color={item ? "green" : "red"}>{item ? "Active" : "Inactive"}</Tag>
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
      width: 110,
      render: (_: any, record: any) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            size="small"
            onClick={() => openLink(record)}
            className="p-1!"
          >
            <GoLinkExternal size={17} />
          </Button>
          <Button
            size="small"
            className="p-1!"
            onClick={() =>
              navigation.push(`/admin/staticpage/form?id=${record?._id}`)
            }
          >
            <MdOutlineEditNote size={20} />
          </Button>
          <Popconfirm
            title="Delete this page"
            description={`Permanently delete /${record?.permalink}?`}
            onConfirm={() => props?.onDelete(record)}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
            placement="left"
          >
            <Button className="p-1!" size="small" danger>
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
