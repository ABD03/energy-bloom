import { Button, DatePicker, Form, Input, Segmented } from "antd";
import { debounce } from "lodash";
import { dayjs } from "@/utils/common";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { IoSearchOutline, IoCloseCircleOutline } from "react-icons/io5";

const Filters = (props: any) => {
  const navigation = useRouter();
  const [form] = Form.useForm();

  const onValuesChange = useCallback(
    debounce((value: any) => {
      const params = new URLSearchParams();
      params.set("page", "1");
      params.set("limit", "10");
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
      if (value?.status) {
        params.set("status", value?.status.toString());
      } else {
        params.delete("status");
      }
      navigation.push(`?${params.toString()}`);
    }, 500),
    []
  );

  const clearFilter = () => {
    form.setFieldsValue({ query: null, status: null });
    const params = new URLSearchParams();
    params.set("page", "1");
    params.set("limit", "10");
    params.delete("search");
    params.delete("status");
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
            <DatePicker placeholder="Date" allowClear className="w-37.5!"/>
          </Form.Item>
        </div>
        {props?.query || props?.date || props?.status ? (
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
        <div style={{ flex: 1 }} />
        <Form.Item noStyle name={"status"}>
          <Segmented<string>
            options={[
              {
                label: "All",
                value: "",
              },
              {
                label: "Draft",
                value: "draft",
              },
              {
                label: "Published",
                value: "published",
              },
              {
                label: "Trashed",
                value: "trashed",
              },
            ]}
          />
        </Form.Item>
      </div>
    </Form>
  );
};

export default Filters;
