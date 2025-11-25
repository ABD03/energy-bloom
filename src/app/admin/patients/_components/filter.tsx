import { useCallback } from "react";
import { Button, Form, Input, Segmented, Select } from "antd";
import { debounce } from "lodash";
import { useRouter } from "next/navigation";
import { Search, CircleX } from "lucide-react";

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
      if (value?.gender) {
        params.set("gender", value?.gender);
      } else {
        params.delete("gender");
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
      <div className="dashboard-Filter-box pb-3">
        <div style={{ minWidth: 250 }}>
          <Form.Item noStyle name={"query"}>
            <Input
              placeholder="Search Patient Name,phone"
              allowClear
              prefix={<Search size={15} color="grey" />}
              style={{ width: 250 }}
            />
          </Form.Item>
        </div>
        <div style={{ minWidth: 150 }}>
          <Form.Item noStyle name={"gender"}>
            <Select style={{ width: 150 }} placeholder="Filter Gender">
              <Select.Option value={"male"}>Male</Select.Option>
              <Select.Option value={"female"}>Female</Select.Option>
            </Select>
          </Form.Item>
        </div>
        {props?.query || props?.gender || props?.status ? (
          <Form.Item noStyle>
            <Button
              icon={<CircleX size={15} />}
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
                label: "Active",
                value: "active",
              },
              {
                label: "Inactive",
                value: "inactive",
              },
            ]}
          />
        </Form.Item>
      </div>
    </Form>
  );
};

export default Filters;
