"use client";
import React, { useState } from "react";
import {
  Button,
  DatePicker,
  Drawer,
  Form,
  Input,
  message,
  Select,
  Switch,
} from "antd";

import FilePicker from "../../_components/filePicker";
import { FaRegSave } from "react-icons/fa";

import { API } from "@/config/apis";
import { POST, PUT } from "@/utils/apiCalls";
import { dayjs } from "@/utils/common";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
  (v) => ({ label: v, value: v }),
);

function FormModal(props: any) {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [image_url, setImage_url] = useState(props?.data?.image);
  const [status, setStatus] = useState<boolean>(props?.data?.status ?? true);

  const submit = async (value: any) => {
    try {
      setIsLoading(true);
      const obj: any = {
        createdBy: props?.user?._id,
        _id: props?.data?._id,
        name: value?.name,
        email: value?.email,
        phone: value?.phone,
        gender: value?.gender,
        dob: value?.dob ? value.dob.toISOString() : null,
        image: image_url,
        bloodGroup: value?.bloodGroup,
        address: value?.address,
        status,
      };
      const METHOD = props?.data?._id ? PUT : POST;
      const response: any = await METHOD(API.PATIENTS, obj);
      if (response?.status) {
        message.success(
          `Patient ${props?.data?._id ? "updated" : "created"} successfully`,
        );
        props?.onchange();
        props?.onCancel();
      } else {
        message.error(response?.message);
      }
      setIsLoading(false);
    } catch (err) {
      message.error("oops.something gone wrong.");
      console.log("err", err);
      setIsLoading(false);
    }
  };

  return (
    <Drawer
      title={`${props?.data?._id ? "Edit" : "New"} patient`}
      onClose={props?.onCancel}
      open={props.visible}
      placement="right"
      size="large"
      styles={{ body: { padding: 20 } }}
      footer={
        <div className="flex items-center justify-between gap-2 py-1">
          <Switch
            checked={status}
            onChange={setStatus}
            checkedChildren="Active"
            unCheckedChildren="Inactive"
          />
          <div className="flex items-center gap-2">
            <Button size="large" onClick={() => props.onCancel()} danger>
              Close
            </Button>
            <Button
              size="large"
              type="primary"
              loading={isLoading}
              onClick={() => form.submit()}
            >
              <FaRegSave /> Save
            </Button>
          </div>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={submit}
        initialValues={{
          name: props?.data?.name,
          email: props?.data?.email,
          phone: props?.data?.phone,
          gender: props?.data?.gender,
          dob: props?.data?.dob ? dayjs(props?.data?.dob) : null,
          bloodGroup: props?.data?.bloodGroup,
          address: props?.data?.address,
          image: props?.data?.image,
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 mb-2">
          <Form.Item
            label={"Full Name"}
            name={"name"}
            rules={[{ required: true, message: "Required" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={"Phone"}
            name={"phone"}
            rules={[{ required: true, message: "Required" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={"Email"}
            name={"email"}
            rules={[{ type: "email", message: "Enter a valid email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label={"Gender"} name={"gender"}>
            <Select
              allowClear
              options={[
                { label: "Male", value: "male" },
                { label: "Female", value: "female" },
                { label: "Other", value: "other" },
              ]}
            />
          </Form.Item>
          <Form.Item label={"Date of Birth"} name={"dob"}>
            <DatePicker className="w-full!" />
          </Form.Item>
          <Form.Item label={"Blood Group"} name={"bloodGroup"}>
            <Select allowClear options={BLOOD_GROUPS} />
          </Form.Item>
          <Form.Item
            label={"Address"}
            name={"address"}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            label={"Profile Image"}
            name={"image"}
          >
            <FilePicker
              url={image_url}
              onchange={(value: any) => {
                form.setFieldValue("image", value?.name);
                setImage_url(value?.name);
              }}
            />
          </Form.Item>
        </div>
      </Form>
    </Drawer>
  );
}

export default FormModal;
