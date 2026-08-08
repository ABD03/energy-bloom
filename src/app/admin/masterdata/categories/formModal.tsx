"use client";
import React, { useState } from "react";
import { Button, Card, Form, Input, message, Modal, Switch } from "antd";

import FilePicker from "../../_components/filePicker";

import { API } from "@/config/apis";
import { POST, PUT } from "@/utils/apiCalls";

function FormModal(props: any) {
  const [isLoading, setIsLoading] = useState(false);
  const [image_url, setImage_url] = useState(props?.data?.image);

  const submit = async (value: any) => {
    try {
      setIsLoading(true);
      let obj = {
        createdBy: props?.user?._id,
        _id: props?.data?._id,
        value: value?.value,
        status: value?.status,
        show_home: value?.show_home,
        position: value?.position,
        image: image_url,
      };
      let METHOD = props?.data?._id ? PUT : POST;
      let response: any = await METHOD(API.CATEGORY, obj);
      if (response?.status) {
        message.success(
          `Category ${props?.data?._id ? "updated" : "created"} successfully`,
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
      title={`${props?.data?._id ? `Edit` : "Create"} category`}
      onCancel={props?.onCancel}
      open={props.visible}
      footer={false}
      width={380}
      centered
    >
      <Form
        layout="vertical"
        onFinish={submit}
        initialValues={{
          value: props?.data?.value,
          show_home: props?.data?.show_home,
          status: props?.data?.status ? props?.data?.status : null,
          position: props?.data?.position ? props?.data?.position : 0,
        }}
      >
        <Form.Item label={"Image"} name={"image"}>
          <FilePicker
            url={image_url}
            onchange={(value: any) => setImage_url(value?.name)}
          />
        </Form.Item>
        <Form.Item
          label={"Category"}
          name={"value"}
          rules={[{ required: true, message: "Required" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={"Display Order"}
          name={"position"}
          rules={[{ required: true, message: "Required" }]}
        >
          <Input type="number" />
        </Form.Item>
        <div className="flex gap-2 mt-6">
          <div className="flex-1">
            <Card
              title={<div className="text-[13px] font-medium">Show Home</div>}
              size="small"
              extra={
                <Form.Item name={"show_home"} noStyle>
                  <Switch />
                </Form.Item>
              }
            styles={{body:{padding:0}}}
            />
          </div>
          <div className="flex-1">
            <Card
              title={<div className="text-[13px] font-medium">Status</div>}
              size="small"
              extra={
                <Form.Item name={"status"} noStyle>
                  <Switch />
                </Form.Item>
              }
             styles={{body:{padding:0}}}
            />
          </div>
        </div>

        <div className="flex mt-5 gap-2">
          <Button block onClick={() => props.onCancel()} danger size="large">
            Close
          </Button>
          <Button
            htmlType="submit"
            block
            type="primary"
            loading={isLoading}
            size="large"
          >
            Done
          </Button>
        </div>
      </Form>
    </Modal>
  );
}

export default FormModal;
