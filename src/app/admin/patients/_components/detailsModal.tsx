"use client";
import { Button, Drawer, Tag } from "antd";
import { FaUserDoctor } from "react-icons/fa6";
import { FiPaperclip } from "react-icons/fi";
import { dayjs } from "@/utils/common";
import { ViewImage } from "@/utils/viewImage";
import { feedbackLabel } from "./feedback";

const STATUS_COLORS: Record<string, string> = {
  upcoming: "blue",
  attended: "green",
  expired: "gold",
  cancelled: "red",
};

function Row({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2 py-2 border-b border-gray-100 last:border-b-0">
      <div className="w-28 shrink-0 text-[11px] uppercase tracking-wide text-gray-400">
        {label}
      </div>
      <div className="flex-1 text-[13px] text-gray-800">
        {value || <span className="text-gray-400">-</span>}
      </div>
    </div>
  );
}

function DetailsModal({
  data,
  visible,
  onCancel,
}: {
  data: any;
  visible: boolean;
  onCancel: () => void;
}) {
  const appt = data || {};

  return (
    <Drawer
      title="Appointment details"
      onClose={onCancel}
      open={visible}
      placement="right"
      size="large"
      styles={{ body: { padding: 20 } }}
      footer={
        <div className="flex items-center justify-end py-1">
          <Button size="large" onClick={onCancel}>
            Close
          </Button>
        </div>
      }
    >
      <div className="mb-4 p-3 bg-gray-50 rounded border border-gray-200">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-[12px] text-gray-500">
            {appt?.token
              ? `${dayjs(appt?.date).format("DDMM")}/${String(appt.token).padStart(2, "0")}`
              : ""}
          </span>
          <Tag
            color={STATUS_COLORS[appt?.status] || "default"}
            className="capitalize m-0!"
          >
            {appt?.status}
          </Tag>
        </div>
        <div className="mt-2 flex items-center gap-1 text-[14px] font-medium">
          <FaUserDoctor className="text-gray-400" />
          {appt?.doctor?.name || "No doctor assigned"}
          {appt?.doctor?.specialization ? (
            <span className="text-[12px] text-gray-500 font-normal">
              · {appt.doctor.specialization}
            </span>
          ) : null}
        </div>
      </div>

      <div className="border border-gray-100 rounded-lg px-3">
        <Row
          label="Patient"
          value={
            <>
              {appt?.patient?.name}
              {appt?.patient?.phone ? (
                <span className="text-gray-500"> · {appt.patient.phone}</span>
              ) : null}
            </>
          }
        />
        <Row
          label="Date"
          value={appt?.date ? dayjs(appt.date).format("lll") : null}
        />
        <Row
          label="Slot"
          value={
            appt?.slot?.startTime
              ? `${appt.slot.day} · ${appt.slot.startTime}–${appt.slot.endTime}`
              : "No slot assigned"
          }
        />
        <Row label="Fee" value={appt?.fee ?? null} />
      </div>

      {appt?.notes ? (
        <div className="mt-4">
          <div className="text-[11px] font-semibold text-gray-500 mb-1">
            Notes
          </div>
          <div className="text-[13px] text-gray-700 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">
            {appt.notes}
          </div>
        </div>
      ) : null}

      {appt?.briefing ? (
        <div className="mt-4">
          <div className="text-[11px] font-semibold text-gray-500 mb-1">
            Briefing
          </div>
          <div
            className="text-[13px] text-gray-700 bg-gray-50 p-3 rounded-lg prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: appt.briefing }}
          />
        </div>
      ) : null}

      {appt?.remark ? (
        <div className="mt-4">
          <div className="text-[11px] font-semibold text-gray-500 mb-1">
            Remark
          </div>
          <div className="text-[13px] text-gray-700 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">
            {appt.remark}
          </div>
        </div>
      ) : null}

      {Array.isArray(appt?.attachments) && appt.attachments.length ? (
        <div className="mt-4">
          <div className="text-[11px] font-semibold text-gray-500 mb-1">
            Attachments
          </div>
          <div className="flex flex-wrap gap-2">
            {appt.attachments.map((f: string, i: number) => (
              <a
                key={`${f}-${i}`}
                href={ViewImage(f)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[12px] px-2 py-1 bg-gray-50 border border-gray-200 rounded"
              >
                <FiPaperclip size={12} />
                <span className="truncate max-w-48">{f}</span>
              </a>
            ))}
          </div>
        </div>
      ) : null}

      {Array.isArray(appt?.feedback) && appt.feedback.length ? (
        <div className="mt-4">
          <div className="text-[11px] font-semibold text-gray-500 mb-1">
            Feedback
          </div>
          <div className="flex flex-wrap gap-1">
            {appt.feedback.map((v: string) => (
              <Tag key={v} color="blue">
                {feedbackLabel(v)}
              </Tag>
            ))}
          </div>
        </div>
      ) : null}
    </Drawer>
  );
}

export default DetailsModal;
