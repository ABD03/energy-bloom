"use client";

import { Button, Card } from "antd";
import { FiArrowUpRight } from "react-icons/fi";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import Link from "next/link";
import { Line } from "react-chartjs-2";

export default function Chart1(props: any) {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
  );

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: "top" as const,
      },
      title: {
        display: false,
      },
    },
    tooltip: {
      backgroundColor: "#fffff",
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
        },
      },
    },
  };

  var labels = ["10-12-24", "10-12-24", "10-12-24", "10-12-24", "10-12-24"];
  var data = [133, 221, 783, 2078, 1039];

  labels = props?.data?.map((item: any) => {
    const date = new Date(item.day);
    return date.toLocaleDateString("en-GB"); // DD/MM/YYYY
  });

  data = props?.data?.map((item: any) => item.views);
  const configs = {
    labels,
    datasets: [
      {
        fill: true,
        label: "Visits",
        data: data,
        borderColor: "#3bd457",
        backgroundColor: (context: any) => {
          const { chart } = context;
          const { ctx, chartArea } = chart;
          if (!chartArea) return null;
          const gradient = ctx.createLinearGradient(
            0,
            chartArea.top,
            0,
            chartArea.bottom,
          );
          gradient.addColorStop(0, "rgba(59, 212, 87, 0.35)");
          gradient.addColorStop(1, "rgba(59, 212, 87, 0.1)");
          return gradient;
        },
        tension: 0.4,
      },
    ],
  };

  return (
    <Link href="/admin/statistics" className="block group">
      <Card
        size="small"
        title={"Last 7 days traffic"}
        loading={props?.loading}
        hoverable
        extra={
          <Button
            type="text"
            size="small"
            icon={<FiArrowUpRight size={14} />}
            className="text-primary! group-hover:translate-x-0.5 transition-transform"
          >
            View all
          </Button>
        }
      >
        <div>
          <Line options={options} data={configs} />
        </div>
      </Card>
    </Link>
  );
}
