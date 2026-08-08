"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { dayjs, FormatPermalink } from "@/utils/common";
import { Button, Card, Form, Input, Switch, Tag, message } from "antd";
import { IoCopyOutline, IoSaveOutline } from "react-icons/io5";
import { GoDatabase } from "react-icons/go";

import PageHeader from "../../_components/pageHeader";
import Loading from "../../_components/loading";
import FilePicker from "../../_components/filePicker";
import EditorPicker from "../../users/_components/editorPicker";
import TextEditor from "../../_components/textEditor";
import SocialPreview from "../../_components/socialPreview";

import { UseAppSelector } from "@/redux/util/hooks";

import { API } from "@/config/apis";
import { GET, POST, PUT } from "@/utils/apiCalls";

export default function StaticPageForm() {
  const [form] = Form.useForm();
  const navigation = useRouter();
  const searchParams = useSearchParams();
  const Auth = UseAppSelector((state: any) => state?.Auth);

  const page_id = searchParams.get("id") || "0";

  const [loading, setLoading] = useState(page_id === "0" ? false : true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);

  const [permalink, setPermalink] = useState("");
  const [data, setData] = useState<any>({});

  useEffect(() => {
    if (typeof window !== "undefined" && page_id !== "0") {
      getData();
    }
  }, [searchParams]);

  const getData = async () => {
    try {
      const URL = `${API.PAGES_DETAILS}?id=${page_id}`;
      const response: any = await GET(URL, null);
      if (response?.status) {
        form.setFieldsValue(response?.data);
        setData(response?.data);
        setPermalink(response?.data?.permalink);
      } else {
        message.error("oops.something gone wrong.");
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const submit = async (value: any) => {
    try {
      setSaving(true);
      const params = new URLSearchParams(window.location.search);
      const id = params.get("id") || "0";
      const new_permalink = FormatPermalink(value?.permalink);
      const obj = {
        createdBy: Auth?.user?._id,
        _id: id,
        name: value?.name,
        sections: value?.sections,
        permalink: new_permalink,
        meta_description: value?.meta_description,
        meta_image: value?.meta_image,
        author: Auth?.user?.name,
        editor: value?.editor?.value || value?.editor,
        status: value?.status !== undefined ? value.status : true,
      };
      const METHOD = id === "0" ? POST : PUT;
      const response: any = await METHOD(API.PAGES, obj);
      if (response?.status) {
        message.success(
          `Page ${id === "0" ? "created" : "updated"} successfully`,
        );
        if (id !== "0") {
          refreshPage(new_permalink);
          if (permalink && permalink !== new_permalink) refreshPage(permalink);
        }
        const p = new URLSearchParams();
        p.set("id", response?.data?._id);
        p.set("updated", dayjs().format("hh:mm:ss:SS a"));
        navigation.replace(`?${p.toString()}`);
      } else {
        message.error(response?.message);
      }
    } catch (err) {
      console.log("err", err);
      message.error("oops.something gone wrong.");
    } finally {
      setSaving(false);
    }
  };

  const copyPermalink = () => {
    const name = form.getFieldValue("name");
    form.setFieldValue("permalink", FormatPermalink(name));
    if (!form.getFieldValue("meta_description")) {
      form.setFieldValue("meta_description", name);
    }
  };

  const refreshPage = async (link: any) => {
    try {
      setResetting(true);
      await GET(API.REVALIDATE + `?url=/page/${link}`, null);
    } catch (err) {
      console.log("err", err);
    } finally {
      setTimeout(() => setResetting(false), 200);
    }
  };

  return (
    <div>
      <PageHeader
        title={`${page_id === "0" ? "Create" : "Update"} Page`}
        icon={"RiPagesLine"}
        showBack={true}
        showMenu={false}
        showMobileBack={true}
        showMobileMenu={false}
      >
        <Tag color={data?.status ? "green" : "red"}>
          {data?.status === false ? "Inactive" : data?._id ? "Active" : "New"}
        </Tag>
        <Button
          type="primary"
          icon={<IoSaveOutline />}
          loading={saving}
          onClick={() => form.submit()}
        >
          {page_id === "0" ? "Create" : "Save"}
        </Button>
      </PageHeader>

      <div className="h-[92vh] overflow-y-auto overflow-x-hidden">
        {loading ? (
          <Loading />
        ) : (
          <Form
            layout="vertical"
            form={form}
            onFinish={submit}
            initialValues={{
              status: true,
              editor: data?.editor,
            }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 border-t border-primary/10 pb-[8vh]">
              {/* LEFT */}
              <div className="col-span-2">
                <div className=" sm:pb-10 p-4 pt-2">
                  <Form.Item
                    label="Page name"
                    name="name"
                    rules={[{ required: true, message: "Required" }]}
                  >
                    <Input
                      placeholder="e.g. About Us, Privacy Policy"
                      size="large"
                    />
                  </Form.Item>
                </div>

                <Form.Item
                  label="Sections (page content)"
                  name="sections"
                  rules={[{ required: true, message: "Required" }]}
                >
                  <TextEditor
                    value={form.getFieldValue("sections") || ""}
                    onChange={(value: any) =>
                      form.setFieldValue("sections", value)
                    }
                  />
                </Form.Item>
              </div>

              {/* RIGHT */}
              <div className="sm:border-l border-primary/10 sm:min-h-screen h-full p-4 pb-12 sm:pb-0 pt-2!">
                <Form.Item
                  label="Permalink ( Slug )"
                  name="permalink"
                  rules={[{ required: true, message: "Required" }]}
                >
                  <Input
                    suffix={
                      <Button
                        type="text"
                        onClick={() => copyPermalink()}
                        size="small"
                        className="p-1!"
                      >
                        <IoCopyOutline size={18} />
                      </Button>
                    }
                  />
                </Form.Item>

                <Form.Item label="Meta Description" name="meta_description">
                  <Input.TextArea maxLength={160} showCount rows={3} />
                </Form.Item>

                <Form.Item
                  label="Meta Image ( 1200 x 650 )"
                  name="meta_image"
                  rules={[{ required: true, message: "Required" }]}
                >
                  <FilePicker
                    url={form.getFieldValue("meta_image")}
                    onchange={(v: any) =>
                      form.setFieldValue("meta_image", v?.name)
                    }
                  />
                </Form.Item>

                <Form.Item label="Editor" name="editor">
                  <EditorPicker
                    value={form.getFieldValue("editor")}
                    onChange={(v: any) =>
                      form.setFieldValue("editor", v?.value)
                    }
                  />
                </Form.Item>

                <Form.Item label="Status" name="status" valuePropName="checked">
                  <Switch
                    checkedChildren="Active"
                    unCheckedChildren="Inactive"
                  />
                </Form.Item>

                <SocialPreview
                  route="page"
                  permalink={form.getFieldValue("permalink")}
                  title={form.getFieldValue("name")}
                  meta_title={form.getFieldValue("name")}
                  meta_description={
                    form.getFieldValue("meta_description") ||
                    form.getFieldValue("name")
                  }
                  meta_image={form.getFieldValue("meta_image")}
                />
                <div className="mb-4" />

                {data?.permalink ? (
                  <Card
                    size="small"
                    title="Reset Cache"
                    extra={<GoDatabase size={20} />}
                  >
                    <div style={{ marginBottom: 10, fontSize: 12 }}>
                      Reset the page cache — after resetting, reload and refresh
                      the page.
                    </div>
                    <Button
                      danger
                      size="small"
                      loading={resetting}
                      onClick={() => refreshPage(permalink)}
                    >
                      Reset page now
                    </Button>
                  </Card>
                ) : null}
              </div>
            </div>
          </Form>
        )}
      </div>
    </div>
  );
}
