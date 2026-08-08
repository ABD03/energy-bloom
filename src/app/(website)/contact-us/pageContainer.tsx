"use client";

import { useCallback, useMemo, useState } from "react";
import { Button, Form, Input, message } from "antd";
import { IoReloadOutline } from "react-icons/io5";
import {
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
} from "react-icons/hi";
import { IoSendOutline } from "react-icons/io5";
import { UseAppSelector } from "@/redux/util/hooks";
import Breadcrumbs from "@/components/breadcrumb";

import { POST } from "@/utils/apiCalls";
import { API } from "@/config/apis";

export default function ContactContainer(props: any) {
  const Data = UseAppSelector((state: any) => state?.Data);
  const contact = Data?.settings?.settings?.contact || {};
  const appName = Data?.settings?.settings?.app?.name || "";
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [captchaKey, setCaptchaKey] = useState(0);

  const captcha = useMemo(() => {
    const a = Math.floor(Math.random() * 20) + 1;
    const b = Math.floor(Math.random() * 20) + 1;
    return { a, b, answer: a + b };
  }, [captchaKey]);

  const refreshCaptcha = useCallback(() => {
    setCaptchaKey((k) => k + 1);
    form.setFieldValue("captcha", undefined);
  }, [form]);

  const onFinish = async (values: any) => {
    setSubmitting(true);
    try {
      const res: any = await POST(API.POST_CONTACT, values);
      if (res?.status) {
        message.success(res?.message || "Message sent successfully");
        form.resetFields();
        refreshCaptcha();
      } else {
        message.error(res?.message || "Failed to send message");
      }
    } catch (err) {
      message.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pt-2 px-4 sm:px-0">
      <Breadcrumbs />
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8 sm:mb-12 pt-10">
          <h1 className="text-2xl sm:text-4xl font-bold leading-tight">
            We'd love to hear from you
          </h1>
          <p className="mt-3 text-[14px] sm:text-[15px] text-gray-600 max-w-2xl mx-auto">
            Questions, feedback, partnership ideas — drop us a message and our
            team will get back to you within 1–2 business days.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-20">
          <div className="lg:col-span-1 flex flex-col gap-8 mt-4">
            {contact?.email && (
              <div className="flex items-start gap-3">
                <HiOutlineMail size={20} />
                <div>
                  <div className="text-[13px] font-semibold">Email us</div>
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-[14px] text-gray-600 hover:text-primary"
                  >
                    {contact.email}
                  </a>
                </div>
              </div>
            )}

            {contact?.phone && (
              <div className="flex items-start gap-3">
                <HiOutlinePhone size={20} />
                <div>
                  <div className="text-[13px] font-semibold">Call us</div>
                  <a
                    href={`tel:${contact.phone.replace(/\s/g, "")}`}
                    className="text-[14px] text-gray-600 hover:text-primary"
                  >
                    {contact.phone}
                  </a>
                </div>
              </div>
            )}

            {contact?.address && (
              <div className="flex items-start gap-3">
                <HiOutlineLocationMarker size={20} />
                <div>
                  <div className="text-[13px] font-semibold">Visit us</div>
                  <div className="text-[14px] text-gray-600">
                    {contact.address}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-2 sm:pl-20 sm:pb-10">
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              size="large"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                <Form.Item
                  label="Name"
                  name="name"
                  rules={[
                    { required: true, message: "Please enter your name" },
                  ]}
                >
                  <Input placeholder="Your full name" />
                </Form.Item>
                <Form.Item
                  label="Phone"
                  name="phone"
                  rules={[
                    { required: true, message: "Please enter your phone" },
                    {
                      pattern: /^[0-9+\-\s()]{7,15}$/,
                      message: "Enter a valid phone number",
                    },
                  ]}
                >
                  <Input placeholder="Your phone number" />
                </Form.Item>
              </div>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Enter a valid email address" },
                ]}
              >
                <Input placeholder="you@example.com" />
              </Form.Item>

              <Form.Item
                label="Message"
                name="message"
                rules={[
                  { required: true, message: "Please enter your message" },
                  {
                    min: 10,
                    message: "Message should be at least 10 characters",
                  },
                ]}
              >
                <Input.TextArea
                  placeholder="How can we help you?"
                  autoSize={{ minRows: 5, maxRows: 10 }}
                />
              </Form.Item>

              <div className="flex items-start gap-3">
                <Form.Item
                  label={
                    <span>
                      What is <strong>{captcha.a} + {captcha.b}</strong> ?
                    </span>
                  }
                  name="captcha"
                  className="flex-1 mb-0!"
                  rules={[
                    { required: true, message: "Solve the captcha" },
                    {
                      validator(_, value) {
                        if (!value || Number(value) === captcha.answer) {
                          return Promise.resolve();
                        }
                        return Promise.reject("Incorrect answer");
                      },
                    },
                  ]}
                >
                  <Input
                    placeholder="Your answer"
                    type="number"
                    suffix={
                      <IoReloadOutline
                        size={16}
                        className="cursor-pointer text-gray-400 hover:text-primary"
                        onClick={refreshCaptcha}
                      />
                    }
                  />
                </Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={submitting}
                  size="large"
                  className="mt-10! p-5!"
                >
                  Send message <IoSendOutline />
                </Button>
              </div>

              <Form.Item className="mb-0! hidden!">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={submitting}
                  block
                  size="large"
                  className="mt-4! p-5!"
                >
                  Send message <IoSendOutline />
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>

      {contact?.email && (
        <div className="max-w-5xl mx-auto mt-12 pb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-slate-500/10 p-5">
              <div className="text-[15px] font-semibold mb-2">Advertise with us</div>
              <p className="text-[14px] text-gray-600 leading-relaxed">
                Reach thousands of readers by advertising on {appName}. To advertise with us write to{" "}
                <a href={`mailto:${contact.email}`} className="text-primary hover:underline">
                  {contact.email}
                </a>
              </p>
            </div>
            <div className="rounded-2xl border border-slate-500/10 p-5">
              <div className="text-[15px] font-semibold mb-2">Careers</div>
              <p className="text-[14px] text-gray-600 leading-relaxed">
                If you are keen on working for {appName}, and are passionate about the media industry, send in your CV to{" "}
                <a href={`mailto:${contact.email}`} className="text-primary hover:underline">
                  {contact.email}
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
