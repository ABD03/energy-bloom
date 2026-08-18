"use client";
import { useEffect, useState } from "react";
import { Card } from "antd";
import { useRouter } from "next/navigation";

import { API } from "@/config/apis";
import { GET } from "@/utils/apiCalls";
import { dayjs } from "@/utils/common";

type DayStats = {
  count?: number;
  upcoming?: number;
  attended?: number;
  cancelled?: number;
};

function TodayAppt() {
  const router = useRouter();
  const [stats, setStats] = useState<DayStats>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const now = dayjs();
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
      const res: any = await GET(
        `${API.APPOINTMENTS_CALENDAR}?month=${now.format("YYYY-MM")}&tz=${encodeURIComponent(tz)}`,
        null,
      );
      if (res?.status) {
        const key = now.format("YYYY-MM-DD");
        setStats(res.data?.[key] || {});
      }
    } finally {
      setLoading(false);
    }
  };

  const today = dayjs().format("YYYY-MM-DD");
  const go = (status?: string) =>
    router.push(
      `/admin/appointments?page=1&limit=10&date=${today}&status=${status || "all"}`,
    );

  const total = stats?.count || 0;
  const items = [
    {
      key: "all",
      label: "Total",
      value: total || 0,
      color: "text-gray-600 bg-gray-50",
    },
    {
      key: "upcoming",
      label: "Upcoming",
      value: stats?.upcoming || 0,
      color: "text-blue-600 bg-blue-50",
    },
    {
      key: "attended",
      label: "Attended",
      value: stats?.attended || 0,
      color: "text-green-600 bg-green-50",
    },
    {
      key: "cancelled",
      label: "Cancelled",
      value: stats?.cancelled || 0,
      color: "text-red-600 bg-red-50",
    },
  ];

  return (
    <Card size="small" loading={loading}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-[12px] text-gray-500">Today</div>
          <div className="text-[13px] font-semibold">
            {dayjs().format("ddd, ll")}
          </div>
        </div>
          <div
          onClick={() => go("all")}
          className="cursor-pointer flex items-center gap-2"
        >
          <div className="text-right">
            <div className="text-[10px] text-gray-500 leading-tight">View all</div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {items.map((i) => (
          <div
            key={i.key}
            onClick={() => go(i.key)}
            className={`cursor-pointer rounded p-2 flex flex-col ${i.color}`}
          >
            <span className="text-[10px] leading-tight">{i.label}</span>
            <span className="text-lg font-bold leading-tight">{i.value}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default TodayAppt;
