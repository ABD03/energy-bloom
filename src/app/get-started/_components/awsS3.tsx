"use client";

import { Alert, Divider, Form, Input } from "antd";

export default function AwsS3Fields() {
  return (
    <>
      <Divider orientation="left" plain>
        AWS S3
      </Divider>

      <Alert
        type="info"
        showIcon
        message="If you're using local file upload, you can ignore this section."
        style={{ marginBottom: 16 }}
      />

      <Form.Item label="Public S3 URL" name="s3Url">
        <Input placeholder="https://cdn.example.com" />
      </Form.Item>
      <Form.Item label="Bucket name" name="s3Bucket">
        <Input placeholder="my-bucket" />
      </Form.Item>
      <Form.Item label="Folder" name="s3Folder">
        <Input placeholder="uploads" />
      </Form.Item>
      <Form.Item label="Region" name="s3Region">
        <Input placeholder="ap-south-1" />
      </Form.Item>
      <Form.Item label="Access key" name="s3AccessKey">
        <Input placeholder="AKIA..." />
      </Form.Item>
      <Form.Item label="Secret key" name="s3SecretKey">
        <Input.Password placeholder="********" />
      </Form.Item>
    </>
  );
}
