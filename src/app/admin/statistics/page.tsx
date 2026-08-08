"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import {
  Button,
  Card,
  DatePicker,
  message,
  Pagination,
  Table,
  Tag,
} from "antd";
import { RiRefreshLine } from "react-icons/ri";
import { FiMonitor, FiSmartphone } from "react-icons/fi";
import { dayjs } from "@/utils/common";

import PageHeader from "../_components/pageHeader";
import Loading from "../_components/loading";

import { API } from "@/config/apis";
import { GET } from "@/utils/apiCalls";

const StatisticsCharts = dynamic(() => import("./_components/charts"), {
  ssr: false,
});

const { RangePicker } = DatePicker;

export default function Statistics() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "30";
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>({});

  useEffect(() => {
    if (typeof window !== "undefined") getData();
  }, [searchParams]);

  const getData = async () => {
    try {
      setLoading(true);
      let url = `${API.STATICS}?page=${page}&limit=${limit}`;
      if (from) url += `&from=${from}`;
      if (to) url += `&to=${to}`;
      const response: any = await GET(url, null);
      if (response?.status) {
        setData(response?.data || []);
        setMeta(response?.meta || {});
      } else {
        message.error("Something went wrong");
      }
    } catch {
      message.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const onDateChange = (dates: any) => {
    const params = new URLSearchParams();
    params.set("page", "1");
    params.set("limit", limit);
    if (dates && dates[0] && dates[1]) {
      params.set("from", dates[0].format("YYYY-MM-DD"));
      params.set("to", dates[1].format("YYYY-MM-DD"));
    }
    router.replace(`?${params.toString()}`);
  };

  const onPageChange = (p: number, ps: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(p));
    params.set("limit", String(ps));
    router.replace(`?${params.toString()}`);
  };

  const clearFilter = () => {
    router.replace("?page=1&limit=30");
  };

  const totalViews = data.reduce((s: number, d: any) => s + (d.views || 0), 0);
  const totalMobile = data.reduce(
    (s: number, d: any) => s + (d.mobile || 0),
    0,
  );
  const totalDesktop = data.reduce(
    (s: number, d: any) => s + (d.desktop || 0),
    0,
  );

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (v: any) => (
        <span className="font-medium text-sm">
          {dayjs(v).format("DD MMM YYYY")}
        </span>
      ),
    },
    {
      title: "Day",
      dataIndex: "date",
      key: "day",
      width: 100,
      render: (v: any) => (
        <span className="text-gray-500 text-xs">{dayjs(v).format("dddd")}</span>
      ),
    },
    {
      title: "Total Views",
      dataIndex: "views",
      key: "views",
      width: 120,
      sorter: (a: any, b: any) => a.views - b.views,
      render: (v: any) => <Tag color="red">{v?.toLocaleString() || 0}</Tag>,
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
      key: "mobile",
      width: 120,
      sorter: (a: any, b: any) => a.mobile - b.mobile,
      render: (v: any) => (
        <span className="flex items-center gap-1.5 text-sm">
          <FiSmartphone size={13} className="text-blue-500" />
          {v?.toLocaleString() || 0}
        </span>
      ),
    },
    {
      title: "Desktop",
      dataIndex: "desktop",
      key: "desktop",
      width: 120,
      sorter: (a: any, b: any) => a.desktop - b.desktop,
      render: (v: any) => (
        <span className="flex items-center gap-1.5 text-sm">
          <FiMonitor size={13} className="text-green-500" />
          {v?.toLocaleString() || 0}
        </span>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Statistics"
        icon="IoStatsChartOutline"
        showBack={true}
        showMenu={false}
        showMobileBack={true}
        showMobileMenu={false}
      >
        <Button onClick={getData} loading={loading} className="p-2!">
          <RiRefreshLine size={18} />
        </Button>
      </PageHeader>

      <div className="h-[92vh] overflow-y-auto overflow-x-hidden">
        {loading && data.length === 0 ? (
          <Loading />
        ) : (
          <div className="p-4 pt-2 space-y-4">
            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-3">
              <Card size="small" className="text-center!">
                <div className="text-2xl font-bold text-primary">
                  {totalViews.toLocaleString()}
                </div>
                <div className="text-xs text-gray-400 mt-1">Total Views</div>
              </Card>
              <Card size="small" className="text-center!">
                <div className="text-2xl font-bold text-blue-500">
                  {totalMobile.toLocaleString()}
                </div>
                <div className="text-xs text-gray-400 mt-1">Mobile</div>
              </Card>
              <Card size="small" className="text-center!">
                <div className="text-2xl font-bold text-green-500">
                  {totalDesktop.toLocaleString()}
                </div>
                <div className="text-xs text-gray-400 mt-1">Desktop</div>
              </Card>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              <RangePicker
                onChange={onDateChange}
                value={
                  from && to
                    ? [dayjs(from) as any, dayjs(to) as any]
                    : undefined
                }
              />
              {(from || to) && (
                <Button size="small" onClick={clearFilter}>
                  Clear
                </Button>
              )}
              <div className="flex-1" />
              <span className="text-xs text-gray-400">
                {meta?.total || 0} records
              </span>
            </div>

            {/* Charts */}
            {data.length > 1 && <StatisticsCharts data={data} />}

            {/* Table */}
            <Table
              size="small"
              rowKey="_id"
              dataSource={data}
              columns={columns}
              loading={loading}
              pagination={false}
              scroll={{ x: "max-content" }}
            />

            {meta?.total > Number(limit) && (
              <div className="flex justify-end pt-2 pb-8">
                <Pagination
                  current={Number(page)}
                  pageSize={Number(limit)}
                  total={meta?.total}
                  onChange={onPageChange}
                  showSizeChanger
                  pageSizeOptions={["15", "30", "60", "90"]}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
