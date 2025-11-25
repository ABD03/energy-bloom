"use client";
import React from "react";
import {
  Avatar,
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  Tag,
  TimePicker,
  Upload,
} from "antd";
import { FileUp } from "lucide-react";
import { ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";

function AttendModal(props: any) {
  const navigation = useRouter();

  const details = () => {
    props.onCancel();
    navigation.push(`/admin/patients/121212`);
  };
  return (
    <Modal
      maskClosable={false}
      title={"Attending Appointment"}
      onCancel={props?.onCancel}
      open={props.visible}
      footer={false}
      width={600}
      centered
    >
      <Form
        layout="vertical"
        style={{ margin: -5, marginTop: 10, marginBottom: -20 }}
      >
        <Card
          size="small"
          title="Patient"
          extra={
            <Button type="link" size="small" onClick={() => details()}>
              Details <ExternalLink size={15} />
            </Button>
          }
          style={{ marginBottom: 15 }}
        >
          <div className="flex gap-4">
            <div>
              <Avatar />
            </div>
            <div>
              <div className="font-bold text-lg">
                Marko louise - <Tag variant="outlined">Male/18</Tag>
              </div>
              <div>mark@gmail.com</div>
            </div>
          </div>
        </Card>
        <Form.Item label="Attending doctor">
          <Select placeholder="Select Doctor">
            <Select.Option value="1">Abdul Riyas</Select.Option>
            <Select.Option value="2">Jamshad k k</Select.Option>
          </Select>
        </Form.Item>
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 mt-5">
          <Form.Item label="Attending Date">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="Attending Time">
            <TimePicker style={{ width: "100%" }} />
          </Form.Item>
        </div>
        <Form.Item label="Notes">
          <Input.TextArea rows={5} />
        </Form.Item>
        <Form.Item label="Attachments">
          <Upload.Dragger
            maxCount={5}
            listType="picture"
            beforeUpload={() => false}
          >
            <div className="flex flex-col items-center justify-center gap-2">
              <FileUp size={30} color="#7f00ff" />
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
              <p className="text-xs">
                Support for a single or bulk upload. Strictly prohibited from
                uploading company data or other banned files.
              </p>
            </div>
          </Upload.Dragger>
        </Form.Item>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
          <div></div>
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
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
        </div>
      </Form>
    </Modal>
  );
}

export default AttendModal;
