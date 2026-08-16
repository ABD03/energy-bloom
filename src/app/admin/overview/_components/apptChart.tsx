"use client";
import { useEffect, useMemo, useState } from "react";
import { Card } from "antd";
import type { Dayjs } from "dayjs";
import { Line } from "react-chartjs-2";
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { dayjs } from "@/utils/common";

import { API } from "@/config/apis";
import { GET } from "@/utils/apiCalls";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Legend,
  Tooltip,
);

type DayStats = {
  count: number;
  upcoming?: number;
  attended?: number;
  cancelled?: number;
};

function ApptChart() {
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

  const { labels, upcoming, attended, cancelled } = useMemo(() => {
    const days = month.daysInMonth();
    const labels: string[] = [];
    const upcoming: number[] = [];
    const attended: number[] = [];
    const cancelled: number[] = [];
    for (let d = 1; d <= days; d++) {
      const day = month.date(d);
      const key = day.format("YYYY-MM-DD");
      const s = data[key];
      labels.push(String(d));
      upcoming.push(s?.upcoming || 0);
      attended.push(s?.attended || 0);
      cancelled.push(s?.cancelled || 0);
    }
    return { labels, upcoming, attended, cancelled };
  }, [data, month]);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Upcoming",
        data: upcoming,
        borderColor: "#3b82f6",
        backgroundColor: "#3b82f6",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
        tension: 0.35,
        fill: false,
      },
      {
        label: "Attended",
        data: attended,
        borderColor: "#22c55e",
        backgroundColor: "#22c55e",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
        tension: 0.35,
        fill: false,
      },
      {
        label: "Cancelled",
        data: cancelled,
        borderColor: "#ef4444",
        backgroundColor: "#ef4444",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
        tension: 0.35,
        fill: false,
      },
    ],
  };

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: { position: "bottom" },
      tooltip: { enabled: true },
    },
    scales: {
      x: { grid: { color: "rgba(0,0,0,0.05)" }, border: { display: false } },
      y: {
        beginAtZero: true,
        ticks: { precision: 0 },
        grid: { color: "rgba(0,0,0,0.05)" },
        border: { display: false },
      },
    },
  };

  return (
    <Card size="small" loading={loading} title={`Appointments · ${month.format("MMM YYYY")}`}>
      <div style={{ height: 260 }}>
        <Line data={chartData} options={options} />
      </div>
    </Card>
  );
}

export default ApptChart;
