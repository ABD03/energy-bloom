"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { debounce } from "lodash";
import { Button, Card, Form, Input, message, Radio, Select, Tag } from "antd";
import { IoCopyOutline } from "react-icons/io5";
import { GoDatabase } from "react-icons/go";

import PageHeader from "../../_components/pageHeader";
import Loading from "../../_components/loading";
import FormFooter from "../_components/formFooter";
import Tags from "../_components/tags";
import FilePicker from "../../_components/filePicker";
import CategoryPicker from "../../masterdata/categories/categoryPicker";
import TagPicker from "../../masterdata/tags/tagsPicker";
import EditorPicker from "../../users/_components/editorPicker";
import TextEditor from "../../_components/textEditor";
import SocialPreview from "../../_components/socialPreview";

import { UseAppSelector } from "@/redux/util/hooks";
import { dayjs, getReadingTimeString } from "@/utils/common";
import { FormatPermalink } from "@/utils/common";
import Languages from "@/config/applanguages.json";

import { API } from "@/config/apis";
import { GET, POST, PUT } from "@/utils/apiCalls";
import { AiOutlineClockCircle } from "react-icons/ai";

export default function Forms() {
  const [form] = Form.useForm();
  const navigation = useRouter();
  const searchParams = useSearchParams();
  const Auth = UseAppSelector((state: any) => state?.Auth);

  var content_id = searchParams.get("id") || "0";

  const [loading, setLoading] = useState(content_id === "0" ? false : true);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const [loading4, setLoading4] = useState(false);
  const [loading5, setLoading5] = useState(false);
  const [loading6, setLoading6] = useState(false);
  const [loading7, setLoading7] = useState(false);

  const [permalink, setPermalink] = useState("");

  const [is_video, setisVideo] = useState(false);
  const [is_live, setisLive] = useState(false);
  const [is_premium, setisPremium] = useState(false);

  const [openNotifi, setOpenNotifi] = useState<any>(false);
  const [openSeo, setOpenSeo] = useState<any>(false);

  const [data, setData] = useState<any>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (content_id !== "0") {
        const Savetype = searchParams.get("type") || "";
        if (Savetype === "draft") {
          setLoading7(true);
          setTimeout(() => {
            setLoading7(false);
          }, 100);
        }
        getData();
      }
    }
  }, [searchParams]);

  const getData = async () => {
    try {
      let URL = `${API.CONTENT_DETAILS}?id=${content_id}`;
      let response: any = await GET(URL, null);
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
      const params = new URLSearchParams(window.location.search);
      const content_id = params.get("id") || "0";
      if (value?.status === "draft") {
        setLoading2(true);
      } else {
        setLoading3(true);
      }
      let new_permalink = FormatPermalink(value?.permalink);
      let obj = {
        createdBy: Auth?.user?._id,
        _id: content_id,
        title: value?.title,
        description: value?.description,
        category: value?.category,
        tags: value?.tags,
        priority: value?.priority,
        position: value?.position,
        image: value?.image,
        content: value?.content,
        permalink: new_permalink,
        meta_title: value?.meta_title,
        meta_description: value?.meta_description,
        meta_image: value?.meta_image,
        reading_time: value?.reading_time,
        status: value?.status,
        editor: value?.editor,
        language: value?.language,
        author: Auth?.user?.name,
        //extra features
        is_premium: value?.is_premium,
        is_video: value?.is_video,
        video: value?.video,
        is_live: value?.is_live,
        live: value?.live,
      };
      let METHOD = content_id === "0" ? POST : PUT;
      let response: any = await METHOD(API.CONTENT, obj);
      if (response?.status) {
        message.success(
          `Content ${content_id === "0" ? "created" : "updated"} successfully`,
        );
        if (content_id !== "0") {
          refreshPage(new_permalink);
          let refresh = permalink === new_permalink;
          if (!refresh) {
            refreshPage(permalink);
          }
        }
        const params = new URLSearchParams();
        params.set("id", response?.data?._id);
        params.set("updated", dayjs().format("hh:mm:ss:SS a"));
        navigation.replace(`?${params.toString()}`);
      } else {
        message.error(response?.message);
      }
    } catch (err) {
      console.log("err", err);
      message.error("oops.something gone wrong.");
    } finally {
      setLoading2(false);
      setLoading3(false);
      setLoading5(false);
    }
  };

  const handleEditorChange = (content: string) => {
    const plainText = content.replace(/<[^>]+>/g, "");
    let time = getReadingTimeString(plainText);
    form.setFieldValue("reading_time", time);
  };

  const copyPermalink = () => {
    form.setFieldValue(
      "permalink",
      FormatPermalink(form.getFieldValue("title")),
    );
    form.setFieldValue("meta_title", form.getFieldValue("title"));
    form.setFieldValue("meta_description", form.getFieldValue("title"));
  };

  const refreshPage = async (link: any) => {
    try {
      setLoading6(true);
      let url = `/${link}`;
      let response: any = await GET(API.REVALIDATE + `?url=${url}`, null);
      setTimeout(() => {
        setLoading6(false);
      }, 100);
    } catch (err) {
      console.log("err", err);
      message.error("oops.something gone wrong.");
    } finally {
      setLoading6(false);
    }
  };

  const draftContent = useCallback(
    debounce(async (value: any, allvalues: any) => {
      try {
        if (!allvalues?.status || allvalues?.status === "draft") {
          if (allvalues?.permalink) {
            const params = new URLSearchParams(window.location.search);
            const content_id = params.get("id") || "0";
            let new_permalink = FormatPermalink(allvalues?.permalink);
            let obj = {
              ...allvalues,
              createdBy: Auth?.user?._id,
              author: Auth?.user?.name,
              _id: content_id,
              editor: allvalues?.editor?.value || allvalues?.editor,
              permalink: new_permalink,
              status: "draft",
            };
            let METHOD = content_id === "0" ? POST : PUT;
            let response: any = await METHOD(API.CONTENT, obj);
            if (response?.status) {
              message.info(
                content_id !== "0"
                  ? "Content updated"
                  : "Content saved as draft",
              );
              if (content_id !== "0") {
                refreshPage(new_permalink);
                let refresh = permalink === new_permalink;
                if (!refresh) {
                  refreshPage(permalink);
                }
              }
              const params = new URLSearchParams();
              params.set("id", response?.data?._id);
              params.set("updated", dayjs().format("hh:mm:ss:SS a"));
              params.set("type", "draft");
              navigation.replace(`?${params.toString()}`);
            } else {
              message.error(response?.message);
            }
          }
        }
      } catch (err) {
        console.log("err", err);
        message.error("oops.something gone wrong.");
      }
    }, 7000),
    [permalink],
  );

  return (
    <div>
      <PageHeader
        title={`${content_id === "0" ? "Create" : "Update"} Content`}
        icon={"FiEdit"}
        showBack={true}
        showMenu={false}
        showMobileBack={true}
        showMobileMenu={false}
      >
        <Tag color={"gold"}>{data?.views || 0} Visits</Tag>
        <Tags status={data?.status} />
      </PageHeader>
      <div className="h-[92vh] overflow-y-auto overflow-x-hidden">
        {loading ? (
          <Loading />
        ) : (
          <div>
            <Form
              layout="vertical"
              form={form}
              onFinish={submit}
              onValuesChange={(value: any, allvalues: any) =>
                draftContent(value, allvalues)
              }
              initialValues={{
                editor: data?.editor,
                priority: data?.priority ? data?.priority : "0",
                position: data?.position ? data?.position : 0,
                language: data?.language?.code
                  ? data.language
                  : { code: "ml", label: "Malayalam", locale: "ml_IN" },
                notification: false,

                is_video: data?.is_video ? data?.is_video : false,
                is_live: data?.is_live ? data?.is_live : false,
                is_premium: data?.is_premium ? data?.is_premium : false,
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 border-t border-primary/10">
                <div className="col-span-2 sm:pb-10">
                  <div className="p-4 pt-2">
                    <Form.Item
                      label={"Title"}
                      name={"title"}
                      rules={[{ required: true, message: "Required" }]}
                    >
                      <Input placeholder="Enter title" size="large" />
                    </Form.Item>
                    <Form.Item label={"Description"} name={"description"}>
                      <Input.TextArea
                        rows={4}
                        maxLength={250}
                        showCount
                        placeholder="Enter description"
                      />
                    </Form.Item>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Form.Item
                        label={"Featured Image ( 1200 x 650 )"}
                        name={"image"}
                        rules={[{ required: true, message: "Required" }]}
                      >
                        <FilePicker
                          url={form.getFieldValue("image")}
                          onchange={(value: any) => {
                            setLoading4(true);
                            form.setFieldValue("image", value?.name);
                            if (!form.getFieldValue("meta_image")) {
                              form.setFieldValue(
                                "meta_image",
                                form.getFieldValue("image"),
                              );
                            }
                            setTimeout(() => {
                              setLoading4(false);
                            }, 100);
                          }}
                        />
                      </Form.Item>
                      <div>
                        <Form.Item
                          label={"Category"}
                          name={"category"}
                          rules={[{ required: true, message: "Required" }]}
                        >
                          <CategoryPicker
                            value={form.getFieldValue("category")}
                            onChange={(value: any) =>
                              form.setFieldValue("category", value)
                            }
                          />
                        </Form.Item>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Form.Item
                        label={"Priority"}
                        name="priority"
                        rules={[{ required: true, message: "Required" }]}
                      >
                        <Radio.Group block buttonStyle="solid">
                          <Radio.Button value="0">Normal</Radio.Button>
                          <Radio.Button value="1">Primary</Radio.Button>
                          <Radio.Button value="2">Secondary</Radio.Button>
                        </Radio.Group>
                      </Form.Item>
                      <Form.Item label={"Display Order"} name={"position"}>
                        <Input type="number" />
                      </Form.Item>
                    </div>
                    <Form.Item label={"Tags"} name={"tags"}>
                      <TagPicker
                        value={form.getFieldValue("tags")}
                        onChange={(value: any) =>
                          form.setFieldValue("tags", value)
                        }
                      />
                    </Form.Item>
                  </div>
                  <Form.Item
                    name={"content"}
                    rules={[{ required: true, message: "Required" }]}
                  >
                    <TextEditor
                      value={form.getFieldValue("content") || ""}
                      onChange={(value: any) => {
                        handleEditorChange(value);
                        form.setFieldValue("content", value);
                      }}
                    />
                  </Form.Item>
                </div>
                <div className="sm:border-l border-primary/10 sm:min-h-screen h-full p-4 pb-12 sm:pb-0  pt-2!">
                  <Form.Item
                    label={"Permalink ( Slug )"}
                    name={"permalink"}
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
                  <Form.Item label={"Meta Title"} name={"meta_title"}>
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label={"Meta Description"}
                    name={"meta_description"}
                  >
                    <Input.TextArea maxLength={150} showCount />
                  </Form.Item>
                  <Form.Item
                    label={"Meta Image ( 1200 x 650 )"}
                    name={"meta_image"}
                    rules={[{ required: true, message: "Required" }]}
                  >
                    <FilePicker
                      url={form.getFieldValue("meta_image")}
                      onchange={(value: any) => {
                        setLoading4(true);
                        form.setFieldValue("meta_image", value?.name);
                        setTimeout(() => {
                          setLoading4(false);
                        }, 100);
                      }}
                    />
                  </Form.Item>
                  <Form.Item name={"language"} label="Language">
                    <Select
                      placeholder="Select a language"
                      value={form.getFieldValue("language")?.code}
                      onChange={(code: string) => {
                        const lang = Languages.find(
                          (l: any) => l.code === code,
                        );
                        if (lang) form.setFieldValue("language", lang);
                      }}
                    >
                      {Languages?.map((item: any) => (
                        <Select.Option key={item.code} value={item.code}>
                          {item?.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item label={`Editor`} name={"editor"}>
                    <EditorPicker
                      value={form.getFieldValue("editor")}
                      onChange={(value: any) =>
                        form.setFieldValue("editor", value?.value)
                      }
                    />
                  </Form.Item>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Form.Item label={"Reading Time"} name={"reading_time"}>
                      <Input suffix={<AiOutlineClockCircle />} />
                    </Form.Item>
                    <Form.Item label={"Published At"}>
                      <Input value={dayjs(data?.publishedAt).format("lll")} />
                    </Form.Item>
                  </div>

                  <SocialPreview
                    route={""}
                    permalink={form.getFieldValue("permalink")}
                    meta_description={
                      form.getFieldValue("meta_title") ||
                      form.getFieldValue("title")
                    }
                    meta_image={form.getFieldValue("meta_image")}
                    title={form.getFieldValue("title")}
                    description={form.getFieldValue("content")}
                  />
                  <div className="mb-4" />
                  {data?.permalink ? (
                    <Card
                      size="small"
                      title={"Reset Cache"}
                      extra={<GoDatabase size={20} />}
                    >
                      <div style={{ marginBottom: 10, fontSize: 12 }}>
                        Reset the page cache—after resetting, reload and refresh
                        the page.
                      </div>
                      <div>
                        <Button
                          danger
                          size="small"
                          loading={loading6}
                          onClick={() => refreshPage(permalink)}
                        >
                          Reset page now
                        </Button>
                      </div>
                    </Card>
                  ) : null}
                </div>
              </div>
              <FormFooter
                loading1={loading7}
                loading2={loading5}
                loading3={loading2}
                loading4={loading3}
                data={data}
                save={() => {
                  let status =
                    data?.status === "draft" ? "draft" : data?.status;
                  form.setFieldValue("status", status ? status : "draft");
                  form.submit();
                }}
                trash={() => {
                  setLoading5(true);
                  form.setFieldValue("status", "trashed");
                  form.submit();
                }}
                publish={() => {
                  form.setFieldValue("status", "published");
                  form.submit();
                }}
              />
            </Form>
          </div>
        )}
      </div>
    </div>
  );
}
