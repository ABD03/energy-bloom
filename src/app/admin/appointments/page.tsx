"use client";

import { Button } from "antd";
import { Plus } from "lucide-react";

import PageHeader from "../_components/pageHeader";
import Filters from "./_components/filter";
import DataTable from "./_components/dataTable";
import FormModal from "./_components/formModal";

import Data from "./data.json";

export default function AppointmentsContainer() {
  return (
    <div>
      <PageHeader showBack title="Appointments" icon={"CalendarCheck"}>
        <Button type="primary">
          <span className="desktop-button-text">New Appointment </span>
          <Plus size={20} />
        </Button>
      </PageHeader>
      <div className="dashboard-box m-3 mt-0">
        <Filters />
        <DataTable data={Data} />
      </div>
      <FormModal />
    </div>
  );
}
