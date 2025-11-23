"use client";
import Image from "next/image";
import { Button, Form, Input } from "antd";
import { ImageLoader } from "@/util/imageLoader";

export default function LoginContainer() {
  return (
    <div className="w-full h-[75vh] md:h-screen flex border-b border-b-gray-100">
      <div className="hidden sm:block w-1/2 h-[75vh] md:h-screen bg-[url('/bg2.webp')] bg-cover bg-center"></div>
      <div className="w-full sm:w-1/2 h-[90vh] flex items-center justify-center">
        <div className="max-w-sm w-full p-3">
          <Image
            alt="logo"
            width={0}
            height={0}
            src={"/logo.png"}
            loader={ImageLoader}
            priority={true}
            className="w-20 h-20 object-cover mb-2"
          />
          <div className="text-2xl font-bold font-sans">Sign In Now</div>
          <div className="mb-10 text-gray-500 text-base font-sans">
            Welcome to Energy Bloom
          </div>
          <Form>
            <Form.Item>
              <Input placeholder="Enter email" />
            </Form.Item>
            <Form.Item>
              <Input placeholder="Enter password" />
            </Form.Item>
            <Button type="primary" size="large" block>
              Sign In
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}
