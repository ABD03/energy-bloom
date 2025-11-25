import React from "react";
import { Card } from "antd";

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const Graph = (props: any) => {
  const data = {
    labels: ["Pending", "Attended", "Canceled"],
    datasets: [
      {
        data: [20, 20, 10],
        backgroundColor: ["#824ff8", "#af95f0", "#e8e8e8"],
        borderWidth: 0,
        cutout: "70%",
        borderRadius: 6,
        spacing: 4,
      },
    ],
  };

  const options = {
    rotation: -90,
    circumference: 180,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
  };

  return (
    <Card
      size="small"
      title="Appointments status"
      extra={<div>Total : 10000</div>}
    >
      <div style={{ width: "300px", margin: "auto", height: "150px" }}>
        <Doughnut data={data} options={options} />
        <div
          style={{
            textAlign: "center",
            marginTop: "-50px",
            fontSize: "24px",
            fontWeight: "bold",
          }}
        >
          65%
        </div>
      </div>
    </Card>
  );
};

export default Graph;
