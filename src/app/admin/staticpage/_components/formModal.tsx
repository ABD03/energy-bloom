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
        link: value?.link,
        position: value?.position,
        image: image_url,
      };
      let METHOD = props?.data?._id ? PUT : POST;
      let response: any = await METHOD(API.WIDGETS, obj);
      if (response?.status) {
        message.success(
          `Widget ${props?.data?._id ? "updated" : "created"} successfully`,
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
      title={`${props?.data?._id ? `Edit` : "Create"} widget`}
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
          link: props?.data?.link,
          status: props?.data?.status ? props?.data?.status :undefined,
          position: props?.data?.position ? props?.data?.position : undefined,
        }}
      >
        <Form.Item label={"Image"} name={"image"}>
          <FilePicker
            url={image_url}
            onchange={(value: any) => setImage_url(value?.name)}
          />
        </Form.Item>
        <Form.Item
          label={"Label"}
          name={"value"}
          rules={[{ required: true, message: "Required" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={"Link"}
          name={"link"}
          rules={[{ required: true, message: "Required" }]}
        >
          <Input />
        </Form.Item>
        <div className="flex gap-2">
          <div className="flex-1">
            <Form.Item
              label={"Display Order"}
              name={"position"}
              rules={[{ required: true, message: "Required" }]}
            >
              <Input type="number" />
            </Form.Item>
          </div>
          <div className="flex-1 pt-5">
            <Card
              title={
                <div className="text-[13px] font-medium">Status</div>
              }
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
          <Button htmlType="submit" block type="primary" loading={isLoading} size="large">
            Done
          </Button>
        </div>
      </Form>
    </Modal>
  );
}

export default FormModal;
