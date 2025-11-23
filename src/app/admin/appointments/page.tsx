"use client";

import { Button } from "antd";
import { Plus } from "lucide-react";

import PageHeader from "../_components/pageHeader";

export default function AppointmentsContainer() {
  return (
    <div>
      <PageHeader
        showBack
        title="Appointments"
        icon={"CalendarCheck"}
      >
        <Button type="primary">
          <span className="desktop-button-text">New Appointment </span><Plus size={20}/>
        </Button>
      </PageHeader>
      <div className="dashboard-box">
      </div>
    </div>
  );
}
