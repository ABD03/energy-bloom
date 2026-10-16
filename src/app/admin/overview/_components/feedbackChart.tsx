"use client";
import { useEffect, useState } from "react";
import { Card } from "antd";
import { Doughnut } from "react-chartjs-2";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";

import { API } from "@/config/apis";
import { GET } from "@/utils/apiCalls";
import { FEEDBACK } from "../../patients/_components/feedback";

ChartJS.register(ArcElement, Legend, Tooltip);

// Same colours as the per-client feedback donut.
const COLORS: Record<string, string> = {
  helpful: "#22c55e",
  better: "#3b82f6",
  no_improvement: "#ef4444",
};

// Attended appointments where no feedback was recorded.
const NO_FEEDBACK_COLOR = "#9ca3af";

function FeedbackChart() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [noFeedback, setNoFeedback] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      // No filter -> counts across every client's appointments.
      const res: any = await GET(API.APPOINTMENTS_STATS, null);
      if (res?.status) {
        setCounts(res.data?.byFeedback || {});
        setNoFeedback(res.data?.noFeedback || 0);
      }
    } finally {
      setLoading(false);
    }
  };

  const items = [
    ...FEEDBACK.map((f) => ({
      key: f.value as string,
      label: f.label as string,
      emoji: f.emoji as string,
      color: COLORS[f.value],
      count: counts[f.value] || 0,
    })),
    {
      key: "none",
      label: "No feedback",
      emoji: "",
      color: NO_FEEDBACK_COLOR,
      count: noFeedback,
    },
  ];
  const total = items.reduce((sum, i) => sum + i.count, 0);

  const chartData =
    total > 0
      ? {
          labels: items.map((i) => `${i.label} ${i.emoji}`.trim()),
          datasets: [
            {
              data: items.map((i) => i.count),
              backgroundColor: items.map((i) => i.color),
              borderWidth: 0,
              hoverOffset: 4,
            },
          ],
        }
      : {
          labels: ["No appointments yet"],
          datasets: [
            { data: [1], backgroundColor: ["#e5e7eb"], borderWidth: 0 },
          ],
        };

  return (
    <Card
      size="small"
      loading={loading}
      title="Client feedback"
      className="h-full"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4 sm:gap-6">
        <div className="relative mx-auto" style={{ width: 160, height: 160 }}>
          <Doughnut
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              cutout: "70%",
              plugins: {
                legend: { display: false },
                tooltip: { enabled: total > 0 },
              },
            }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[11px] text-gray-500 leading-tight">
              Total
            </span>
            <span className="text-2xl font-bold leading-tight">{total}</span>
          </div>
        </div>

        <div className="w-full min-w-0 flex flex-col gap-1.5">
          {items.map((i) => {
            const n = i.count;
            const pct = total ? Math.round((n / total) * 100) : 0;
            return (
              <div
                key={i.key}
                className="flex items-center justify-between gap-3 text-[13px]"
              >
                <span className="flex items-center gap-2 min-w-0">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ background: i.color }}
                  />
                  <span className="text-gray-600">
                    {i.label} {i.emoji}
                  </span>
                </span>
                <span className="font-semibold text-gray-800 whitespace-nowrap">
                  {n}
                  <span className="ml-1 text-[11px] font-normal text-gray-400">
                    {pct}%
                  </span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

export default FeedbackChart;
