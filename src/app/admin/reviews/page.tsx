"use client";
import { useEffect, useState } from "react";
import { Button, message } from "antd";
import { RiRefreshLine } from "react-icons/ri";
import { useSearchParams } from "next/navigation";

import PageHeader from "../_components/pageHeader";
import Loading from "../_components/loading";

import Filters from "./_components/filters";
import DataTable from "./_components/dataTable";
import FormModal from "./_components/formModal";

import { API } from "@/config/apis";
import { DELETE, GET } from "@/utils/apiCalls";
import { UseAppSelector } from "@/redux/util/hooks";

export default function ReviewsPage() {
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || 1;
  const take = searchParams.get("limit") || 10;
  const query = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";

  const Auth = UseAppSelector((state: any) => state?.Auth);

  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(false);
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState<any>({});

  const [formModal, setFormModal] = useState<any>(false);
  const [selectedItem, setSelectedItem] = useState<any>({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      setLoading2(true);
      getData();
    }
  }, [searchParams]);

  const reloadData = () => {
    setLoading2(true);
    getData();
  };

  const getData = async () => {
    try {
      const filter1 = `?page=${page}`;
      const filter2 = `&limit=${take}`;
      const filter3 = query ? `&search=${query}` : "";
      const filter4 = status ? `&status=${status}` : "";
      const URL = `${API.REVIEWS}${filter1}${filter2}${filter3}${filter4}`;
      const response: any = await GET(URL, null);
      if (response?.status) {
        setMeta(response?.meta);
        setData(response?.data);
      } else {
        message.error("oops.something gone wrong.");
      }
    } catch (err) {
      console.log("err", err);
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
      const response: any = await DELETE(`${API.REVIEWS}?id=${item?._id}`);
      if (response?.status) {
        getData();
        message.success(response?.message);
      } else {
        message.error(response?.message);
      }
    } catch {
      message.error("oops.something gone wrong.");
    }
  };

  return (
    <div>
      <PageHeader
        title={"Reviews"}
        icon={"FcGoogle"}
        showBack={true}
        showMenu={false}
        showMobileBack={false}
        showMobileMenu={true}
        total={meta?.total ? meta?.total : 0}
      >
        <Button onClick={() => reloadData()} loading={loading} className="p-2!">
          <RiRefreshLine size={20} />
        </Button>
      </PageHeader>
      <div className="h-[92vh] overflow-y-auto overflow-x-hidden pb-[7vh]">
        <Filters
          query={query}
          status={status}
          openForm={() => editItem({})}
        />
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
      </div>
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
