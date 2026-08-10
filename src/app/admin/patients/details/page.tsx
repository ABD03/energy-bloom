"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Avatar, Button, Descriptions, message, Tabs, Tag } from "antd";
import { IoMdAdd } from "react-icons/io";

import PageHeader from "../../_components/pageHeader";
import Loading from "../../_components/loading";
import Empty from "../../_components/empty";
import TimelineTab from "./timeline";
import HistoryTab from "./history";
import FormModal from "./formModal";
import AppointmentFormModal from "../../appointments/_components/formModal";
import { UseAppSelector } from "@/redux/util/hooks";

import { API } from "@/config/apis";
import { GET } from "@/utils/apiCalls";
import { dayjs } from "@/utils/common";
import { ViewImage } from "@/utils/viewImage";

const getAge = (dob: any) => {
  if (!dob) return null;
  const d = dayjs(dob);
  if (!d.isValid()) return null;
  return dayjs().diff(d, "year");
};

export default function PatientDetails() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>({});
  const [attendItem, setAttendItem] = useState<any>(null);
  const [newAppt, setNewAppt] = useState(false);
  const Auth = UseAppSelector((state: any) => state?.Auth);

  useEffect(() => {
    if (id) load();
  }, [id]);

  const load = async () => {
    try {
      setLoading(true);
      const [pRes, aRes]: any = await Promise.all([
        GET(`${API.PATIENTS_DETAILS}?id=${id}`, null),
        GET(`${API.APPOINTMENTS}?patient=${id}&page=1&limit=50`, null),
      ]);
      if (pRes?.status) setPatient(pRes.data);
      else message.error(pRes?.message || "Patient not found");
      if (aRes?.status) {
        setAppointments(aRes.data);
        setMeta(aRes.meta);
      }
    } catch (err) {
      message.error("oops.something gone wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title={"Patient details"}
        icon={"PiUsersThree"}
        showBack={true}
        showMenu={false}
        showMobileBack={true}
        showMobileMenu={false}
      />
      <div className="h-[92vh] overflow-y-auto overflow-x-hidden pb-[7vh]">
        {loading ? (
          <Loading />
        ) : !patient ? (
          <Empty />
        ) : (
          <div className="p-4 space-y-6">
            <div className="flex items-start gap-4 bg-white border border-gray-200 rounded p-4">
              <Avatar
                size={80}
                src={ViewImage(patient?.image)}
              >
                {patient?.name?.[0]}
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="text-xl font-semibold">{patient?.name}</div>
                  {patient?.patientId ? (
                    <Tag className="font-mono">{patient.patientId}</Tag>
                  ) : null}
                  <Tag color={patient?.status ? "green" : "red"}>
                    {patient?.status ? "Active" : "Blocked"}
                  </Tag>
                </div>
                <div className="text-[12px] text-gray-500 mt-1">
                  {patient?.phone} {patient?.email ? ` · ${patient.email}` : ""}
                </div>
                <Descriptions
                  size="small"
                  column={{ xs: 1, sm: 2, md: 3 }}
                  className="mt-4"
                >
                  <Descriptions.Item label="Gender">
                    <span className="capitalize">
                      {patient?.gender || "-"}
                    </span>
                  </Descriptions.Item>
                  <Descriptions.Item label="Age">
                    {getAge(patient?.dob) ?? "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Blood Group">
                    {patient?.bloodGroup || "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Date of Birth">
                    {patient?.dob ? dayjs(patient.dob).format("ll") : "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Address" span={2}>
                    {patient?.address || "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Created">
                    {patient?.createdAt
                      ? dayjs(patient.createdAt).format("ll")
                      : "-"}
                  </Descriptions.Item>
                </Descriptions>
              </div>
            </div>

            <Tabs
              defaultActiveKey="timeline"
              tabBarExtraContent={
                <Button
                  type="primary"
                  onClick={() => setNewAppt(true)}
                  className="p-2!"
                >
                  <IoMdAdd size={20} />
                </Button>
              }
              items={[
                {
                  key: "timeline",
                  label: `Timeline (${meta?.total || 0})`,
                  children: (
                    <TimelineTab
                      data={appointments}
                      onAttend={(a) => setAttendItem(a)}
                    />
                  ),
                },
                {
                  key: "history",
                  label: "History",
                  children: (
                    <HistoryTab
                      data={appointments}
                      loading={false}
                      onAttend={(a) => setAttendItem(a)}
                    />
                  ),
                },
              ]}
            />
            {attendItem ? (
              <FormModal
                data={attendItem}
                visible={!!attendItem}
                onCancel={() => setAttendItem(null)}
                onchange={() => load()}
              />
            ) : null}
            {newAppt ? (
              <AppointmentFormModal
                user={Auth?.user}
                data={{ patient }}
                visible={newAppt}
                onCancel={() => setNewAppt(false)}
                onchange={() => load()}
              />
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
