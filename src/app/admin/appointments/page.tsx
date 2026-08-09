"use client";

import { useEffect, useState } from "react";
import { Button, message } from "antd";
import { useSearchParams } from "next/navigation";
import { RiRefreshLine } from "react-icons/ri";
import { IoMdAdd } from "react-icons/io";

import PageHeader from "../_components/pageHeader";
import Loading from "../_components/loading";

import Filters from "./_components/filters";
import DataTable from "./_components/dataTable";
import FormModal from "./_components/formModal";

import { DELETE, GET } from "@/utils/apiCalls";
import { UseAppSelector } from "@/redux/util/hooks";
import { API } from "@/config/apis";

export default function Appointments() {
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || 1;
  const take = searchParams.get("limit") || 10;
  const query = searchParams.get("search") || "";
  const date = searchParams.get("date") || "";
  const status = searchParams.get("status") ?? "upcoming";
  const doctor = searchParams.get("doctor") || "";

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
      const qp = new URLSearchParams();
      qp.set("page", String(page));
      qp.set("limit", String(take));
      if (query) qp.set("search", query);
      if (date) qp.set("date", date);
      if (status) qp.set("status", status);
      if (doctor) qp.set("doctor", doctor);
      const URL = `${API.APPOINTMENTS}?${qp.toString()}`;
      const response: any = await GET(URL, null);
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
      const response: any = await DELETE(`${API.APPOINTMENTS}?id=${item?._id}`);
      if (response?.status) {
        getData();
        message.success("Appointment deleted successfully");
      } else {
        message.error("oops.something gone wrong.");
      }
    } catch (err) {
      message.error("oops.something gone wrong.");
    }
  };

  return (
    <div>
      <PageHeader
        title={"Appointments"}
        icon={"LuTicketSlash"}
        showBack={true}
        showMenu={false}
        showMobileBack={false}
        showMobileMenu={true}
        total={meta?.total ? meta?.total : 0}
      >
        <Button type="primary" onClick={() => setFormModal(true)}>
          <span className="text-[12px] hidden md:inline">New appointment</span>
          <IoMdAdd size={20} />
        </Button>
        <Button onClick={() => reloadData()} loading={loading} className="p-2!">
          <RiRefreshLine size={20} />
        </Button>
      </PageHeader>
      <div className="h-[92vh] overflow-y-auto overflow-x-hidden pb-[7vh]">
        <Filters query={query} date={date} status={status} doctor={doctor} />
        {loading ? (
          <Loading />
        ) : (
          <DataTable
            data={data}
            meta={meta}
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
    </div>
  );
}
