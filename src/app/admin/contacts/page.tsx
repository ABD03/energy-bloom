"use client";
import { useEffect, useState } from "react";
import { Button, message } from "antd";
import { RiRefreshLine } from "react-icons/ri";
import { useSearchParams } from "next/navigation";

import PageHeader from "../_components/pageHeader";
import Loading from "../_components/loading";

import Filters from "./_components/filters";
import DataTable from "./_components/dataTable";
import DetailsModal from "./_components/detailsModal";

import { DELETE, GET } from "@/utils/apiCalls";
import { UseAppSelector } from "@/redux/util/hooks";
import { API } from "@/config/apis";

export default function Contacts() {
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
  }, [searchParams]);

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
      let URL = `${API.CONTACT}${filter1}${filter2}${filter3}${filter4}`;
      let response: any = await GET(URL, null);
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
      let response: any = await DELETE(`${API.CONTACT}?id=${item?._id}`);
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
      <PageHeader
        title={"Enquires"}
        icon={"VscFeedback"}
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
        <Filters query={query} status={status} />
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
        <DetailsModal
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
