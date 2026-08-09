"use client";
import { useEffect, useState } from "react";
import { Select } from "antd";

import { API } from "@/config/apis";
import { GET } from "@/utils/apiCalls";

type Props = {
  value?: string;
  onChange?: (id: string) => void;
  onSelect?: (doctor: any) => void;
  initial?: any;
  placeholder?: string;
  disabled?: boolean;
};

function DoctorPicker({
  value,
  onChange,
  onSelect,
  initial,
  placeholder = "Search doctor",
  disabled,
}: Props) {
  const [items, setItems] = useState<any[]>(initial ? [initial] : []);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    load(search);
  }, [search]);

  const load = async (q: string) => {
    try {
      setLoading(true);
      const qp = new URLSearchParams();
      if (q) qp.set("search", q);
      const res: any = await GET(
        `${API.DOCTORS_PICKER}${qp.toString() ? `?${qp.toString()}` : ""}`,
        null,
      );
      if (res?.status) {
        const merged =
          initial && !res.data.find((d: any) => d._id === initial._id)
            ? [initial, ...res.data]
            : res.data;
        setItems(merged);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Select
      value={value}
      showSearch
      allowClear
      disabled={disabled}
      placeholder={placeholder}
      filterOption={false}
      loading={loading}
      onSearch={setSearch}
      onChange={(id) => {
        onChange?.(id);
        onSelect?.(items.find((d) => d._id === id) || null);
      }}
      options={items.map((d) => ({
        label: `${d.doctorId ? `${d.doctorId} · ` : ""}${d.name}`,
        value: d._id,
      }))}
    />
  );
}

export default DoctorPicker;
