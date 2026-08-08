"use client";

import { useEffect, useState } from "react";
import { Button, Form, message } from "antd";
import BasicFields from "./_components/basic";
import AwsS3Fields from "./_components/awsS3";
import ThemeFields from "./_components/theme";
import { getExistingConfig, saveStep1, type Step1Payload } from "./actions";

type Props = {
  onDone: (dbUri: string, appName: string) => void;
};

export default function Step1({ onDone }: Props) {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getExistingConfig().then((cfg) => {
      form.setFieldsValue(cfg);
    });
  }, [form]);

  const onFinish = async (values: any) => {
    setSaving(true);
    try {
      const primaryColor =
        typeof values.primaryColor === "string"
          ? values.primaryColor
          : values.primaryColor.toHexString();
      const payload: Step1Payload = {
        name: values.name.trim(),
        databaseUri: values.databaseUri.trim(),
        encryptKey: values.encryptKey?.trim() || "",
        s3Url: values.s3Url?.trim() || "",
        s3Bucket: values.s3Bucket?.trim() || "",
        s3Folder: values.s3Folder?.trim() || "",
        s3Region: values.s3Region?.trim() || "",
        s3AccessKey: values.s3AccessKey?.trim() || "",
        s3SecretKey: values.s3SecretKey?.trim() || "",
        primaryColor,
      };
      const res = await saveStep1(payload);
      if (res.ok) {
        message.success("Saved. Move on to checks.");
        onDone(payload.databaseUri, payload.name);
      }
    } catch (err) {
      console.error(err);
      message.error("Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{ primaryColor: "#6104cc" }}
    >
      <BasicFields />
      <AwsS3Fields />
      <ThemeFields />

      <Button type="primary" htmlType="submit" block loading={saving}>
        Save & continue
      </Button>
    </Form>
  );
}
