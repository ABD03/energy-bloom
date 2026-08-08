"use client";

import { Form, Input } from "antd";

export default function BasicFields() {
  return (
    <>
      <Form.Item
        label="App name"
        name="name"
        rules={[{ required: true, message: "App name is required" }]}
      >
        <Input placeholder="My App" />
      </Form.Item>

      <Form.Item
        label="Database URI"
        name="databaseUri"
        rules={[{ required: true, message: "Database URI is required" }]}
      >
        <Input placeholder="mongodb+srv://user:pass@cluster/db" />
      </Form.Item>

      <Form.Item
        label="Encrypt key"
        name="encryptKey"
        extra="Leave empty to auto-generate. Used to sign JWTs and encrypt redux-persist state."
      >
        <Input.Password placeholder="auto-generated if empty" />
      </Form.Item>
    </>
  );
}
