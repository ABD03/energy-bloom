"use client";
import React, { useState } from "react";
import { Button, Form, Input, message, Modal, Switch } from "antd";
import { MdOutlineErrorOutline ,MdFileUpload} from "react-icons/md";

import Upload from "./upload";

import { POST, PUT, UPLOAD_FILE } from "@/utils/apiCalls";
import { UseAppSelector } from "@/redux/util/hooks";
import { API } from "@/config/apis";

function PickerModal(props: any) {
  const [form] = Form.useForm();
  const Auth = UseAppSelector((state: any) => state?.Auth);
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState<any>("");

  const [image_url, setImageUrl] = useState<any>();
  const [file, setFile] = useState<any>();

  const [image_url2, setImageUrl2] = useState<any>();
  const [file2, setFile2] = useState<any>();
  const [compress, setCompress] = useState(true);

  const selectOriginal = (value: any) => {
    const fileName = compress
      ? value?.file?.name.replace(/\.[^/.]+$/, ".webp")
      : value?.file?.name;
    form.setFieldsValue({
      name: fileName,
      type: value?.file?.type,
      size: Number(value?.file?.size / (1024 * 1024)).toFixed(2),
    });
    setImageUrl(value?.url);
    setFile(value?.file);

    setImageUrl2(value?.url);
    setFile2(value?.file);
  };

  const finish = async (value: any) => {
    try {
      setError("");
      if (image_url2?.length > 0) {
        setIsLoading(true);
        const image: any = await UPLOAD_FILE(file2, compress);
        const ext = compress
          ? ".webp"
          : value?.name?.match(/\.[^/.]+$/)?.[0] || "";
        let obj = {
          createdBy: Auth?.user?._id,
          _id: props?.data?._id,
          caption: value?.caption,
          description: value?.description,
          name: value?.name.replace(/\.[^/.]+$/, ext),
          type: value?.type,
          size: value?.size,
          url: image?.name,
          // url: image?.data?.url,
        };
        const METHOD = props?.data?._id ? PUT : POST;
        const response: any = await METHOD(API.MEDIA, obj);
        if (response?.status) {
          message.success(
            `Image ${props?.data?._id ? "updated" : "uploaded"} successfully`,
          );
          props?.onchange(response?.data);
          props?.onCancel();
        } else {
          setError(response?.message);
          message.error(response?.message);
        }
        setIsLoading(false);
      } else {
        setError("Please select an image");
        message.error("Please select an image");
      }
    } catch (err) {
      setError("Oops.something gone wrong.");
      message.error("oops.something gone wrong.");
      console.log("err", err);
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title={"Upload files"}
      onCancel={props?.onCancel}
      open={props.visible}
      footer={false}
      width={800}
      zIndex={2000}
      centered
    >
      <Form
        layout="vertical"
        onFinish={finish}
        form={form}
        initialValues={{
          caption: "",
          description: "",
        }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
          <div>
            <Form.Item
              label="Choose file"
              name={"image"}
              rules={[{ required: true, message: "Please select an image" }]}
            >
              <Upload
                file={file}
                fileURL={image_url2}
                onChange={(value: any) => {
                  selectOriginal(value);
                  form.setFieldsValue({ image: value?.file?.name });
                }}
              />
            </Form.Item>
            {error ? (
              <div className="text-red-500 text-[12px] flex gap-2 items-center flex-1">
                <MdOutlineErrorOutline />
                {error}
              </div>
            ) : (
              <div className="text-[12px]">
                Max file size is 2MB. Only image files (JPEG, PNG) are allowed.
              </div>
            )}
          </div>
          <div>
            <Form.Item label="Caption" name={"caption"}>
              <Input />
            </Form.Item>
            <Form.Item label="Description" name={"description"}>
              <Input.TextArea />
            </Form.Item>
            <Form.Item label="File name" name={"name"}>
              <Input />
            </Form.Item>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <Form.Item label="File type" name={"type"}>
                <Input disabled />
              </Form.Item>
              <Form.Item label="File size ( MB )" name={"size"}>
                <Input disabled />
              </Form.Item>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-3 sm:mt-4">
          <div className="col-span-2 flex items-center">
            <div className="flex items-center gap-2 mt-2 my-3! sm:my-0!">
              <Switch checked={compress} onChange={setCompress} />
              <span className="text-xs text-gray-500">
                Compress (convert to WebP)
              </span>
            </div>
          </div>
          <Button size="large" block onClick={() => props.onCancel()} danger>
            Close
          </Button>
          <Button
            size="large"
            htmlType="submit"
            block
            type="primary"
            loading={isLoading}
          >
            <MdFileUpload/> Upload
          </Button>
        </div>
      </Form>
    </Modal>
  );
}

export default PickerModal;
