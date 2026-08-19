"use client";
import { Avatar, Tag } from "antd";
import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiCalendar,
  FiUser,
  FiDroplet,
} from "react-icons/fi";
import { dayjs } from "@/utils/common";
import { ViewImage } from "@/utils/viewImage";

const getAge = (dob: any) => {
  if (!dob) return null;
  const d = dayjs(dob);
  if (!d.isValid()) return null;
  return dayjs().diff(d, "year");
};

function Row({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2 py-2 border-b border-gray-100 last:border-b-0">
      <span className="text-gray-400 mt-0.5">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] uppercase tracking-wide text-gray-400">
          {label}
        </div>
        <div className="text-[13px] text-gray-800 break-words">
          {value || <span className="text-gray-400">-</span>}
        </div>
      </div>
    </div>
  );
}

function ProfileCard({ patient }: { patient: any }) {
  if (!patient) return null;
  const age = getAge(patient?.dob);

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs mb-2">
      <div className="bg-gradient-to-br from-primary/10 to-primary/0 p-4 flex flex-col items-center text-center">
        <Avatar
          size={92}
          src={ViewImage(patient?.image)}
          className="border-4 border-white shadow-sm"
        >
          {patient?.name?.[0]}
        </Avatar>
        <div className="mt-3 text-lg font-semibold leading-tight">
          {patient?.name}
        </div>
        <div className="flex items-center gap-2 mt-1.5 flex-wrap justify-center">
          {patient?.patientId ? (
            <Tag className="font-mono text-[11px]!">{patient.patientId}</Tag>
          ) : null}
          <Tag
            color={patient?.status ? "green" : "red"}
            className="text-[11px]!"
          >
            {patient?.status ? "Active" : "Blocked"}
          </Tag>
        </div>
      </div>

      <div className="px-4">
        <Row
          icon={<FiPhone size={14} />}
          label="Phone"
          value={patient?.phone}
        />
        <Row icon={<FiMail size={14} />} label="Email" value={patient?.email} />
        <div className="grid grid-cols-2 py-2 border-b border-gray-100 divide-x divide-gray-100">
          <div className="flex items-start gap-2 pr-3">
            <span className="text-gray-400 mt-0.5">
              <FiUser size={14} />
            </span>
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-wide text-gray-400">
                Gender
              </div>
              <div className="text-[13px] text-gray-800 capitalize">
                {patient?.gender || (
                  <span className="text-gray-400 normal-case">-</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-start gap-2 pl-3">
            <span className="text-gray-400 mt-0.5">
              <FiDroplet size={14} />
            </span>
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-wide text-gray-400">
                Blood Group
              </div>
              <div className="text-[13px] text-gray-800">
                {patient?.bloodGroup || (
                  <span className="text-gray-400">-</span>
                )}
              </div>
            </div>
          </div>
        </div>
        <Row
          icon={<FiCalendar size={14} />}
          label="Age / DOB"
          value={
            patient?.dob
              ? `${age ?? "-"} yrs · ${dayjs(patient.dob).format("ll")}`
              : null
          }
        />
        <Row
          icon={<FiMapPin size={14} />}
          label="Address"
          value={patient?.address}
        />
      </div>

      {patient?.createdAt ? (
        <div className="px-4 py-2 border-t border-gray-100 text-[10px] text-gray-400 text-center">
          Registered {dayjs(patient.createdAt).format("ll")}
        </div>
      ) : null}
    </div>
  );
}

export default ProfileCard;
