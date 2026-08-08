import { dayjs } from "@/utils/common";
import { Button, Image, Popconfirm, Table } from "antd";
import { IoCloudDownloadOutline, IoCopyOutline } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import { ViewImage } from "@/utils/viewImage";

function DataTable(props: any) {
  const columns = [
    {
      title: "",
      dataIndex: "name",
      key: "name",
      width: 30,
      render: (item: any) => (
        <Image
          alt="image"
          src={ViewImage(item)}
          preview={ViewImage(item) as any}
          width={40}
          height={40}
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (item: any) => (
        <div className="font-semibold text-[14px] flex gap-1"> {item}</div>
      ),
    },
    {
      title: "Caption",
      dataIndex: "caption",
      key: "caption",
      render: (item: any) => <div>{item}</div>,
    },
    {
      title: "Size",
      dataIndex: "size",
      key: "size",
      render: (item: any) => <div>{item} MB</div>,
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
            className="p-1!"
            size="small"
            onClick={() => props?.copyImage(ViewImage(record?.name))}
          >
            <IoCopyOutline size={15} color="green" />
          </Button>
          <Button
            className="p-1!"
            size="small"
            onClick={() => props?.handleDownload(ViewImage(record?.name))}
          >
            <IoCloudDownloadOutline size={15} color="blue" />
          </Button>
          <Popconfirm
            title="Delete the file"
            description="Are you sure to delete this file?"
            onConfirm={() => props?.onDelete(record)}
            okText="Yes"
            cancelText="No"
            placement="left"
          >
            <Button
              className="p-1!"
              size="small"
              danger
              disabled={record?._id === props?.user?._id}
            >
              <RiDeleteBin6Line size={15} color="red" />
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
        scroll={{ x: "max-content" }}
      />
    </>
  );
}

export default DataTable;
