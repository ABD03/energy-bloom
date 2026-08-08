"use client";
import { useEffect, useState } from "react";
import { Button, message } from "antd";
import { RiRefreshLine } from "react-icons/ri";
import { IoMdAdd } from "react-icons/io";
import { useRouter, useSearchParams } from "next/navigation";

import PageHeader from "../_components/pageHeader";
import Loading from "../_components/loading";

import DataTable from "./_components/dataTable";
import Filters from "./_components/filters";

import { API } from "@/config/apis";
import { DELETE, GET, PUT } from "@/utils/apiCalls";
import { UseAppSelector } from "@/redux/util/hooks";

export default function Content() {
  const navigation = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || 1;
  const take = searchParams.get("limit") || 10;
  const query = searchParams.get("search") || "";
  const date = searchParams.get("date") || "";
  const status = searchParams.get("status") || "";

  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(false);
  const Auth = UseAppSelector((state: any) => state?.Auth);

  const [data, setData] = useState([]);
  const [meta, setMeta] = useState<any>({});

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
      let filter3 = status ? `&status=${status}` : "";
      let filter4 = query ? `&search=${query}` : "";
      let filter5 = date ? `&date=${date}` : "";
      let URL = `${API.CONTENT}${filter1}${filter2}${filter3}${filter4}${filter5}`;
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

  const trashItem = async (item: any) => {
    try {
      let obj = {
        _id: item?._id,
        status: "trashed",
      };
      let response: any = await PUT(`${API.CONTENT}`, obj);
      if (response?.status) {
        getData();
        refreshPage(item?.permalink);
        message.success(response?.message);
      } else {
        message.error(response?.message);
      }
    } catch (err) {
      message.error("oops.something gone wrong.");
    }
  };

  const deleteItem = async (item: any) => {
    try {
      let response: any = await DELETE(`${API.CONTENT}?id=${item?._id}`);
      if (response?.status) {
        getData();
        refreshPage(item?.permalink);
        message.success(response?.message);
      } else {
        message.error(response?.message);
      }
    } catch (err) {
      message.error("oops.something gone wrong.");
    }
  };

  const refreshPage = async (link: any) => {
    try {
      let url = `/${link}`;
      let response: any = await GET(API.REVALIDATE + `?url=${url}`, null);
    } catch (err) {
      console.log("err", err);
      message.error("oops.something gone wrong.");
    } finally {
    }
  };

  return (
    <div>
      <PageHeader
        title={"Contents"}
        icon={"FiEdit"}
        showBack={true}
        showMenu={false}
        showMobileBack={false}
        showMobileMenu={true}
        total={meta?.total ? meta?.total : 0}
      >
        <Button
          type="primary"
          onClick={() => navigation.push("/admin/contents/form?id=0")}
        >
          <span className="hidden md:inline">New content</span>
          <IoMdAdd size={20} />
        </Button>
        <Button onClick={() => reloadData()} loading={loading} className="p-2!">
          <RiRefreshLine size={20} />
        </Button>
      </PageHeader>
    
      <div>
        <Filters query={query} date={date} status={status} />
        {loading ? (
          <Loading />
        ) : (
          <DataTable
            data={data}
            meta={meta}
            user={Auth?.user}
            loading={loading2}
            onTrash={(id: any) => trashItem(id)}
            onDelete={(id: any) => deleteItem(id)}
          />
        )}
      </div>
    </div>
  );
}
