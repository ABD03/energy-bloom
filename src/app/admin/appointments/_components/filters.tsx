import { Button, DatePicker, Form, Input, Segmented } from "antd";
import { debounce } from "lodash";
import { dayjs } from "@/utils/common";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { IoSearchOutline, IoCloseCircleOutline } from "react-icons/io5";

import DoctorPicker from "../../doctors/_components/doctorPicker";

const Filters = (props: any) => {
  const navigation = useRouter();
  const [form] = Form.useForm();

  const onValuesChange = useCallback(
    debounce((value: any) => {
      const params = new URLSearchParams();
      params.set("page", "1");
      params.set("limit", "10");
      if (value?.query) params.set("search", value.query.toString());
      if (value?.date) {
        const date = dayjs(value.date?.$d).format("YYYY-MM-DD");
        params.set("date", date.toString());
      }
      if (value?.status) params.set("status", value.status.toString());
      if (value?.doctor) params.set("doctor", value.doctor.toString());
      navigation.push(`?${params.toString()}`);
    }, 500),
    [],
  );

  const clearFilter = () => {
    form.setFieldsValue({
      query: null,
      status: "upcoming",
      date: null,
      doctor: null,
    });
    const params = new URLSearchParams();
    params.set("page", "1");
    params.set("limit", "10");
    params.set("status", "upcoming");
    navigation.replace(`?${params.toString()}`);
  };

  return (
    <Form
      form={form}
      initialValues={{
        query: props?.query,
        status: props?.status,
        date: props?.date ? dayjs(props?.date, "YYYY-MM-DD") : null,
        doctor: props?.doctor || undefined,
      }}
      onValuesChange={(_: any, values: any) => onValuesChange(values)}
    >
      <div className="flex flex-row items-center gap-2 flex-nowrap overflow-x-auto md:overflow-x-visible scrollbar-hide p-2">
        <div className="w-62.5">
          <Form.Item noStyle name={"query"}>
            <Input
              placeholder="Search patient or doctor"
              allowClear
              prefix={<IoSearchOutline size={15} color="grey" />}
              className="w-62.5!"
            />
          </Form.Item>
        </div>
        <div className="w-62.5">
          <Form.Item noStyle name={"doctor"}>
            <DoctorPicker
              initial={props?.doctorInitial}
              placeholder="Filter doctor"
            />
          </Form.Item>
        </div>
        <div className="w-37.5">
          <Form.Item noStyle name={"date"}>
            <DatePicker placeholder="Date" allowClear className="w-37.5!" />
          </Form.Item>
        </div>
        {props?.query || props?.date || props?.doctor ? (
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
        <Form.Item noStyle name={"status"}>
          <Segmented<string>
            options={[
              { label: "All", value: "all" },
              { label: "Upcoming", value: "upcoming" },
              { label: "Attended", value: "attended" },
              { label: "Expired", value: "expired" },
              { label: "Cancelled", value: "cancelled" },
            ]}
          />
        </Form.Item>
      </div>
    </Form>
  );
};

export default Filters;
