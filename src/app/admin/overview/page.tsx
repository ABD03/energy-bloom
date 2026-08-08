"use client";

import { useEffect, useState } from "react";
import { Button, message, Tag } from "antd";
import { GoLinkExternal } from "react-icons/go";
import { IoSync } from "react-icons/io5";
import { dayjs } from "@/utils/common";

import PageHeader from "../_components/pageHeader";
import Chart from "./_components/chart";
import Chart2 from "./_components/chart2";
import StaticCard from "./_components/cards";
import Trending from "./_components/trending";

import DynamicIcon from "@/utils/dynamicIcons";
import { API } from "@/config/apis";
import { GET } from "@/utils/apiCalls";

export default function OverView() {
  const [loading, setLoading] = useState(true);
  const [loading1, setLoading1] = useState(true);
  const [loading2, setLoading2] = useState(true);

  const [counts, setCounts] = useState<any>({});
  const [todays, setTodays] = useState<any>({});
  const [comparison, setComparison] = useState<any>({});
  const [graphData, setGraphData] = useState([]);
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      getData();
      getChart();
      getTrending();
    }
  }, []);

  const reloadData = () => {
    setLoading1(true);
    getData();
    getChart();
    getTrending();
  };

  const getData = async () => {
    try {
      let date = new Date().toISOString();
      let URL = `${API.OVERVIEW}?date=${date}`;
      let response: any = await GET(URL, null);
      if (response?.status) {
        setCounts(response?.data?.counts);
        setTodays(response?.data?.today);
        setComparison(response?.data?.comparison);
      } else {
        message.error("oops.something gone wrong.");
      }
    } catch (err) {
      message.error("oops.something gone wrong.");
    } finally {
      setLoading(false);
    }
  };

  const getChart = async () => {
    try {
      let date = new Date().toISOString();
      let URL = `${API.OVERVIEW_CHART}?date=${date}`;
      let response: any = await GET(URL, null);
      if (response?.status) {
        let data: any = [
          { day: dayjs().subtract(1, "day").format("YYYY-MM-DD"), views: 0 },
        ];
        if (response?.data?.length === 1) {
          data = data.concat(response?.data);
        } else {
          data = response?.data;
        }
        setGraphData(data);
      } else {
        message.error("Oops.something gone wrong.");
      }
    } catch (err) {
      message.error("Oops.something gone wrong.");
    } finally {
      setLoading1(false);
    }
  };

  const getTrending = async () => {
    try {
      setLoading2(true);
      let date = new Date().toISOString();
      let URL = `${API.OVERVIEW_TRENDING}?date=${date}`;
      let response: any = await GET(URL, null);
      if (response?.status) {
        setTrending(response?.data);
      } else {
        setTrending([]);
      }
      setLoading2(false);
    } catch (err) {
      message.error("Oops.something gone wrong.");
      setLoading2(false);
    }
  };

  return (
    <div>
      <PageHeader
        title={"Dashboard"}
        showBack={false}
        showMenu={false}
        showMobileBack={false}
        showMobileMenu={true}
        icon={"RiHome5Line"}
        subtitle={"Welcome to dashboard"}
      >
        <div className="text-[12px]">{dayjs().format("ll")}</div>
        <Button
          onClick={() => window.open("/", "_blank", "noopener noreferrer")}
          className="p-2! ml-2"
        >
          <GoLinkExternal size={20} />
          <span className="text-[12px] hidden md:inline">Open website</span>
        </Button>
      </PageHeader>
      <div className="h-[92vh] overflow-y-auto overflow-x-hidden pb-[7vh]">
        <div className="p-4">
          <div className="flex justify-between mb-10">
            <div className="flex-1">
              <div className="text-4xl font-semibold mt-2 text-primary/60">
                Hello ,
              </div>
            </div>
            <Button
              type="primary"
              loading={loading}
              onClick={() => reloadData()}
            >
              <IoSync /> Sync Data
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-1">
            <div className="col-span-2 sm:col-span-1">
              <div className="font-semibold text-base mb-1">Today Views</div>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold mb-1">
                  {" "}
                  {comparison?.views?.today || 0}
                </div>
                <div>
                  {comparison?.views?.diff !== undefined && (
                    <Tag
                      color={
                        comparison?.views?.trend === "positive"
                          ? "green"
                          : comparison?.views?.trend === "negative"
                            ? "red"
                            : "default"
                      }
                    >
                      {comparison?.views?.diff > 0 ? "+" : ""}
                      {comparison?.views?.diff} ({comparison?.views?.percentage}
                      %)
                    </Tag>
                  )}
                </div>
              </div>
              <div className="text-[12px] text-gray-500">
                {dayjs().format("lll")}
              </div>
            </div>

            <StaticCard
              loading={loading}
              title={"Contents"}
              value={counts?.content || 0}
              icon={"FiEdit"}
            />
            <StaticCard
              loading={loading}
              title={"Subscribers"}
              value={counts?.subscriber || 0}
              icon={"PiUsersThree"}
            />
            <StaticCard
              loading={loading}
              title={"Enquiry"}
              value={counts?.contacts || 0}
              icon={"TiTabsOutline"}
            />
          </div>
          <div className="flex gap-4 overflow-x-auto pt-4 scrollbar-hide">
            {[
              {
                icon: "LiaDatabaseSolid",
                label: "Categories",
                value: counts?.categories || 0,
              },
              {
                icon: "IoPricetagsOutline",
                label: "Tags",
                value: counts?.tags || 0,
              },
              {
                icon: "RiPagesLine",
                label: "Pages",
                value: counts?.pages || 0,
              },
              { icon: "BiImages", label: "Files", value: counts?.files || 0 },
              { icon: "FiUsers", label: "Users", value: counts?.users || 0 },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 px-1 py-1 bg-white border border-gray-200 rounded-full text-sm whitespace-nowrap shrink-0"
              >
                <span className="bg-primary/10 text-primary h-8 w-8 rounded-full flex items-center justify-center">
                  <DynamicIcon size={15} name={item.icon} />
                </span>
                <span className="text-gray-500 text-xs pr-10">
                  {item.label}
                </span>
                <span className="font-medium text-gray-800 pr-2">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4  p-4">
          <Chart data={graphData || []} loading={loading1} />
          <Chart2 data={todays} loading={loading1} />
        </div>
        <div className="p-4">
          <Trending data={trending} loading={loading2} />
        </div>
      </div>
    </div>
  );
}
