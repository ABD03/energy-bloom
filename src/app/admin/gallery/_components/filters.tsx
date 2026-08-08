import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { dayjs } from "@/utils/common";
import { debounce } from "lodash";
import { Button, DatePicker, Form, Input, Pagination, Segmented } from "antd";
import { IoSearchOutline, IoCloseCircleOutline } from "react-icons/io5";
import { BsGrid } from "react-icons/bs";
import { LuLayoutList } from "react-icons/lu";

const Filters = (props: any & { page: number; take: number }) => {
  const navigation = useRouter();
  const [form] = Form.useForm();

  const onValuesChange = useCallback(
    debounce((value: any) => {
      const params = new URLSearchParams(location.search);
      params.set("page", "1");
      if (value?.query) {
        params.set("search", value?.query.toString());
      } else {
        params.delete("search");
      }
      if (value?.date) {
        let date = dayjs(value?.date?.$d).format("YYYY-MM-DD");
        params.set("date", date?.toString());
      } else {
        params.delete("date");
      }
      if (value?.view) {
        params.set("view", value?.view?.toString());
      } else {
        params.delete("view");
      }
      navigation.push(`?${params.toString()}`);
    }, 500),
    [],
  );

  const pageChange = (page: number, pageSize: number) => {
    const params = new URLSearchParams(location.search);
    const currentLimit = parseInt(params.get("limit") || "20");
    if (pageSize !== currentLimit) {
      params.set("page", "1");
    } else {
      params.set("page", page.toString());
    }
    params.set("limit", pageSize.toString());
    navigation.push(`?${params.toString()}`);
  };

  const clearFilter = () => {
    form.setFieldsValue({ query: null, status: null, date: null });
    const params = new URLSearchParams(location.search);
    params.set("page", "1");
    params.delete("search");
    params.delete("status");
    params.delete("date");
    navigation.replace(`?${params.toString()}`);
  };

  return (
    <Form
      form={form}
      initialValues={{
        query: props?.query,
        status: props?.status,
      }}
      onValuesChange={(value: any, values: any) => onValuesChange(values)}
    >
      <div className="flex flex-row items-center gap-2 flex-nowrap overflow-x-auto md:overflow-x-visible scrollbar-hide p-2">
        <div className="w-62.5">
          <Form.Item noStyle name={"query"}>
            <Input
              placeholder="Search"
              allowClear
              prefix={<IoSearchOutline size={15} color="grey" />}
              className="w-62.5!"
            />
          </Form.Item>
        </div>
        <div className="w-37.5">
          <Form.Item noStyle name={"date"}>
            <DatePicker placeholder="Date" allowClear className="w-37.5!" />
          </Form.Item>
        </div>
        <Form.Item noStyle name={"view"}>
          <Segmented<string>
            options={[
              {
                label: <BsGrid size={20} className="m-1.25"/>,
                value: "grid",
              },
              {
                label: <LuLayoutList size={20} className="m-1.25" />,
                value: "list",
              },
            ]}
          />
        </Form.Item>
        {props?.query || props?.date ? (
          <Form.Item noStyle>
            <Button
              icon={<IoCloseCircleOutline size={15} />}
              onClick={() => clearFilter()}
              danger
              type="text"
              size="small"
            >
              Clear filter
            </Button>
          </Form.Item>
        ) : null}
        <div className="flex-1" />
        <Pagination
          size="small"
          current={props?.page}
          pageSize={props?.take}
          total={props?.meta?.total}
          showSizeChanger
          pageSizeOptions={[18, 36, 72]}
          onChange={(page, pageSize) => pageChange(page, pageSize)}
        />
      </div>
    </Form>
  );
};

export default Filters;
