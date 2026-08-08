import { dayjs } from "@/utils/common";
import { useRouter } from "next/navigation";
import { Button, Pagination, Popover, Table, Tag, Image, Modal } from "antd";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { IoTrashOutline } from "react-icons/io5";
import { MdOutlineEditNote } from "react-icons/md";
import { PiBellSimpleRingingFill } from "react-icons/pi";
import { GoLinkExternal } from "react-icons/go";

import Empty from "../../_components/empty";
import Tags from "./tags";
import { ViewImage } from "@/utils/viewImage";

function DataTable(props: any) {
  const navigation = useRouter();
  const pageChange = (page: number, take: number) => {
    const params = new URLSearchParams(location.search);
    params.set("page", page.toString());
    params.set("limit", take.toString());
    navigation.push(`?${params.toString()}`);
  };

  const openLink = (item: any) => {
    const link = `/${item?.permalink}`;
    window.open(link, "_blank", "noopener noreferrer");
  };

  const deleteItem = (record: any) => {
    const link = `/${record?.permalink}`;
    Modal.confirm({
      title: "Are you sure you want to delete this content?",
      content: link,
      okText: "Yes, Delete",
      cancelText: "Cancel",
      centered: true,
      okButtonProps: {
        type: "primary",
        danger: true,
      },
      onOk() {
        props?.onDelete(record);
      },
    });
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
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (item: any) => <div>{item}</div>,
    },
    {
      title: "Views",
      dataIndex: "views",
      key: "views",
      width: 70,
      render: (item: any, record: any) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Tag>{item ? item : 0}</Tag>
          {record?.notification_count ? (
            <PiBellSimpleRingingFill color="green" size={15} />
          ) : null}
        </div>
      ),
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      width: 70,
      render: (item: any) => <Tag>{item ? item : 0}</Tag>,
    },
    {
      title: "Type",
      width: 70,
      render: (item: any, record: any) => {
        return (
          <div style={{ display: "flex" }}>
            {record?.is_live || record?.is_premium || record?.is_video ? (
              <>
                {record?.is_live ? <Tag color="orange">Live</Tag> : null}
                {record?.is_premium ? <Tag color="blue">Premium</Tag> : null}
                {record?.is_video ? <Tag color="red">Video</Tag> : null}
              </>
            ) : (
              <Tag>News</Tag>
            )}
          </div>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (item: any) => <Tags status={item} />,
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
          <Button size="small" onClick={() => openLink(record)}  className="p-1!">
            <GoLinkExternal size={17} color="black" />
          </Button>
          <Button
            size="small"
            onClick={() =>
              navigation.push(`/admin/contents/form?id=${record?._id}`)
            }
            className="p-1!"
          >
            <MdOutlineEditNote size={19} color="black" />
          </Button>
          <Popover
            placement="left"
            content={
              <div style={{ width: 170 }}>
                {record?.status === "trashed" ? (
                  <Button block danger onClick={() => deleteItem(record)}>
                    <IoIosCloseCircleOutline size={18} color="red" />
                    Permanent delete
                  </Button>
                ) : (
                  <Button
                    disabled={record?.status === "trashed"}
                    onClick={() => props?.onTrash(record)}
                  >
                    <IoTrashOutline size={18} />
                    Move to trash
                  </Button>
                )}
              </div>
            }
          >
            <Button size="small" danger  className="p-1!">
              <IoTrashOutline size={16} color="red" />
            </Button>
          </Popover>
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
