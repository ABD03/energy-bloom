import { useRouter } from "next/navigation";
import { Pagination, Table, Tag, Card, Button, Avatar } from "antd";
import { BadgeCheck, ExternalLink } from "lucide-react";

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
      Width: 10,
      render: (item: any) => (
        <Avatar size="small" src={item} />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
      render: (item: any) => (
        <div className="font-semibold flex gap-4 align-center">
          {item} <ExternalLink size={15} color="var(--primary)" />
        </div>
      ),
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
      width: 20,
      ellipsis: true,
      render: (item: any) => <div>{item}</div>,
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      width: 20,
      ellipsis: true,
      render: (item: any) => <div>{item}</div>,
    },
    {
      title: "Contact Number",
      dataIndex: "phone",
      key: "phone",
      ellipsis: true,
      render: (item: any) => <div>{item}</div>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
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
          variant="outlined"
          color={
            item === "active"
              ? "green"
              :"red"
          }
        >
          {item}
        </Tag>
      ),
    },
    {
      title: "Registered on",
      dataIndex: "date",
      key: "date",
      width: 100,
      ellipsis: true,
      render: (item: any) => <div>{item}</div>,
    },
    {
      title: "Action",
      width: 50,
      render: (item: any, record: any) => (
        <div className="dashboard-table-action">
          <Button
            size="small"
            type="primary"
            className="text-xs!"
            onClick={() => props?.onClick()}
          >
            <BadgeCheck size={13}/>
            Details
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
