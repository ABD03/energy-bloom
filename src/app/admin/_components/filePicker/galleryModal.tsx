"use client";
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { debounce } from "lodash";
import { Button, Form, Input, message, Modal, Pagination } from "antd";
import { IoSearchOutline, IoCloseCircleOutline } from "react-icons/io5";

import Loading from "../loading";
import { ImageLoader } from "@/utils/common";
import Empty from "../empty";

import { GET } from "@/utils/apiCalls";
import { API } from "@/config/apis";
import { ViewImage } from "@/utils/viewImage";

function GalleryModal(props: any) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [take, setTake] = useState(24);
  const [query, setQuery] = useState(null);

  const [data, setData] = useState([]);
  const [meta, setMeta] = useState<any>({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      setLoading(true);
      getData();
    }
  }, [query, page, take]);

  const onValuesChange = useCallback(
    debounce((value: any) => {
      setQuery(value?.query);
    }, 500),
    [],
  );

  const clearFilter = () => {
    form.setFieldsValue({ query: null });
    setQuery(null);
  };

  const getData = async () => {
    try {
      let filter1 = `?page=${page}`;
      let filter2 = `&limit=${take}`;
      let filter3 = query ? `&search=${query}` : "";
      let URL = `${API.MEDIA}${filter1}${filter2}${filter3}`;
      let response: any = await GET(URL, null);
      if (response?.status) {
        setMeta(response?.meta);
        setData(response?.data);
      } else {
        message.error("oops.something gone wrong.");
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={`Media gallery`}
      onCancel={props?.onCancel}
      open={props.visible}
      footer={false}
      width={950}
      zIndex={2000}
      centered
    >
      <div className="-m-2 min-h-137.5">
        <Form
          form={form}
          style={{ marginBottom: 10 }}
          onValuesChange={(value: any, values: any) => onValuesChange(values)}
        >
          <div className="flex pt-2 pb-2">
            <Form.Item noStyle name={"query"}>
              <Input
                placeholder="Search"
                allowClear
                prefix={<IoSearchOutline size={15} color="grey" />}
                className="w-62.5!"
              />
            </Form.Item>
            {query ? (
              <Form.Item noStyle>
                <Button
                  icon={<IoCloseCircleOutline size={15} />}
                  onClick={() => clearFilter()}
                  danger
                  type="text"
                  size="small"
                >
                  Clear filter
                </Button>
              </Form.Item>
            ) : null}
            <div className="flex-1" />
            <Pagination
              size="small"
              current={page}
              pageSize={take}
              total={meta?.total}
              showSizeChanger
              pageSizeOptions={[12, 24, 48]}
              onChange={(p, pageSize) => {
                if (pageSize !== take) {
                  setTake(pageSize);
                  setPage(1);
                } else {
                  setPage(p);
                }
              }}
            />
          </div>
        </Form>
        {loading ? (
          <Loading />
        ) : (
          <div>
            {data?.length ? (
              <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-5 gap-2">
                {data?.map((item: any) => (
                  <div
                    key={item?._id}
                    onClick={() => {
                      props?.onchange(item);
                      props?.onCancel();
                    }}
                  >
                    <Image
                      src={ViewImage(item?.name) as any}
                      width={0}
                      height={130}
                      alt={""}
                      className="h-40! w-full object-cover border border-gray-100 rounded!"
                      loader={ImageLoader}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <Empty />
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}

export default GalleryModal;
