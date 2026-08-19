"use client";
import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";

import { API } from "@/config/apis";
import { GET } from "@/utils/apiCalls";

ChartJS.register(ArcElement, Legend, Tooltip);

type Props = {
  patientId?: string | null;
};

type Stats = {
  total: number;
  byStatus: Record<string, number>;
  byFeedback: Record<string, number>;
};

const STATUS_TILES = [
  { key: "upcoming", label: "Upcoming", color: "text-blue-600 bg-blue-50" },
  { key: "attended", label: "Attended", color: "text-green-600 bg-green-50" },
  { key: "cancelled", label: "Cancelled", color: "text-red-600 bg-red-50" },
  { key: "expired", label: "Expired", color: "text-amber-600 bg-amber-50" },
];

const FEEDBACK_TILES = [
  {
    key: "helpful",
    label: "Helpful",
    color: "text-green-700 bg-green-50",
    dot: "#22c55e",
  },
  {
    key: "better",
    label: "Better",
    color: "text-blue-700 bg-blue-50",
    dot: "#3b82f6",
  },
  {
    key: "no_improvement",
    label: "No improve",
    color: "text-red-700 bg-red-50",
    dot: "#ef4444",
  },
];

function Statics({ patientId }: Props) {
  const [data, setData] = useState<Stats>({
    total: 0,
    byStatus: {},
    byFeedback: {},
  });

  useEffect(() => {
    if (!patientId) return;
    (async () => {
      const res: any = await GET(
        `${API.APPOINTMENTS_STATS}?patient=${patientId}`,
        null,
      );
      if (res?.status) setData(res.data);
    })();
  }, [patientId]);

  const feedbackTotal = Object.values(data.byFeedback || {}).reduce(
    (a: number, b: any) => a + (Number(b) || 0),
    0,
  );

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs mb-2">
      <div className="px-4 pt-3 text-[13px] font-semibold">Feedback</div>
      <div className="p-3 flex items-center gap-2">
        <div className="relative shrink-0" style={{ width: 156, height: 126 }}>
          <Doughnut
            data={
              feedbackTotal > 0
                ? {
                    labels: FEEDBACK_TILES.map((t) => t.label),
                    datasets: [
                      {
                        data: FEEDBACK_TILES.map(
                          (t) => data.byFeedback?.[t.key] || 0,
                        ),
                        backgroundColor: FEEDBACK_TILES.map((t) => t.dot),
                        borderWidth: 0,
                        hoverOffset: 4,
                      },
                    ],
                  }
                : {
                    labels: ["No data"],
                    datasets: [
                      {
                        data: [1],
                        backgroundColor: ["#e5e7eb"],
                        borderWidth: 0,
                      },
                    ],
                  }
            }
            options={{
              responsive: true,
              maintainAspectRatio: false,
              cutout: "70%",
              plugins: {
                legend: { display: false },
                tooltip: { enabled: feedbackTotal > 0 },
              },
            }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] text-gray-500 leading-tight">
              Total
            </span>
            <span className="text-base font-bold leading-tight">
              {feedbackTotal}
            </span>
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-1">
          {FEEDBACK_TILES.map((t) => (
            <div
              key={t.key}
              className="flex items-center justify-between text-[12px]"
            >
              <span className="flex items-center gap-1.5">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ background: t.dot }}
                />
                <span className="text-gray-600">{t.label}</span>
              </span>
              <span className="font-semibold text-gray-800">
                {data.byFeedback?.[t.key] || 0}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between px-4 pt-3 border-t border-gray-100">
        <div className="text-[13px] font-semibold">Appointments</div>
        <div className="text-[11px] text-gray-500">
          Total{" "}
          <span className="font-semibold text-gray-800">{data.total || 0}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 p-3">
        {STATUS_TILES.map((t) => (
          <div key={t.key} className={`rounded p-2 ${t.color}`}>
            <div className="text-[10px] leading-tight">{t.label}</div>
            <div className="text-base font-bold leading-tight">
              {data.byStatus?.[t.key] || 0}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Statics;
