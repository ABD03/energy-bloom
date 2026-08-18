"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button, message, Tabs } from "antd";
import { IoMdAdd } from "react-icons/io";
import { MdOutlineEditNote } from "react-icons/md";

import PageHeader from "../../_components/pageHeader";
import Loading from "../../_components/loading";
import Empty from "../../_components/empty";
import TimelineTab from "./timeline";
import HistoryTab from "./history";
import FormModal from "./formModal";
import ProfileCard from "./profileCard";
import AppointmentFormModal from "../../appointments/_components/formModal";
import PatientFormModal from "../_components/formModal";
import { UseAppSelector } from "@/redux/util/hooks";

import { API } from "@/config/apis";
import { GET } from "@/utils/apiCalls";

export default function PatientDetails() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>({});
  const [attendItem, setAttendItem] = useState<any>(null);
  const [newAppt, setNewAppt] = useState(false);
  const [editPatient, setEditPatient] = useState(false);
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
      >
        {patient ? (
          <Button
            type="primary"
            onClick={() => setEditPatient(true)}
            icon={<MdOutlineEditNote size={18} />}
          >
            <span className="text-[12px] hidden md:inline">Edit patient</span>
          </Button>
        ) : null}
      </PageHeader>
      <div className="h-[92vh] overflow-y-auto overflow-x-hidden pb-[7vh]">
        {loading ? (
          <Loading />
        ) : !patient ? (
          <Empty />
        ) : (
          <div className="p-4 space-y-6">
            <ProfileCard patient={patient} />

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
            {editPatient ? (
              <PatientFormModal
                user={Auth?.user}
                data={patient}
                visible={editPatient}
                onCancel={() => setEditPatient(false)}
                onchange={() => load()}
              />
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
