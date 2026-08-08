"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Form, Input, message } from "antd";
import { FiEye, FiEyeOff } from "react-icons/fi";

import { useAppDispatch } from "@/redux/util/hooks";
import { login } from "@/redux/slice/userSlice";
import { API } from "@/config/apis";
import { POST } from "@/utils/apiCalls";

interface LoginFormProps {
  onSuccess?: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const navigation = useRouter();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (values: any) => {
    try {
      setIsLoading(true);
      setError("");
      var response: any = await POST(API.LOGIN, values);
      if (response?.status) {
        message.success("Login successfully");
        if (response?.data?.token) {
          document.cookie = `token=${response?.data?.token}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
        }
        dispatch(login(response?.data));
        onSuccess?.();
        if (response?.data?.type === "editor") {
          navigation.replace("/admin/overview");
        } else {
          navigation.replace("/profile");
        }
      } else {
        setError(response?.message);
      }
      setIsLoading(false);
    } catch (err) {
      console.log("err", err);
      setIsLoading(false);
      setError("Login failed. Please try again");
    }
  };

  return (
    <Form onFinish={submit} layout="vertical">
      <div className="text-center mb-8">
        <h1 className="text-xl sm:text-2xl font-bold">Login to your account</h1>
        <p className="mt-2 text-sm">
          Hey, Enter your details to sign in to your account
        </p>
      </div>
      <Form.Item
        name="email"
        rules={[{ required: true, message: "Email required" }]}
      >
        <Input size="large" placeholder="Enter Email" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: "Password required" }]}
      >
        <Input.Password
          size="large"
          placeholder="Passcode"
          iconRender={(visible) =>
            visible ? <FiEye size={18} /> : <FiEyeOff size={18} />
          }
        />
      </Form.Item>

      <div className="flex justify-end mb-4">
        <Link
          href="/forgot-password"
          className="text-sm mt-2 mb-1 text-gray-500 font-medium  hover:text-primary"
        >
          Having trouble in sign in?
        </Link>
      </div>

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
          className="p-5.5! font-semibold!"
        >
          Sign in
        </Button>
      </Form.Item>
      <div className="mt-8 font-medium text-center under">
        Don't have an account?{" "}
        <Link href="/register" className="text-primary underline">
          Sign up
        </Link>
      </div>
    </Form>
  );
}
