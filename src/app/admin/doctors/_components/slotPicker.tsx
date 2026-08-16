"use client";
import { Select, TimePicker } from "antd";
import { dayjs } from "@/utils/common";

export type Slot = {
  day?: string;
  startTime?: string;
  endTime?: string;
};

type Props = {
  slots?: any[];
  value?: Slot | null;
  onChange?: (v: Slot | null) => void;
  disabled?: boolean;
};

const TF = "HH:mm";

function SlotPicker({ slots = [], value, onChange, disabled }: Props) {
  const hasSlots = Array.isArray(slots) && slots.length > 0;

  if (hasSlots) {
    const currentIdx = value?.startTime
      ? slots.findIndex(
          (s: any) =>
            s.day === value.day &&
            s.startTime === value.startTime &&
            s.endTime === value.endTime,
        )
      : -1;

    return (
      <Select
        value={currentIdx >= 0 ? currentIdx : undefined}
        disabled={disabled}
        placeholder="Select a slot"
        onChange={(idx: number) => {
          const s = slots[idx];
          onChange?.({
            day: s.day,
            startTime: s.startTime,
            endTime: s.endTime,
          });
        }}
        options={slots.map((s: any, idx: number) => ({
          label: `${s.day} · ${s.startTime} – ${s.endTime}`,
          value: idx,
        }))}
      />
    );
  }

  const patch = (key: "startTime" | "endTime", v: string | null) => {
    onChange?.({
      ...(value || {}),
      [key]: v || undefined,
    });
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      <TimePicker
        value={value?.startTime ? dayjs(value.startTime, TF) : null}
        onChange={(d) => patch("startTime", d ? d.format(TF) : null)}
        format={TF}
        minuteStep={5}
        disabled={disabled}
        placeholder="Start"
        className="w-full!"
      />
      <TimePicker
        value={value?.endTime ? dayjs(value.endTime, TF) : null}
        onChange={(d) => patch("endTime", d ? d.format(TF) : null)}
        format={TF}
        minuteStep={5}
        disabled={disabled}
        placeholder="End"
        className="w-full!"
      />
    </div>
  );
}

export default SlotPicker;
