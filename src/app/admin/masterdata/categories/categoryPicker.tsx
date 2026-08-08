import React, { useEffect, useState } from "react";
import { Select } from "antd";

import { API } from "@/config/apis";
import { GET } from "@/utils/apiCalls";

const CategoryPicker = (props: any) => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      getCategories();
    }
  }, []);

  const getCategories = async () => {
    try {
      setLoading(true);
      let response: any = await GET(API.CATEGORY_PICKER, null);
      if (response?.status) {
        setItems(response?.data);
      } else {
        setItems([]);
      }
      setLoading(false);
    } catch (err) {
      setItems([]);
      setLoading(false);
    }
  };

  return (
    <Select
      loading={loading}
      value={props?.value}
      style={{ width: "100%" }}
      placeholder="select category"
      allowClear
      showSearch={true}
      optionFilterProp="label"
      labelInValue
      onChange={(value: any) => props?.onChange(value)}
      options={items.map((item: any) => ({
        label: item?.value,
        value: item?._id,
      }))}
    />
  );
};

export default CategoryPicker;
