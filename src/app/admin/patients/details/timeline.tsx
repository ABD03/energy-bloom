"use client";
import { Button, Tag, Timeline } from "antd";
import { FiPaperclip } from "react-icons/fi";
import Empty from "../../_components/empty";
import { dayjs } from "@/utils/common";
import { ViewImage } from "@/utils/viewImage";

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

const DOT_COLORS: Record<string, string> = {
  upcoming: "blue",
  attended: "green",
  expired: "orange",
  cancelled: "red",
};

function TimelineTab({
  data = [] as any[],
  onAttend,
}: {
  data?: any[];
  onAttend?: (appt: any) => void;
}) {
  if (!data.length) return <Empty />;

  const items = data.map((appt: any) => ({
    color: DOT_COLORS[appt?.status] || "gray",
    content: (
      <div className="pb-2 flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-[12px] text-gray-500">
              {appt?.token
                ? `${dayjs(appt?.date).format("DDMM")}/${String(appt.token).padStart(2, "0")}`
                : ""}
            </span>
            <span className="font-semibold text-[13px]">
              {appt?.doctor?.name || "Doctor"}
            </span>
            {appt?.doctor?.specialization ? (
              <span className="text-[11px] text-gray-500">
                · {appt.doctor.specialization}
              </span>
            ) : null}
            <Tag
              color={STATUS_COLORS[appt?.status] || "default"}
              className="capitalize ml-1"
            >
              {appt?.status}
            </Tag>
          </div>
          <div className="text-[12px] text-gray-600 mt-0.5">
            {appt?.date ? dayjs(appt.date).format("lll") : "-"}
            {appt?.slot?.startTime
              ? ` · ${appt.slot.day} ${appt.slot.startTime}–${appt.slot.endTime}`
              : ""}
          </div>
          {appt?.notes ? (
            <div className="text-[12px] text-gray-500 mt-1 bg-white! p-2 rounded-lg">
              {appt.notes}
            </div>
          ) : null}
          <div className="mt-2 bg-white p-2 rounded-lg">
            {appt?.briefing ? (
              <div className="mt-2  ">
                <div className="text-[11px] font-semibold text-gray-500 mb-1">
                  Briefing
                </div>
                <div
                  className="text-[12px] text-gray-700 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: appt.briefing }}
                />
              </div>
            ) : null}

            {appt?.remark ? (
              <div className="mt-2">
                <div className="text-[11px] font-semibold text-gray-500 mb-1">
                  Remark
                </div>
                <div className="text-[12px] text-gray-700 whitespace-pre-wrap">
                  {appt.remark}
                </div>
              </div>
            ) : null}

            {Array.isArray(appt?.attachments) && appt.attachments.length ? (
              <div className="mt-2">
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
                      className="inline-flex items-center gap-1 text-[12px] px-2 py-1 bg-white border border-gray-200 rounded"
                    >
                      <FiPaperclip size={12} />
                      <span className="truncate max-w-40">{f}</span>
                    </a>
                  ))}
                </div>
              </div>
            ) : null}

            {Array.isArray(appt?.feedback) && appt.feedback.length ? (
              <div className="mt-2">
                <div className="text-[11px] font-semibold text-gray-500 mb-1">
                  Feedback
                </div>
                <div className="flex flex-wrap gap-1">
                  {appt.feedback.map((v: string) => (
                    <Tag key={v} color="blue">
                      {FEEDBACK_LABELS[v] || v}
                    </Tag>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
          {appt?.status === "upcoming" ? (
            <Button
              size="small"
              type="primary"
              className="bg-green-500!"
              onClick={() => onAttend?.(appt)}
            >
              Attend
            </Button>
          ) : null}
        </div>
      </div>
    ),
  }));

  return (
    <div className="p-2">
      <Timeline items={items} />
    </div>
  );
}

export default TimelineTab;
