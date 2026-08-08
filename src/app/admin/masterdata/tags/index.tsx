"use client";
import { useEffect, useState } from "react";
import { LuTags } from "react-icons/lu";
import { Button, message } from "antd";
import { RiRefreshLine } from "react-icons/ri";
import { IoMdAdd } from "react-icons/io";
import { useSearchParams } from "next/navigation";

import DataTable from "./dataTable";
import FormModal from "./formModal";
import Filters from "./filters";
import Loading from "../../_components/loading";

import { API } from "@/config/apis";
import { DELETE, GET } from "@/utils/apiCalls";
import { UseAppSelector } from "@/redux/util/hooks";

export default function Tags(props: any) {
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || 1;
  const take = searchParams.get("limit") || 10;
  const query = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";

  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(false);
  const Auth = UseAppSelector((state: any) => state?.Auth);

  const [data, setData] = useState([]);
  const [meta, setMeta] = useState<any>({});

  const [formModal, setFormModal] = useState<any>(false);
  const [selectedItem, setSelectedItem] = useState<any>({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      setLoading2(true);
      getData();
    }
  }, [searchParams, props?.refresh]);

  const reloadData = () => {
    setLoading2(true);
    getData();
  };

  const getData = async () => {
    try {
      let filter1 = `?page=${page}`;
      let filter2 = `&limit=${take}`;
      let filter3 = query ? `&search=${query}` : "";
      let filter4 = status ? `&status=${status}` : "";
      let URL = `${API.TAG}${filter1}${filter2}${filter3}${filter4}`;
      let response: any = await GET(URL, null);
      if (response?.status) {
        setMeta(response?.meta);
        setData(response?.data);
      } else {
        message.error("oops.something gone wrong.");
      }
    } catch (err) {
    } finally {
      setLoading2(false);
      setLoading(false);
    }
  };

  const editItem = (value: any) => {
    setSelectedItem(value);
    setFormModal(!formModal);
  };

  const deleteItem = async (item: any) => {
    try {
      let response: any = await DELETE(`${API.TAG}?id=${item?._id}`);
      if (response?.status) {
        getData();
        message.success(response?.message);
      } else {
        message.error(response?.message);
      }
    } catch (err) {
      message.error("oops.something gone wrong.");
    }
  };

  return (
    <div>
      <Filters query={query} status={status} openForm={() => editItem({})} />
      {loading ? (
        <Loading />
      ) : (
        <DataTable
          data={data}
          meta={meta}
          user={Auth?.user}
          loading={loading2}
          onEdit={(data: any) => editItem(data)}
          onDelete={(id: any) => deleteItem(id)}
        />
      )}
      {formModal ? (
        <FormModal
          user={Auth?.user}
          data={selectedItem}
          visible={formModal}
          onCancel={() => editItem({})}
          onchange={() => getData()}
        />
      ) : null}
    </div>
  );
}
