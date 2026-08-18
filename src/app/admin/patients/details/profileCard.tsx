"use client";
import { Avatar, Descriptions, Tag } from "antd";
import { dayjs } from "@/utils/common";
import { ViewImage } from "@/utils/viewImage";

const getAge = (dob: any) => {
  if (!dob) return null;
  const d = dayjs(dob);
  if (!d.isValid()) return null;
  return dayjs().diff(d, "year");
};

function ProfileCard({ patient }: { patient: any }) {
  if (!patient) return null;
  return (
    <div className="flex items-start gap-4 bg-white border border-gray-200 rounded p-4">
      <Avatar size={80} src={ViewImage(patient?.image)}>
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
            <span className="capitalize">{patient?.gender || "-"}</span>
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
            {patient?.createdAt ? dayjs(patient.createdAt).format("ll") : "-"}
          </Descriptions.Item>
        </Descriptions>
      </div>
    </div>
  );
}

export default ProfileCard;
