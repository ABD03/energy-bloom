"use client";
import React, { useState } from "react";
import {
  Button,
  Drawer,
  Form,
  Input,
  InputNumber,
  message,
  Select,
  Switch,
} from "antd";
import { FaRegSave } from "react-icons/fa";

import FilePicker from "../../_components/filePicker";
import SlotsList from "./slotsList";

import { API } from "@/config/apis";
import { POST, PUT } from "@/utils/apiCalls";

function FormModal(props: any) {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [image_url, setImage_url] = useState(props?.data?.image);
  const [slots, setSlots] = useState<any[]>(
    Array.isArray(props?.data?.slots) ? props.data.slots : [],
  );

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
        image: image_url,
        specialization: value?.specialization,
        qualification: value?.qualification,
        experienceYears: value?.experienceYears,
        consultationFee: value?.consultationFee,
        bio: value?.bio,
        status: value?.status,
        slots,
      };
      const METHOD = props?.data?._id ? PUT : POST;
      const response: any = await METHOD(API.DOCTORS, obj);
      if (response?.status) {
        message.success(
          `Doctor ${props?.data?._id ? "updated" : "created"} successfully`,
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
      title={`${props?.data?._id ? "Edit" : "New"} doctor`}
      onClose={props?.onCancel}
      open={props.visible}
      placement="right"
      size="large"
      styles={{
        body: { padding: 20 },
      }}
      footer={
        <div className="flex items-center justify-end gap-2 py-1">
          <Button size="large" onClick={() => props.onCancel()} danger>
            Close
          </Button>
          <Button
            size="large"
            type="primary"
            loading={isLoading}
            onClick={() => form.submit()}
          >
            <FaRegSave/> Save
          </Button>
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
          specialization: props?.data?.specialization,
          qualification: props?.data?.qualification,
          experienceYears: props?.data?.experienceYears,
          consultationFee: props?.data?.consultationFee,
          bio: props?.data?.bio,
          image: props?.data?.image,
          status: props?.data?.status ?? true,
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
          <Form.Item label={"Specialization"} name={"specialization"}>
            <Input />
          </Form.Item>
          <Form.Item label={"Qualification"} name={"qualification"}>
            <Input placeholder="MBBS, MD" />
          </Form.Item>
          <Form.Item label={"Experience (years)"} name={"experienceYears"}>
            <InputNumber min={0} className="w-full!" />
          </Form.Item>
          <Form.Item label={"Consultation Fee"} name={"consultationFee"}>
            <InputNumber min={0} className="w-full!" />
          </Form.Item>

          <Form.Item label={"About"} name={"bio"} className="md:col-span-1">
            <Input.TextArea rows={4} placeholder="About" />
          </Form.Item>
          <Form.Item
            label={"Profile Image"}
            name={"image"}
            className="md:col-span-1"
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

        <SlotsList value={slots} onChange={setSlots} />

        <br />
        <Form.Item label="Status" name="status" valuePropName="checked">
          <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
        </Form.Item>
      </Form>
    </Drawer>
  );
}

export default FormModal;
