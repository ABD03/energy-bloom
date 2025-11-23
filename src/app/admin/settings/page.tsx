"use client";

import PageHeader from "../_components/pageHeader";

export default function SettingsContainer() {
  return (
    <div>
      <PageHeader
        showBack
        title="Settings"
        icon={"Settings"}
      >
      </PageHeader>
      <div className="dashboard-box">
      </div>
    </div>
  );
}
