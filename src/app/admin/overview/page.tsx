"use client";

import { useEffect, useState } from "react";
import { Button, message, Tag } from "antd";
import { GoLinkExternal } from "react-icons/go";
import { IoSync } from "react-icons/io5";
import { dayjs } from "@/utils/common";

import PageHeader from "../_components/pageHeader";
import StaticCard from "./_components/cards";

import DynamicIcon from "@/utils/dynamicIcons";
import { API } from "@/config/apis";
import { GET } from "@/utils/apiCalls";

export default function OverView() {
  const [loading, setLoading] = useState(true);
  const [loading1, setLoading1] = useState(true);
  const [loading2, setLoading2] = useState(true);

  const [counts, setCounts] = useState<any>({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      getData();
    }
  }, []);

  const reloadData = () => {
    setLoading1(true);
    getData();
  };

  const getData = async () => {
    try {
      let date = new Date().toISOString();
      let URL = `${API.OVERVIEW}?date=${date}`;
      let response: any = await GET(URL, null);
      if (response?.status) {
        setCounts(response?.data?.counts);
      } else {
        message.error("oops.something gone wrong.");
      }
    } catch (err) {
      message.error("oops.something gone wrong.");
    } finally {
      setLoading(false);
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
              <div className="font-semibold text-base mb-1">New Bookings</div>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold mb-1">
                  {counts?.upcoming || 0}
                </div>
              </div>
              <div className="text-[12px] text-gray-500">
                {dayjs().format("lll")}
              </div>
            </div>
            <StaticCard
              loading={loading}
              title={"Appointments"}
              value={counts?.appointments || 0}
              icon={"LuTicketSlash"}
            />
            <StaticCard
              loading={loading}
              title={"Patients"}
              value={counts?.patients || 0}
              icon={"PiUsersThree"}
            />
            <StaticCard
              loading={loading}
              title={"Doctors"}
              value={counts?.doctors || 0}
              icon={"FaUserDoctor"}
            />
            <StaticCard
              loading={loading}
              title={"Enquiry"}
              value={counts?.contacts || 0}
              icon={"VscFeedback"}
            />
          </div>
          <div className="flex gap-4 overflow-x-auto pt-4 scrollbar-hide">
            {[
              {
                icon: "RiPagesLine",
                label: "Pages",
                value: counts?.pages || 0,
              },
              { icon: "BiImages", label: "Files", value: counts?.files || 0 },
              { icon: "FiUsers", label: "Users", value: counts?.users || 0 },
              {
                icon: "MdOutlineQuestionAnswer",
                label: "FAQs",
                value: counts?.faqs || 0,
              },
              {
                icon: "MdOutlineRateReview",
                label: "Reviews",
                value: counts?.reviews || 0,
              },
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
      </div>
    </div>
  );
}
