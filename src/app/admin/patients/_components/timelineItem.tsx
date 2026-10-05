"use client";
import { useState } from "react";
import { Button, Tag } from "antd";
import { dayjs } from "@/utils/common";
import {
  IoAlertCircle,
  IoCheckmarkCircle,
  IoCloseCircle,
  IoEyeOutline,
  IoTime,
} from "react-icons/io5";
import { TfiMarkerAlt } from "react-icons/tfi";
import { FaUserDoctor } from "react-icons/fa6";
import DetailsModal from "./detailsModal";
import { feedbackLabel } from "./feedback";

const STATUS_COLORS: Record<string, string> = {
  upcoming: "blue",
  attended: "green",
  expired: "gold",
  cancelled: "red",
};

const STATUS_ICONS: Record<string, { icon: React.ReactNode; color: string }> = {
  upcoming: { icon: <IoTime />, color: "text-blue-500" },
  attended: { icon: <IoCheckmarkCircle />, color: "text-green-500" },
  cancelled: { icon: <IoCloseCircle />, color: "text-red-500" },
  expired: { icon: <IoAlertCircle />, color: "text-amber-500" },
};

function TimelineItem({
  appt,
  onAttend,
}: {
  appt: any;
  onAttend?: (appt: any) => void;
}) {
  const [viewOpen, setViewOpen] = useState(false);

  return (
    <div className="bg-white p-2 rounded">
      <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
        <div className="flex gap-2 items-center">
          <div className="font-semibold flex items-center gap-1.5">
            {appt?.date ? dayjs(appt.date).format("ll") : "-"}
            {STATUS_ICONS[appt?.status] ? (
              <span
                title={appt.status}
                className={`text-[16px] capitalize ${STATUS_ICONS[appt.status].color}`}
              >
                {STATUS_ICONS[appt.status].icon}
              </span>
            ) : null}
          </div>
        </div>
        <div className="flex gap-2 items-center justify-end">
          <Button
            size="small"
            className={
              appt?.status === "attended"
                ? "p-2!"
                : "p-2! bg-green-500! text-white!"
            }
            onClick={() => onAttend?.(appt)}
          >
            <TfiMarkerAlt />
            {appt?.status === "attended" ? "Edit" : "Attend"}
          </Button>
          <Button size="small" onClick={() => setViewOpen(true)}>
            <IoEyeOutline />
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-2 py-2 mb-2">
        <Tag>
          {appt?.slot?.startTime
            ? `${appt.slot.day} ${appt.slot.startTime}–${appt.slot.endTime}`
            : "No slot assigned"}
        </Tag>
        <Tag
          color={STATUS_COLORS[appt?.status] || "default"}
          className="capitalize m-0!"
        >
          {appt?.status}
        </Tag>
        {(Array.isArray(appt?.feedback) ? appt.feedback : []).map(
          (v: string) => (
            <Tag key={v} color="blue">
              {feedbackLabel(v)}
            </Tag>
          ),
        )}
      </div>
      <div>
        <div className="px-1 flex items-center gap-1 text-[14px] font-medium">
          <div>
            <FaUserDoctor />
          </div>

          {appt?.doctor?.name || "Doctor"}
          {appt?.fee ? (
            <span className="ml-auto text-[13px] font-semibold text-gray-700">
              ₹{appt.fee}
            </span>
          ) : null}
        </div>
        {appt?.notes ? (
          <div className="mt-2 border border-gray-200 p-2 rounded-lg">
            <div className="text-[11px] font-semibold text-gray-500">Notes</div>
            <div className="text-[12px] text-gray-700 whitespace-pre-wrap">
              {appt.notes}
            </div>
          </div>
        ) : null}

        {appt?.remark ? (
          <div className="mt-2 border border-gray-200 p-2 rounded-lg">
            <div className="text-[11px] font-semibold text-gray-500">
              Remark
            </div>
            <div className="text-[12px] text-gray-700 whitespace-pre-wrap">
              {appt.remark}
            </div>
          </div>
        ) : null}
      </div>
      {viewOpen ? (
        <DetailsModal
          data={appt}
          visible={viewOpen}
          onCancel={() => setViewOpen(false)}
        />
      ) : null}
    </div>
  );
}

export default TimelineItem;
