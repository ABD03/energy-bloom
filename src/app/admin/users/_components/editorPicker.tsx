import React, { useEffect, useState } from "react";
import { Select } from "antd";

import { API } from "@/config/apis";
import { GET } from "@/utils/apiCalls";

const EditorPicker = (props: any) => {
  const [loading, setLoading] = useState(true);
  const [items, setEditors] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      getEditors();
    }
  }, []);

   const getEditors = async () => {
    try {
      let response: any = await GET(API.USERS_PICKER, null);
      if (response?.status) {
        setEditors(response?.data);
      } else {
        setEditors([]);
      }
      setLoading(false);
    } catch (err) {
      setEditors([]);
       setLoading(false);
    }
  };

  return (
    <Select
      loading={loading}
      value={props?.value}
      style={{ width: "100%" }}
      placeholder="Select Editor"
      allowClear
      showSearch={true}
      optionFilterProp="label"
      onChange={(value: any) => props?.onChange(value)}
      options={items.map((item: any) => ({
        label: item?.name,
        value: item?._id,
      }))}
    />
  );
};

export default EditorPicker;
