"use client";

import { Button } from "antd";
import { Plus } from "lucide-react";

import PageHeader from "../_components/pageHeader";

export default function UsersContainer() {
  return (
    <div>
      <PageHeader
        showBack
        title="Users"
        icon={"UsersRound"}
      >
        <Button type="primary">
          <span className="desktop-button-text">New user </span><Plus size={20}/>
        </Button>
      </PageHeader>
      <div className="dashboard-box">
      </div>
    </div>
  );
}
