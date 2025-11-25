"use client";

import { useState } from "react";
import { Avatar, Button, Card, DatePicker, Steps, Tag } from "antd";
import { Plus, SquarePen, CircleCheck, Clock8, CircleX } from "lucide-react";

import PageHeader from "../../_components/pageHeader";
import HistoryItem from "../_components/historyItem";

import History from "../history.json";
import AttendModal from "../../appointments/_components/attendModal";

export default function PatientsDetailsContainer() {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <PageHeader
        showBack
        title="Patients"
        subtitle={"Details"}
        icon={"FileUser"}
      >
        <Button type="primary" onClick={() => setVisible(true)}>
          <span className="desktop-button-text">New Appointment</span>
          <Plus size={20} />
        </Button>
      </PageHeader>
      <div className="dashboard-box  m-3 mt-0">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1">
            <Card
              title="Patient Details"
              size="small"
              extra={
                <Button type="text" size="small">
                  <SquarePen size={15} />
                </Button>
              }
            >
              <div className="flex flex-col items-center border-b border-b-gray-200 pb-4 mb-4">
                <Avatar
                  size={100}
                  src="https://www.livemint.com/lm-img/img/2024/05/23/600x338/CRICKET-IND-IPL-T20-HYDERABAD-KOLKATA-95_1716427886047_1716427965399.jpg"
                />
                <h1 className="text-2xl font-semibold mt-2 mb-3">John Doe</h1>
                <div>
                  <Tag variant="outlined">Male</Tag>{" "}
                  <Tag variant="outlined">26 years</Tag>
                </div>
              </div>
              <div className="mb-4">
                <div className="text-xs text-gray-500">Contact Number</div>
                <div>+91 1234567890</div>
              </div>
              <div className="mb-4">
                <div className="text-xs text-gray-500">Email Address</div>
                <div>6Hr8o@example.com</div>
              </div>
              <div className="mb-4">
                <div className="text-xs text-gray-500">Address</div>
                <div>123 Main St, Anytown, USA</div>
              </div>
              <div className="mb-2">
                <div className="text-xs text-gray-500">Registerd On</div>
                <div>2022-01-01</div>
              </div>
            </Card>
          </div>
          <Card
            title="History"
            size="small"
            className="md:col-span-3"
            extra={<DatePicker placeholder="Filter Date" size="small" />}
          >
            <Steps
              orientation="vertical"
              current={2}
              items={History?.map((item: any) => ({
                title: (
                  <div className="text-lg font-bold text-black">
                    {item?.date} - {item?.time}
                  </div>
                ),
                icon:
                  item?.status === "pending" ? (
                    <Clock8 color="orange" />
                  ) : item?.status === "canceled" ? (
                    <CircleX color="red" />
                  ) : (
                    <CircleCheck color="green" />
                  ),
                content: (
                  <HistoryItem item={item} onClick={() => setVisible(true)} />
                ),
              }))}
            />
          </Card>
        </div>
      </div>
      {visible ? (
        <AttendModal visible={visible} onCancel={() => setVisible(false)} />
      ) : null}
    </div>
  );
}
