"use client";
import { useEffect, useState } from "react";
import { Button, Calendar, Card } from "antd";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import type { Dayjs } from "dayjs";
import { useRouter } from "next/navigation";
import { dayjs } from "@/utils/common";

import { API } from "@/config/apis";
import { GET } from "@/utils/apiCalls";

type DayStats = {
  count: number;
  upcoming?: number;
  attended?: number;
  cancelled?: number;
};

function CalendarView() {
  const router = useRouter();
  const [month, setMonth] = useState<Dayjs>(dayjs());
  const [data, setData] = useState<Record<string, DayStats>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load(month.format("YYYY-MM"));
  }, [month]);

  const load = async (m: string) => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
      const res: any = await GET(
        `${API.APPOINTMENTS_CALENDAR}?month=${m}&tz=${encodeURIComponent(tz)}`,
        null,
      );
      if (res?.status) setData(res.data || {});
    } finally {
      setLoading(false);
    }
  };

  const dateCellRender = (value: Dayjs) => {
    if (value.month() !== month.month()) return null;
    const key = value.format("YYYY-MM-DD");
    const stats = data[key];
    if (!stats?.count) return null;
    const rows: { label: string; value: number; color: string }[] = [
      { label: "Upcoming", value: stats.upcoming || 0, color: "text-blue-600" },
      {
        label: "Attended",
        value: stats.attended || 0,
        color: "text-green-600",
      },
      {
        label: "Cancelled",
        value: stats.cancelled || 0,
        color: "text-red-600",
      },
    ].filter((r) => r.value > 0);
    return (
      <div className="flex flex-col gap-0.5 mt-1">
        {rows.map((r) => (
          <div
            key={r.label}
            className={`flex items-center justify-between text-[10px] leading-tight border p-1 rounded ${r.color}`}
          >
            <span>{r.label}</span>
            <span className="font-semibold text-[12px]">{r.value}</span>
          </div>
        ))}
      </div>
    );
  };

  const goToDate = (d: Dayjs) =>
    router.push(
      `/admin/appointments?page=1&limit=10&date=${d.format("YYYY-MM-DD")}&status=all`,
    );

  const monthDays = (() => {
    const days = month.daysInMonth();
    const rows: { day: Dayjs; key: string; stats?: DayStats }[] = [];
    for (let i = 1; i <= days; i++) {
      const day = month.date(i);
      const key = day.format("YYYY-MM-DD");
      rows.push({ day, key, stats: data[key] });
    }
    return rows;
  })();

  const header = (
    <div className="flex items-center justify-between px-2 py-2">
      <Button
        size="small"
        type="text"
        icon={<IoChevronBack size={16} />}
        onClick={() => setMonth(month.clone().subtract(1, "month"))}
      />
      <div className="font-semibold text-[13px]">
        {month.format("MMMM YYYY")}
      </div>
      <Button
        size="small"
        type="text"
        icon={<IoChevronForward size={16} />}
        onClick={() => setMonth(month.clone().add(1, "month"))}
      />
    </div>
  );

  return (
    <Card size="small" loading={loading} styles={{ body: { padding: 0 } }}>
      <div className="md:hidden">
        {header}
        <div className="divide-y divide-gray-100">
          {monthDays
            .filter((r) => r.stats?.count)
            .map((r) => (
              <div
                key={r.key}
                onClick={() => goToDate(r.day)}
                className="flex items-center justify-between px-3 py-2 cursor-pointer active:bg-gray-50"
              >
                <div>
                  <div className="text-[13px] font-semibold">
                    {r.day.format("ddd, MMM D")}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {r.stats?.upcoming ? (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 font-semibold">
                      {r.stats.upcoming}
                    </span>
                  ) : null}
                  {r.stats?.attended ? (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-50 text-green-600 font-semibold">
                      {r.stats.attended}
                    </span>
                  ) : null}
                  {r.stats?.cancelled ? (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-50 text-red-600 font-semibold">
                      {r.stats.cancelled}
                    </span>
                  ) : null}
                </div>
              </div>
            ))}
          {monthDays.every((r) => !r.stats?.count) ? (
            <div className="text-center text-[12px] text-gray-400 py-6">
              No appointments this month
            </div>
          ) : null}
        </div>
      </div>

      <div className="hidden md:block">
        <Calendar
          value={month}
          headerRender={({ value, onChange }) => (
            <div className="flex items-center justify-between px-2 py-2">
              <Button
                size="small"
                type="text"
                icon={<IoChevronBack size={16} />}
                onClick={() => {
                  const next = value.clone().subtract(1, "month");
                  onChange(next);
                  setMonth(next);
                }}
              />
              <div className="font-semibold text-[13px]">
                {value.format("MMMM YYYY")}
              </div>
              <Button
                size="small"
                type="text"
                icon={<IoChevronForward size={16} />}
                onClick={() => {
                  const next = value.clone().add(1, "month");
                  onChange(next);
                  setMonth(next);
                }}
              />
            </div>
          )}
          onPanelChange={(v) => setMonth(v)}
          onSelect={(v, info) => {
            if (info?.source === "date") {
              router.push(
                `/admin/appointments?page=1&limit=10&date=${v.format("YYYY-MM-DD")}&status=all`,
              );
            } else {
              setMonth(v);
            }
          }}
          cellRender={(current, info) =>
            info.type === "date" ? dateCellRender(current) : null
          }
        />
      </div>
    </Card>
  );
}

export default CalendarView;
