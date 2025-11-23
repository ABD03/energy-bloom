"use client";

import { Button } from "antd";
import { Plus } from "lucide-react";

import PageHeader from "../_components/pageHeader";

export default function PatientsContainer() {
  return (
    <div>
      <PageHeader
        showBack
        title="Patients"
        icon={"FileUser"}
      >
        <Button type="primary">
          <span className="desktop-button-text">New Patient </span><Plus size={20}/>
        </Button>
      </PageHeader>
      <div className="dashboard-box">
      </div>
    </div>
  );
}
