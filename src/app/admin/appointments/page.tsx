"use client";

import { useState } from "react";
import { Button } from "antd";
import { Plus } from "lucide-react";

import PageHeader from "../_components/pageHeader";
import Filters from "./_components/filter";
import DataTable from "./_components/dataTable";
import FormModal from "./_components/formModal";
import AttendModal from "./_components/attendModal";

import Data from "./data.json";

export default function AppointmentsContainer() {
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  return (
    <div>
      <PageHeader showBack title="Appointments" icon={"CalendarCheck"}>
        <Button type="primary" onClick={() => setVisible(true)}>
          <span className="desktop-button-text">New Appointment </span>
          <Plus size={20} />
        </Button>
      </PageHeader>
      <div className="dashboard-box m-3 mt-0">
        <Filters />
        <DataTable data={Data} onClick={() => setVisible2(true)} />
      </div>
      {visible ? (
        <FormModal visible={visible} onCancel={() => setVisible(false)} />
      ) : null}
      {visible2 ? (
        <AttendModal visible={visible2} onCancel={() => setVisible2(false)} />
      ) : null}
    </div>
  );
}
