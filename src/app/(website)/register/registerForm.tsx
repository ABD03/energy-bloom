"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Form, Input, message } from "antd";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff } from "react-icons/fi";

import { API } from "@/config/apis";
import { POST } from "@/utils/apiCalls";

export default function RegisterForm() {
  const navigation = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (values: any) => {
    try {
      setIsLoading(true);
      setError("");
      const username =
        values.email.split("@")[0] + Math.floor(Math.random() * 1000);
      var response: any = await POST(API.REGISTER, { ...values, username });
      if (response?.status) {
        message.success("Registered successfully");
        navigation.replace("/login");
      } else {
        setError(response?.message);
      }
      setIsLoading(false);
    } catch (err) {
      console.log("err", err);
      setIsLoading(false);
      setError("Registration failed. Please try again");
    }
  };

  return (
    <>
      <div className="text-center mb-2">
        <h1 className="text-xl sm:text-2xl font-bold">Create your account</h1>
        <p className="mt-2 text-sm text-gray-500">
          Enter the fields below to get started
        </p>
      </div>

      <Form onFinish={submit} layout="vertical">
        <Form.Item
          name="name"
          label="Full name"
          rules={[{ required: true, message: "Name required" }]}
        >
          <Input size="large" placeholder="Enter name" />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email address"
          rules={[
            { required: true, message: "Email required" },
            { type: "email", message: "Enter a valid email" },
          ]}
        >
          <Input size="large" placeholder="Enter email" />
        </Form.Item>
        <Form.Item
          name="phone"
          label="Phone number"
          rules={[{ required: true, message: "Phone required" }]}
        >
          <Input size="large" placeholder="Enter phone number" />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[
            { required: true, message: "Password required" },
            { min: 6, message: "Minimum 6 characters" },
          ]}
        >
          <Input.Password
            size="large"
            placeholder="Create a password"
            iconRender={(visible) =>
              visible ? <FiEye size={18} /> : <FiEyeOff size={18} />
            }
          />
        </Form.Item>

        {error ? (
          <div className="text-center text-red-500 text-sm mb-4">{error}</div>
        ) : null}

        <Form.Item noStyle>
          <Button
            block
            size="large"
            type="primary"
            htmlType="submit"
            loading={isLoading}
            className="p-[22px]! font-semibold! mt-4"
          >
            Create account
          </Button>
        </Form.Item>
        <div className="mt-6 font-medium text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-primary underline">
            Sign in
          </Link>
        </div>
      </Form>
    </>
  );
}
