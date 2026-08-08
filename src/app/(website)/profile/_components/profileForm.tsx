"use client";

import { useState } from "react";
import { Button, Form, Input, message, Modal } from "antd";
import { MdOutlineEmail, MdOutlinePhone } from "react-icons/md";
import { HiUser } from "react-icons/hi2";

import { useAppDispatch } from "@/redux/util/hooks";
import { update as updateUser } from "@/redux/slice/userSlice";
import { PUT } from "@/utils/apiCalls";
import { API } from "@/config/apis";

interface ProfileFormProps {
  open: boolean;
  user: any;
  onClose: () => void;
}

export default function ProfileForm({ open, user, onClose }: ProfileFormProps) {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const handleOpen = () => {
    form.setFieldsValue({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    });
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      const response: any = await PUT(API.UPDATE_PROFILE, {
        _id: user?._id,
        ...values,
      });
      if (response?.status) {
        dispatch(updateUser(response.data));
        message.success("Profile updated successfully");
        onClose();
      } else {
        message.error(response?.message || "Failed to update profile");
      }
    } catch {
      message.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      open={open}
      title="Edit Profile"
      centered
      width={400}
      onCancel={handleCancel}
      afterOpenChange={(visible) => visible && handleOpen()}
      footer={[
        <Button key="cancel" size="large" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          key="save"
          size="large"
          type="primary"
          loading={loading}
          onClick={handleSave}
        >
          Save
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" className="pb-2!">
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please enter your name" }]}
        >
          <Input
            size="large"
            prefix={<HiUser size={16} className="text-gray-400" />}
          />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please enter your email" },
            { type: "email", message: "Please enter a valid email" },
          ]}
        >
          <Input
            size="large"
            prefix={<MdOutlineEmail size={16} className="text-gray-400" />}
          />
        </Form.Item>
        <Form.Item name="phone" label="Phone">
          <Input
            size="large"
            prefix={<MdOutlinePhone size={16} className="text-gray-400" />}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
