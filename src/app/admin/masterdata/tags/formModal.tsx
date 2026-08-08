"use client";
import React, { useState } from "react";
import { Button, Card, Form, Input, message, Modal, Switch } from "antd";

import { API } from "@/config/apis";
import { POST, PUT } from "@/utils/apiCalls";

function FormModal(props: any) {
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (value: any) => {
    try {
      setIsLoading(true);
      let obj = {
        createdBy: props?.user?._id,
        _id: props?.data?._id,
        value: value?.value,
        status: value?.status,
      };
      let METHOD = props?.data?._id ? PUT : POST;
      let response: any = await METHOD(API.TAG, obj);
      if (response?.status) {
        message.success(
          `Tag ${props?.data?._id ? "updated" : "created"} successfully`,
        );
        props?.onchange();
        props?.onCancel();
      } else {
        message.error(response?.message);
      }
      setIsLoading(false);
    } catch (err) {
      message.error("oops.something gone wrong.");
      console.log("err", err);
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title={`${props?.data?._id ? `Edit` : "Create new"} tag`}
      onCancel={props?.onCancel}
      open={props.visible}
      footer={false}
      width={380}
      centered
    >
      <Form
        onFinish={submit}
        initialValues={{
          value: props?.data?.value,
          status: props?.data?.status ? props?.data?.status : null,
        }}
      >
        <Form.Item
          label={"Tag"}
          name={"value"}
          rules={[{ required: true, message: "Required" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label={"Status"}>
          <Card
            title={<div className="text-[13px] font-medium"></div>}
            size="small"
            extra={
              <Form.Item name={"status"} noStyle>
                <Switch />
              </Form.Item>
            }
            styles={{body:{padding:0}}}
          />
        </Form.Item>
        <div className="flex mt-5 gap-2">
          <Button block size="large" onClick={() => props.onCancel()} danger>
            Close
          </Button>
          <Button
            htmlType="submit"
            block
            size="large"
            type="primary"
            loading={isLoading}
          >
            Done
          </Button>
        </div>
      </Form>
    </Modal>
  );
}

export default FormModal;
