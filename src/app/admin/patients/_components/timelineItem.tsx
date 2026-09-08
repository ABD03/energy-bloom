"use client";
import { Button, Tag } from "antd";
import { dayjs } from "@/utils/common";
import { IoEyeOutline } from "react-icons/io5";
import { TfiMarkerAlt } from "react-icons/tfi";
import { FaUserDoctor } from "react-icons/fa6";

const FEEDBACK_LABELS: Record<string, string> = {
  helpful: "Helpful",
  better: "Better",
  no_improvement: "No improvement",
};

const STATUS_COLORS: Record<string, string> = {
  upcoming: "blue",
  attended: "green",
  expired: "gold",
  cancelled: "red",
};

function TimelineItem({
  appt,
  onAttend,
}: {
  appt: any;
  onAttend?: (appt: any) => void;
}) {
  return (
    <div className="bg-white p-2 rounded">
      <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
        <div className="flex gap-2 items-center">
          <div className="font-semibold">
            {appt?.date ? dayjs(appt.date).format("ll") : "-"}
          </div>
        </div>
        <div className="flex gap-2 items-center justify-end">
          <Button
            size="small"
            className="p-2! bg-green-500! text-white!"
            onClick={() => onAttend?.(appt)}
          >
            <TfiMarkerAlt /> Attend
          </Button>
          <Button size="small">
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
        {(Array.isArray(appt?.feedback) ? appt.feedback : []).map((v: string) => (
          <Tag key={v} color="blue">
            {FEEDBACK_LABELS[v] || v}
          </Tag>
        ))}
      </div>
      <div>
        <div className="px-1 flex items-center gap-1 text-[14px] font-medium">
          <div>
            <FaUserDoctor />
          </div>

          {appt?.doctor?.name || "Doctor"}
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
    </div>
  );
}

export default TimelineItem;
