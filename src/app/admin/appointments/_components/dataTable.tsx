import { useRouter } from "next/navigation";
import { Pagination, Table, Tag, Card, Button } from "antd";
import { BadgeCheck, ExternalLink, CircleX } from "lucide-react";

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
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: 100,
      render: (item: any) => <div>{item}</div>,
    },
    {
      title: "time",
      dataIndex: "time",
      key: "time",
      width: 100,
      render: (item: any) => <div>{item}</div>,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 300,
      ellipsis: true,
      render: (item: any) => (
        <div className="font-semibold flex gap-4 align-center">
          {item} <ExternalLink size={15} color="var(--primary)" />
        </div>
      ),
    },
    {
      title: "Contact Number",
      dataIndex: "phone",
      key: "phone",
      width: 200,
      ellipsis: true,
      render: (item: any) => <div>{item}</div>,
    },
    {
      title: "status",
      dataIndex: "status",
      key: "status",
      width: 10,
      render: (item: any) => (
        <Tag
          color={
            item === "pending"
              ? "orange"
              : item === "canceled"
              ? "red"
              : "green"
          }
        >
          {item}
        </Tag>
      ),
    },
    {
      title: "Action",
      width: 50,
      render: (item: any, record: any) => (
        <div className="dashboard-table-action">
          <Button
            size="small"
            type="default"
            className="text-xs!"
            onClick={() => props?.onClick()}
          >
            <BadgeCheck size={13} className="text-green-500" />
            Attend
          </Button>
          <Button size="small" danger className="text-xs!">
            <CircleX size={13} />
            Cancel
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Card size="small" bodyStyle={{ padding: 0 }}>
      <Table
        size="small"
        dataSource={props?.data}
        columns={columns}
        pagination={false}
        loading={props?.loading}
        scroll={{ x: "max-content" }}
      />
      <div className="dashboard-pagination">
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
    </Card>
  );
}

export default DataTable;
