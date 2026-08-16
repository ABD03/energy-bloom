"use client";
import { useState } from "react";
import { Button, Card, Form, Input, message, Modal, Switch } from "antd";

import { API } from "@/config/apis";
import { POST, PUT } from "@/utils/apiCalls";

function FormModal(props: any) {
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (value: any) => {
    try {
      setIsLoading(true);
      const obj = {
        createdBy: props?.user?._id,
        _id: props?.data?._id,
        question: value?.question,
        answer: value?.answer,
        position: value?.position,
        status: value?.status,
      };
      const METHOD = props?.data?._id ? PUT : POST;
      const response: any = await METHOD(API.FAQS, obj);
      if (response?.status) {
        message.success(
          `FAQ ${props?.data?._id ? "updated" : "created"} successfully`,
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
      title={`${props?.data?._id ? "Edit" : "Create"} FAQ`}
      onCancel={props?.onCancel}
      open={props.visible}
      footer={false}
      width={520}
      centered
    >
      <Form
        layout="vertical"
        onFinish={submit}
        initialValues={{
          question: props?.data?.question,
          answer: props?.data?.answer,
          position: props?.data?.position ?? 0,
          status: props?.data?.status ?? true,
        }}
      >
        <Form.Item
          label="Question"
          name="question"
          rules={[{ required: true, message: "Required" }]}
        >
          <Input placeholder="e.g. How long does the UK visa process take?" />
        </Form.Item>
        <Form.Item
          label="Answer"
          name="answer"
          rules={[{ required: true, message: "Required" }]}
        >
          <Input.TextArea rows={5} placeholder="The full answer to display" />
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
