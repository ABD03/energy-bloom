"use client";
import { useState } from "react";
import Link from "next/link";
import { Button, Form, Input, message } from "antd";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { HiOutlineMail } from "react-icons/hi";
import { FiLock, FiCheckCircle } from "react-icons/fi";

import Breadcrumbs from "@/components/breadcrumb";
import { API } from "@/config/apis";
import { POST, PUT } from "@/utils/apiCalls";

export default function PageContainer() {
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const verifyEmail = async (values: any) => {
    try {
      setLoading(true);
      setError("");
      const res: any = await POST(API.FORGOT_PASSWORD, {
        email: values.email,
      });
      if (res?.status) {
        setEmail(values.email);
        setStep(1);
      } else {
        setError(res?.message || "Email not found");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (values: any) => {
    try {
      setLoading(true);
      setError("");
      const res: any = await PUT(API.FORGOT_PASSWORD, {
        email,
        password: values.password,
      });
      if (res?.status) {
        setStep(2);
        message.success("Password reset successfully");
      } else {
        setError(res?.message || "Failed to reset password");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center relative overflow-hidden bg-primary/3 min-h-[80vh]">
      <div className="absolute top-4 left-4 z-20">
        <Breadcrumbs />
      </div>

      <svg
        className="absolute top-12 left-16 text-primary/10 hidden md:block"
        width="120"
        height="60"
        viewBox="0 0 120 60"
        fill="none"
      >
        <path
          d="M2 40 C20 10, 40 50, 60 30 S100 10, 118 30"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      <svg
        className="absolute top-48 right-20 text-primary/10 hidden md:block"
        width="100"
        height="50"
        viewBox="0 0 100 50"
        fill="none"
      >
        <path
          d="M2 25 C15 5, 35 45, 50 25 S85 5, 98 25"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>

      <div className="absolute top-24 right-48 w-3 h-3 rounded-full bg-primary/15 hidden md:block" />
      <div className="absolute bottom-40 left-32 w-2 h-2 rounded-full bg-primary/20 hidden md:block" />
      <div className="absolute top-1/3 left-24 w-4 h-4 rounded-full border-2 border-primary/15 hidden md:block" />

      <div className="relative z-10 w-full sm:max-w-105! mx-4 sm:bg-(--background) rounded-4xl sm:shadow-lg p-2 sm:p-8">
        {step === 0 && (
          <Form onFinish={verifyEmail} layout="vertical">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <HiOutlineMail className="text-primary" size={28} />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold">
                Forgot password?
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                Enter your email address to reset your password
              </p>
            </div>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Email required" },
                { type: "email", message: "Enter a valid email" },
              ]}
            >
              <Input size="large" placeholder="Enter your email" />
            </Form.Item>

            {error ? (
              <div className="text-center text-red-500 text-sm mb-4">
                {error}
              </div>
            ) : null}

            <Form.Item noStyle>
              <Button
                block
                size="large"
                type="primary"
                htmlType="submit"
                loading={loading}
                className="p-5.5! font-semibold! mt-4!"
              >
                Verify email
              </Button>
            </Form.Item>
            <div className="mt-8 font-medium text-center">
              <Link href="/login" className="text-primary underline">
                Back to Sign in
              </Link>
            </div>
          </Form>
        )}

        {step === 1 && (
          <Form onFinish={resetPassword} layout="vertical">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <FiLock className="text-primary" size={28} />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold">
                Set new password
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                Create a new password for <strong>{email}</strong>
              </p>
            </div>
            <Form.Item
              name="password"
              label="New password"
              rules={[
                { required: true, message: "Password required" },
                { min: 6, message: "Minimum 6 characters" },
              ]}
            >
              <Input.Password
                size="large"
                placeholder="Enter new password"
                iconRender={(visible) =>
                  visible ? <FiEye size={18} /> : <FiEyeOff size={18} />
                }
              />
            </Form.Item>
            <Form.Item
              name="confirm"
              label="Confirm password"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Confirm your password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject("Passwords do not match");
                  },
                }),
              ]}
            >
              <Input.Password
                size="large"
                placeholder="Confirm new password"
                iconRender={(visible) =>
                  visible ? <FiEye size={18} /> : <FiEyeOff size={18} />
                }
              />
            </Form.Item>

            {error ? (
              <div className="text-center text-red-500 text-sm mb-4">
                {error}
              </div>
            ) : null}

            <Form.Item noStyle>
              <Button
                block
                size="large"
                type="primary"
                htmlType="submit"
                loading={loading}
                className="p-5.5! font-semibold! mt-4!"
              >
                Reset password
              </Button>
            </Form.Item>
            <div className="mt-6 text-center">
              <Button
                type="link"
                onClick={() => {
                  setStep(0);
                  setError("");
                }}
              >
                Use a different email
              </Button>
            </div>
          </Form>
        )}

        {step === 2 && (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <FiCheckCircle className="text-green-600" size={28} />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold mb-2">
              Password reset!
            </h1>
            <p className="text-sm text-gray-500 mb-8">
              Your password has been reset successfully. You can now sign in
              with your new password.
            </p>
            <Link href="/login">
              <Button
                type="primary"
                size="large"
                block
                className="p-5.5! font-semibold!"
              >
                Sign in
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
