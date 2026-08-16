"use client";
import { useState } from "react";
import { Button, Card, Form, Input, message, Modal, Rate, Switch } from "antd";

import FilePicker from "../../_components/filePicker";

import { API } from "@/config/apis";
import { POST, PUT } from "@/utils/apiCalls";

function FormModal(props: any) {
  const [isLoading, setIsLoading] = useState(false);
  const [image_url, setImage_url] = useState(props?.data?.image);

  const submit = async (value: any) => {
    try {
      setIsLoading(true);
      const obj = {
        createdBy: props?.user?._id,
        _id: props?.data?._id,
        name: value?.name,
        description: value?.description,
        rating: value?.rating,
        status: value?.status,
        position: value?.position,
        image: image_url,
      };
      const METHOD = props?.data?._id ? PUT : POST;
      const response: any = await METHOD(API.REVIEWS, obj);
      if (response?.status) {
        message.success(
          `Review ${props?.data?._id ? "updated" : "created"} successfully`,
        );
        props?.onchange();
        props?.onCancel();
      } else {
        message.error(response?.message);
      }
      setIsLoading(false);
    } catch (err) {
      console.log("err", err);
      message.error("oops.something gone wrong.");
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title={`${props?.data?._id ? "Edit" : "Create"} review`}
      onCancel={props?.onCancel}
      open={props.visible}
      footer={false}
      width={480}
      centered
    >
      <Form
        layout="vertical"
        onFinish={submit}
        initialValues={{
          name: props?.data?.name,
          description: props?.data?.description,
          rating: props?.data?.rating ?? 5,
          status: props?.data?.status ?? true,
          position: props?.data?.position ?? 0,
        }}
      >
        <Form.Item label="Avatar" name="image">
          <FilePicker
            url={image_url}
            onchange={(value: any) => setImage_url(value?.name)}
          />
        </Form.Item>
        <Form.Item
          label="Reviewer name"
          name="name"
          rules={[{ required: true, message: "Required" }]}
        >
          <Input placeholder="e.g. Priya Sharma" />
        </Form.Item>
        <Form.Item
          label="Review"
          name="description"
          rules={[{ required: true, message: "Required" }]}
        >
          <Input.TextArea rows={4} placeholder="What the client said…" />
        </Form.Item>
        <Form.Item label="Rating" name="rating">
          <Rate />
        </Form.Item>

        <div className="grid grid-cols-2 gap-2">
          <Form.Item
            label="Display Order"
            name="position"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input type="number" />
          </Form.Item>
          <div className="mt-3">
            <Card
              title={<div className="text-[13px] font-medium">Status</div>}
              size="small"
              extra={
                <Form.Item name="status" noStyle>
                  <Switch />
                </Form.Item>
              }
              styles={{ body: { padding: 0 } }}
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
