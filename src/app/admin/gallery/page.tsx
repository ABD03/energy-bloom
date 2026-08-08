"use client";
import { useEffect, useState } from "react";
import { Button, message } from "antd";
import { IoMdAdd } from "react-icons/io";
import { RiRefreshLine } from "react-icons/ri";
import { useSearchParams } from "next/navigation";

import PageHeader from "../_components/pageHeader";
import Loading from "../_components/loading";
import Empty from "../_components/empty";
import Filters from "./_components/filters";
import ImageItem from "./_components/imageItem";
import DataTable from "./_components/dataTable";
import PickerModal from "../_components/filePicker/pickerModal";

import { UseAppSelector } from "@/redux/util/hooks";
import { DELETE, GET } from "@/utils/apiCalls";
import { API } from "@/config/apis";

export default function Gallery() {
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || 1;
  const take = searchParams.get("limit") || 20;
  const query = searchParams.get("search") || "";
  const date = searchParams.get("date") || "";
  const view = searchParams.get("view") || "grid";

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
      let filter4 = date ? `&date=${date}` : "";
      let URL = `${API.MEDIA}${filter1}${filter2}${filter3}${filter4}`;
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
      let response: any = await DELETE(`${API.MEDIA}?id=${item?._id}`);
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

  const handleDownload = async (fileUrl: string) => {
    try {
      message.loading({ content: "Downloading File", duration: 1 });
      const fileName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
      const response = await fetch(fileUrl, {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const fileData = await response.blob();
      const tempLink = document.createElement("a");
      tempLink.href = window.URL.createObjectURL(fileData);
      tempLink.setAttribute("download", fileName);
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
      window.URL.revokeObjectURL(tempLink.href);
      message.success(`File Downloaded Successfully`);
    } catch (error) {
      console.error("Download error:", error);
      message.error(`Unable to download file. Please try again`);
    }
  };

  const copyImage = async (fileUrl: string) => {
    try {
      await navigator.clipboard.writeText(fileUrl);
      message.success("Image URL copied to clipboard");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <div>
      <PageHeader
        title={"Gallery"}
        icon={"BiImages"}
        showBack={true}
        showMenu={false}
        showMobileBack={false}
        showMobileMenu={true}
        total={meta?.total ? meta?.total : 0}
      >
        <Button type="primary" onClick={() => editItem({})}>
          <span className="text-[12px] hidden md:inline">Upload</span>
          <IoMdAdd size={20} />
        </Button>
        <Button onClick={() => reloadData()} loading={loading} className="p-2!">
          <RiRefreshLine size={20} />
        </Button>
      </PageHeader>
      <div className="h-[92vh] overflow-y-auto overflow-x-hidden pb-[7vh]">
        <Filters
          loading={loading2}
          query={query}
          date={date}
          meta={meta}
          page={Number(page)}
          take={Number(take)}
        />
        {loading ? (
          <Loading />
        ) : data?.length ? (
          view === "grid" ? (
            <div className="p-2 grid grid-cols-2 sm:grid-cols-5 md:grid-cols-5 gap-2">
              {data?.map((item: any) => (
                <div key={item?._id}>
                  <ImageItem
                    item={item}
                    onDelete={(id: any) => deleteItem(id)}
                    handleDownload={(id: any) => handleDownload(id)}
                    copyImage={(id: any) => copyImage(id)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <DataTable
              data={data}
              loading={loading2}
              meta={meta}
              onDelete={(id: any) => deleteItem(id)}
              onEdit={(id: any) => editItem(id)}
              handleDownload={(id: any) => handleDownload(id)}
              copyImage={(id: any) => copyImage(id)}
            />
          )
        ) : (
          <Empty />
        )}
      </div>
      {formModal ? (
        <PickerModal
          user={Auth?.user}
          data={selectedItem}
          visible={formModal}
          onchange={() => reloadData()}
          onCancel={() => editItem({})}
        />
      ) : null}
    </div>
  );
}
