"use client";

import { useState } from "react";
import { Button } from "antd";
import { Plus } from "lucide-react";

import PageHeader from "../../_components/pageHeader";

export default function PatientsDetailsContainer() {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <PageHeader showBack title="Patients" subtitle={"Details"} icon={"FileUser"}>
        <Button type="primary" onClick={() => setVisible(true)}>
          <span className="desktop-button-text">New Appointment</span>
          <Plus size={20} />
        </Button>
      </PageHeader>
      <div className="dashboard-box  m-3 mt-0"></div>
    </div>
  );
}
