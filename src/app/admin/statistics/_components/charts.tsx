"use client";

import { Card } from "antd";
import { dayjs } from "@/utils/common";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Filler,
  Legend,
);

const chartOptions = {
  responsive: true,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false } },
    y: { grid: { display: false }, beginAtZero: true },
  },
};

const barOptions = {
  responsive: true,
  plugins: {
    legend: { position: "bottom" as const, labels: { boxWidth: 12 } },
  },
  scales: {
    x: { grid: { display: false } },
    y: { grid: { display: false }, beginAtZero: true },
  },
};

export default function StatisticsCharts({ data }: { data: any[] }) {
  const chartData = [...data].reverse();
  const chartLabels = chartData.map((d: any) =>
    dayjs(d.date).format("DD MMM"),
  );

  const lineConfig = {
    labels: chartLabels,
    datasets: [
      {
        fill: true,
        label: "Views",
        data: chartData.map((d: any) => d.views),
        borderColor: "#D32F2F",
        backgroundColor: "rgba(211, 47, 47, 0.08)",
        tension: 0.4,
      },
    ],
  };

  const barConfig = {
    labels: chartLabels,
    datasets: [
      {
        label: "Mobile",
        data: chartData.map((d: any) => d.mobile),
        backgroundColor: "rgba(59, 130, 246, 0.7)",
        borderRadius: 4,
      },
      {
        label: "Desktop",
        data: chartData.map((d: any) => d.desktop),
        backgroundColor: "rgba(16, 185, 129, 0.7)",
        borderRadius: 4,
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card size="small" title="Views Trend">
        <Line data={lineConfig} options={chartOptions} />
      </Card>
      <Card size="small" title="Device Breakdown">
        <Bar data={barConfig} options={barOptions} />
      </Card>
    </div>
  );
}
