import { dayjs } from "@/utils/common";
import { Button, Card, Table, Tag } from "antd";
import { GoLinkExternal } from "react-icons/go";
import { BsLightningChargeFill } from "react-icons/bs";

function Trending(props: any) {
  const openLink = (item: any) => {
    const link = `/${item?.permalink}`;
    window.open(link, "_blank", "noopener noreferrer");
  };

  const columns = [
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
      render: (item: any) => <Tag>{item ? item : 0}</Tag>,
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
      width: 50,
      render: (item: any, record: any) => (
        <div className="flex items-center justify-end gap-2">
          <Button block size="small" onClick={() => openLink(record)}>
            <GoLinkExternal size={18} color="grey" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Card
      title="Trending"
      size="small"
      loading={props?.loading}
      styles={{ body: { padding: 0, overflow: "hidden" } }}
      extra={
        <div>
          <BsLightningChargeFill className="text-primary" />
        </div>
      }
    >
      <Table
        size="small"
        rowKey="_id"
        dataSource={props?.data}
        columns={columns}
        pagination={false}
        loading={props?.loading}
        scroll={{ x: "max-content" }}
      />
    </Card>
  );
}

export default Trending;
