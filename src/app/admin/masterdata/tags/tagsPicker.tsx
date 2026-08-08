import React, { useCallback, useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Divider, Flex, Form, Input, message, Select } from "antd";
import { debounce } from "lodash";

import { API } from "@/config/apis";
import { GET, POST } from "@/utils/apiCalls";
import { UseAppSelector } from "@/redux/util/hooks";

const TagPicker = (props: any) => {
  const [form] = Form.useForm();
  const Auth = UseAppSelector((state: any) => state?.Auth);
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(false);
  const [items, setItems] = useState([]);

  const [search, setSearch] = useState<any>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      tagPicker();
    }
  }, [search]);

  const tagPicker = async () => {
    try {
      setLoading(true);
      let URL = `${API.TAG_PICKER}?search=${search}`;
      let response: any = await GET(URL, null);
      if (response?.status) {
        setItems(response?.data);
      } else {
        setItems([]);
      }
      setLoading(false);
    } catch (err) {
      setItems([]);
      setLoading(false);
    }
  };

  const submit = async (value: any) => {
    try {
      setLoading2(true);
      let obj = {
        createdBy: Auth?.user?._id,
        value: value?.value,
        status: true,
      };
      let response: any = await POST(API.TAG, obj);
      if (response?.status) {
        form.resetFields();
        tagPicker();
        message.success(`Tag created successfully`);
      } else {
        message.error(response?.message);
      }
      setLoading2(false);
    } catch (err) {
      message.error("oops.something gone wrong.");
      console.log("err", err);
      setLoading2(false);
    }
  };

  const onValuesChange = useCallback(
      debounce((value: any) => {
        setSearch(value);
      }, 500),
      []
    );

  return (
    <Select
      loading={loading}
      options={items.map((item: any) => ({
        label: item?.value,
        value: item?._id,
      }))}
      value={props?.value}
      labelInValue
      style={{ width: "100%" }}
      placeholder="select tags"
      mode="multiple"
      allowClear
      filterOption={false}
      showSearch={true}
      onSearch={(value) => loading?message.info("Loading..."):onValuesChange(value)}
      onChange={(value, values: any) => props?.onChange(values)}
      popupRender={(menu) => (
        <>
          {menu}
          <Divider style={{ margin: "8px 0" }} />
          <Form form={form} layout="horizontal" onFinish={submit}>
            <Flex gap={10} style={{ padding: 8 }}>
              <Form.Item noStyle name={"value"}>
                <Input
                  placeholder="Please enter tag"
                  style={{ width: "50%" }}
                />
              </Form.Item>
              <Form.Item noStyle>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading2}
                >
                  Add tag <PlusOutlined />
                </Button>
              </Form.Item>
            </Flex>
          </Form>
        </>
      )}
    />
  );
};

export default TagPicker;
