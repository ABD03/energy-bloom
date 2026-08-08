"use client";

import { useState } from "react";
import { Alert, Button, Form, Input, message } from "antd";
import { IoLockClosedOutline, IoCheckmark, IoClose } from "react-icons/io5";

import PageHeader from "../_components/pageHeader";

import { PUT } from "@/utils/apiCalls";
import { API } from "@/config/apis";

export default function ChangePassword({ Auth }: any) {
  const user = Auth?.user || {};
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const PASSWORD_RULES = [
    {
      id: "length",
      label: "At least 8 characters",
      test: (p: string) => p.length >= 8,
    },
    {
      id: "upper",
      label: "One uppercase letter (A-Z)",
      test: (p: string) => /[A-Z]/.test(p),
    },
    {
      id: "lower",
      label: "One lowercase letter (a-z)",
      test: (p: string) => /[a-z]/.test(p),
    },
    {
      id: "number",
      label: "One number (0-9)",
      test: (p: string) => /\d/.test(p),
    },
    {
      id: "special",
      label: "One special character (!@#$...)",
      test: (p: string) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p),
    },
    { id: "space", label: "No spaces", test: (p: string) => !/\s/.test(p) },
  ];

  const validCount = PASSWORD_RULES.filter((r) => r.test(password)).length;
  const isPasswordValid = validCount === PASSWORD_RULES.length;
  const touched = password.length > 0;

  const submit = async (values: any) => {
    setError("");
    if (!isPasswordValid) {
      setError("Please meet all password requirements.");
      return;
    }
    if (values.newPassword !== values.confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }
    try {
      setLoading(true);
      const response: any = await PUT(API.CHANGE_PASSWORD, {
        _id: user?._id,
        current: values.currentPassword,
        password: values.newPassword,
      });
      if (response?.status) {
        message.success(response?.message || "Password changed successfully");
        form.resetFields();
        setPassword("");
      } else {
        setError(response?.message || "Failed to change password.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-0 sm:mt-0">
      <div className="hidden sm:block sm:mb-4">
            <PageHeader title="Bookmarks" description="Your saved bookmarks" />
            </div>
      <Form form={form} layout="vertical" onFinish={submit}>
        <div className="grid grid-cols-1 md:grid-cols-2 sm:gap-14">
          <div>
            <Form.Item
              label="Current password"
              name="currentPassword"
              rules={[
                {
                  required: true,
                  message: "Please enter your current password",
                },
              ]}
            >
              <Input.Password
                size="large"
                placeholder="Enter current password"
                prefix={<IoLockClosedOutline className="text-gray-400" />}
              />
            </Form.Item>

            <Form.Item
              label="New password"
              name="newPassword"
              rules={[
                { required: true, message: "Please enter a new password" },
              ]}
            >
              <Input.Password
                size="large"
                placeholder="Create a strong password"
                onChange={(e) => setPassword(e.target.value)}
                prefix={<IoLockClosedOutline className="text-gray-400" />}
              />
            </Form.Item>

            <Form.Item
              label="Confirm new password"
              name="confirmPassword"
              dependencies={["newPassword"]}
              rules={[
                {
                  required: true,
                  message: "Please confirm your new password",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Passwords do not match"),
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                size="large"
                placeholder="Retype new password"
                prefix={<IoLockClosedOutline className="text-gray-400" />}
              />
            </Form.Item>

            {error && (
              <Alert
                type="error"
                showIcon
                message={error}
                className="mb-4! text-[13px]!"
              />
            )}
          </div>

          <div>
            <div className="text-[14px] font-semibold mb-1">
              Password requirements
            </div>
            <div className="text-[12px] text-gray-500 mb-2">
              Your new password must meet all the rules below.
            </div>
            <div className="flex flex-col gap-2.5">
              {PASSWORD_RULES.map((rule) => {
                const valid = rule.test(password);
                const state = !touched ? "idle" : valid ? "valid" : "invalid";
                return (
                  <div
                    key={rule.id}
                    className={`flex items-center gap-2 text-[13px] ${
                      state === "valid"
                        ? "text-green-600"
                        : state === "invalid"
                          ? "text-red-500"
                          : "text-gray-800"
                    }`}
                  >
                    <span
                      className={`flex items-center justify-center w-4 h-4 rounded-full shrink-0 border ${
                        state === "valid"
                          ? "bg-green-600 border-green-600 text-white"
                          : state === "invalid"
                            ? "bg-red-500 border-red-500 text-white"
                            : "border-gray-300 text-transparent"
                      }`}
                    >
                      {state === "invalid" ? (
                        <IoClose size={11} />
                      ) : (
                        <IoCheckmark size={11} />
                      )}
                    </span>
                    {rule.label}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 pt-4 sm:pt-3!">
          <div>
            <Button
              size="large"
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              className="p-5.5! mt-2!"
            >
              Update password
            </Button>
          </div>
          <div />
        </div>
      </Form>
    </div>
  );
}
