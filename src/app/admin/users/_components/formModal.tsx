"use client";
import React, { useState } from "react";
import { Button, Drawer, Form, Input, message, Switch } from "antd";
import { FaRegSave } from "react-icons/fa";

import Access from "./access";
import FilePicker from "../../_components/filePicker";

import { API } from "@/config/apis";
import { POST, PUT } from "@/utils/apiCalls";

function FormModal(props: any) {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [image_url, setImage_url] = useState(props?.data?.image);

  const [access, setAccess] = useState<any>(
    props?.data?.access?.length ? props?.data?.access : [1],
  );

  const submit = async (value: any) => {
    try {
      setIsLoading(true);
      let obj = {
        createdBy: props?.user?._id,
        _id: props?.data?._id,
        username: value?.username,
        password: value?.password,
        name: value?.name,
        email: value?.email,
        phone: value?.phone,
        image: image_url,
        role: value?.role,
        status: value?.status,
        bio: value?.bio,
        type: "editor",
        access: access,
      };
      let METHOD = props?.data?._id ? PUT : POST;
      let response: any = await METHOD(API.USERS, obj);
      if (response?.status) {
        message.success(
          `User ${props?.data?._id ? "updated" : "created"} successfully`,
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

  const addAccess = (value: any) => {
    try {
      let arr: any = [...access];
      let check = arr.findIndex((item: any) => item === value?.id);
      if (check >= 0) {
        arr.splice(check, 1);
        setAccess(arr);
      } else {
        arr = Array.from(new Set([...arr, value?.id]));
        setAccess(arr);
      }
      setTimeout(() => {}, 10);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Drawer
      title={`${props?.data?._id ? "Edit" : "Create new"} user`}
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
            <FaRegSave /> Save
          </Button>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={submit}
        style={{ marginTop: 20, marginBottom: -30 }}
        initialValues={{
          name: props?.data?.name,
          username: props?.data?.username,
          email: props?.data?.email,
          phone: props?.data?.phone,
          role: props?.data?.role,
          image: props?.data?.image,
          bio: props?.data?.bio,
          status: props?.data?.status ? props?.data?.status : null,
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 mb-2">
          <Form.Item
            label={"Username"}
            name={"username"}
            rules={[{ required: true, message: "Required" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={"Full Name"}
            name={"name"}
            rules={[{ required: true, message: "Required" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={"Email"}
            name={"email"}
            rules={[
              { required: true, message: "Required" },
              { type: "email", message: "Enter a valid email" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={"Phone"}
            name={"phone"}
            rules={[{ required: true, message: "Required" }]}
          >
            <Input type={"number"} />
          </Form.Item>
          <Form.Item label={"Role"} name={"role"}>
            <Input />
          </Form.Item>
          <Form.Item
            label={"Password"}
            name={"password"}
            rules={[
              {
                required: props?.data?._id ? false : true,
                message: "Required",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item label={"About"} name={"bio"}>
            <Input.TextArea rows={4} placeholder="About" />
          </Form.Item>
          <Form.Item
            label={"Profile Image"}
            name={"image"}
            rules={[{ required: true, message: "Required" }]}
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
        <Access
          value={access}
          select={(value: any) => setAccess(value)}
          selectAll={(value: any) => setAccess(value)}
        />

        <br />
        <Form.Item label="Status" name="status" valuePropName="checked">
          <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
        </Form.Item>
      </Form>
    </Drawer>
  );
}

export default FormModal;
