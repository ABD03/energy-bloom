"use client";

import { Button } from "antd";
import { Plus } from "lucide-react";

import PageHeader from "../_components/pageHeader";

export default function DoctorsContainer() {
  return (
    <div>
      <PageHeader
        showBack
        title="Doctors"
        icon={"SquareUserRound"}
      >
        <Button type="primary">
          <span className="desktop-button-text">New doctors </span><Plus size={20}/>
        </Button>
      </PageHeader>
      <div className="dashboard-box">
      </div>
    </div>
  );
}
