"use client";

import { useState } from "react";
import { Button } from "antd";
import { Plus } from "lucide-react";

import PageHeader from "../_components/pageHeader";
import Filters from "./_components/filter";
import DataTable from "./_components/dataTable";

import Data from "./data.json";
import FormModal from "./_components/formModal";

export default function PatientsContainer() {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <PageHeader showBack title="Patients" icon={"FileUser"}>
        <Button type="primary" onClick={()=>setVisible(true)}>
          <span className="desktop-button-text">New Patient </span>
          <Plus size={20} />
        </Button>
      </PageHeader>
      <div className="dashboard-box  m-3 mt-0">
        <Filters />
        <DataTable data={Data} />
      </div>
      {visible ? (
        <FormModal visible={visible} onCancel={() => setVisible(false)} />
      ) : null}
    </div>
  );
}
