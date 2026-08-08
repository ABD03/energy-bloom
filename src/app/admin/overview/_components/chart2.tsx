"use client";

import { Button, Card } from "antd";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
ChartJS.register(ArcElement, Tooltip, Legend);
export default function Chart2(props: any) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
      },
    },
  };

  const data = {
    labels: ["Mobile", "Computer", "Tablet"],
    datasets: [
      {
        label: "OS",
        data: [
          Number(props?.data?.mobile || 0),
          Number(props?.data?.desktop || 0),
          0,
        ],
        backgroundColor: ["#c7d2fe", "#fde68a", "#bbf7d0"],
        borderColor: ["#6366f1", "#f59e0b", "#22c55e"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Card size="small" title="Today Platform Engagement" loading={props?.loading}>
      <div className="h-67.5 mt-2.5">
        <Pie data={data} options={options} />
      </div>
    </Card>
  );
}
