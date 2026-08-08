"use client";

import { ColorPicker, Divider, Form } from "antd";

export default function ThemeFields() {
  return (
    <>
      <Divider plain />

      <Form.Item
        label="Primary color"
        name="primaryColor"
        rules={[{ required: true }]}
      >
        <ColorPicker showText format="hex" />
      </Form.Item>
    </>
  );
}
