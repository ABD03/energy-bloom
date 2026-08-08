"use client";

import { useEffect, useState } from "react";
import { Alert, Button, Form, Input, Result, Space, Typography, message } from "antd";
import { commitAppName, getExistingSettings, saveSettings } from "./actions";

const { Text, Paragraph } = Typography;

type Props = {
  initialName: string;
  onBack: () => void;
};

export default function Step3({ initialName, onBack }: Props) {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [seeded, setSeeded] = useState<{ email: string; created: boolean }[]>([]);

  useEffect(() => {
    getExistingSettings().then((existing) => {
      if (existing) {
        form.setFieldsValue({
          name: existing.name || initialName || "",
          tagline: existing.tagline,
          metaTitle: existing.metaTitle,
          metaDescription: existing.metaDescription,
          contactEmail: existing.contactEmail,
        });
      } else if (initialName) {
        form.setFieldValue("name", initialName);
      }
    });
  }, [initialName, form]);

  const onFinish = async (values: any) => {
    setSaving(true);
    try {
      const res = await saveSettings({
        name: values.name?.trim() || "",
        tagline: values.tagline?.trim(),
        metaTitle: values.metaTitle?.trim(),
        metaDescription: values.metaDescription?.trim(),
        contactEmail: values.contactEmail?.trim(),
      });
      if (res.ok) {
        const commit = await commitAppName(values.name?.trim() || "");
        if (!commit.ok) {
          message.error(commit.message || "Could not finalize setup");
          return;
        }
        setSeeded((res as any).seeded || []);
        setDone(true);
      } else {
        message.error(res.message || "Save failed");
      }
    } finally {
      setSaving(false);
    }
  };

  if (done) {
    return (
      <Result
        status="success"
        title="Setup complete"
        subTitle="Restart the app so the new environment variables load."
        extra={[
          <Alert
            key="cmd"
            type="warning"
            showIcon
            message="Stop the running dev server (Ctrl+C) and start it again:"
            description={<Text code>npm run dev</Text>}
          />,
          <Alert
            key="seed"
            type="info"
            showIcon
            style={{ marginTop: 12, textAlign: "left" }}
            message="Seeded users"
            description={
              <div>
                <div>
                  <Text strong>Admin</Text> — <Text code>admin@example.com</Text> / <Text code>admin@123</Text>
                  {seeded.find((s) => s.email === "admin@example.com" && !s.created) && (
                    <Text type="secondary"> (already existed)</Text>
                  )}
                </div>
                <div>
                  <Text strong>User</Text> — <Text code>user@example.com</Text> / <Text code>user@123</Text>
                  {seeded.find((s) => s.email === "user@example.com" && !s.created) && (
                    <Text type="secondary"> (already existed)</Text>
                  )}
                </div>
                <Paragraph type="warning" style={{ marginTop: 8, marginBottom: 0 }}>
                  Change these passwords immediately.
                </Paragraph>
              </div>
            }
          />,
          <Paragraph key="note" type="secondary" style={{ marginTop: 16 }}>
            The app will not use the new config until it restarts.
          </Paragraph>,
        ]}
      />
    );
  }

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item
        label="Site name"
        name="name"
        rules={[{ required: true, message: "Site name is required" }]}
      >
        <Input placeholder="My App" />
      </Form.Item>
      <Form.Item label="Tagline" name="tagline">
        <Input placeholder="A short tagline" />
      </Form.Item>
      <Form.Item label="Meta title" name="metaTitle">
        <Input placeholder="Default SEO title" />
      </Form.Item>
      <Form.Item label="Meta description" name="metaDescription">
        <Input.TextArea rows={3} placeholder="Default SEO description" />
      </Form.Item>
      <Form.Item label="Contact email" name="contactEmail">
        <Input placeholder="hello@example.com" />
      </Form.Item>

      <Space>
        <Button onClick={onBack}>Back</Button>
        <Button type="primary" htmlType="submit" loading={saving}>
          Save & finish
        </Button>
      </Space>
    </Form>
  );
}
