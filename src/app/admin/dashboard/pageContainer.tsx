"use client";

import { Button } from "antd";
import { CalendarDays } from "lucide-react";

import PageHeader from "../_components/pageHeader";
import CalenderView from "./_components/calenderView";
import StatusCard from "./_components/statusCard";

export default function DashboardContainer() {
  return (
    <div>
      <PageHeader
        showBack
        title="Dashboard"
        subtitle="Welcome to Energy Bloom"
        icon={"LayoutGrid"}
      >
        <Button>
          23 November 2025 <CalendarDays size={15} />
        </Button>
      </PageHeader>
      <div className="dashboard-box">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap">
          <StatusCard title={"New Appointments"} icon={"ClockFading"} total={23}/>
          <StatusCard title={"Total Appointments"} icon={"List"} total={1005}/>
          <StatusCard title={"Total Patients"} icon={"FileUser"} total={100}/>
          <StatusCard title={"Total Doctors"} icon={"SquareUserRound"} total={6}/>
        </div>
        <CalenderView />
      </div>
    </div>
  );
}
