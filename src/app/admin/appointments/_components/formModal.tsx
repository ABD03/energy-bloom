"use client";
import React from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  TimePicker,
} from "antd";

function FormModal(props: any) {
  return (
    <Modal
      maskClosable={false}
      title={"New Appointment"}
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
        <Form.Item label="Patient">
          <Select placeholder="Select Patient">
            <Select.Option value="1">Abdul Riyas</Select.Option>
            <Select.Option value="1">Jamshad k k</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Select Date">
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label="Select Time">
          <TimePicker style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label="Notes">
          <Input.TextArea rows={5}/>
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
