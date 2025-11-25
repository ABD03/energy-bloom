"use client";
import React from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
} from "antd";

function FormModal(props: any) {
  return (
    <Modal
      maskClosable={false}
      title={"New Patient"}
      onCancel={props?.onCancel}
      open={props.visible}
      footer={false}
      width={400}
      centered
    >
      <Form
        layout="vertical"
        style={{ margin: -5, marginTop: 10, marginBottom: -20 }}
      >
        <Form.Item label="Full Name">
          <Input placeholder="Enter Patient Name" />
        </Form.Item>
        <Form.Item label="Gender">
          <Select placeholder="Select gender">
            <Select.Option value="1">Male</Select.Option>
            <Select.Option value="1">Female</Select.Option>
          </Select>
        </Form.Item>
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 mt-5">
          <Form.Item label="Age">
            <Input placeholder="Enter Patient Age" />
          </Form.Item>
          <Form.Item label="DOB">
            <DatePicker
              placeholder="Enter Patient Age"
              style={{ width: "100%" }}
            />
          </Form.Item>
        </div>
        <Form.Item label="Phone Number">
          <Input placeholder="Enter phone" />
        </Form.Item>
        <Form.Item label="Email Address">
          <Input placeholder="Enter email" />
        </Form.Item>
        <Form.Item label="Address">
          <Input.TextArea rows={4} />
        </Form.Item>
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 mt-5">
          <Form.Item>
            <Button danger block onClick={() => props?.onCancel()}>
              Close
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="primary" block onClick={() => props?.onCancel()}>
              Submit
            </Button>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
}

export default FormModal;
