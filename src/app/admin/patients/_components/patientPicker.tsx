"use client";
import { useEffect, useState } from "react";
import { Select } from "antd";

import { API } from "@/config/apis";
import { GET } from "@/utils/apiCalls";

type Props = {
  value?: string;
  onChange?: (id: string, patient: any) => void;
  initial?: any;
  placeholder?: string;
  disabled?: boolean;
};

function PatientPicker({
  value,
  onChange,
  initial,
  placeholder = "Search patient",
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
        `${API.PATIENTS_PICKER}${qp.toString() ? `?${qp.toString()}` : ""}`,
        null,
      );
      if (res?.status) {
        const merged =
          initial && !res.data.find((p: any) => p._id === initial._id)
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
        const patient = items.find((p) => p._id === id);
        onChange?.(id, patient);
      }}
      options={items.map((p) => ({
        label: `${p.patientId ? `${p.patientId} · ` : ""}${p.name}`,
        value: p._id,
      }))}
    />
  );
}

export default PatientPicker;
