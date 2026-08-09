"use client";
import { Button, Select, TimePicker } from "antd";
import { IoTrashOutline } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";
import { dayjs } from "@/utils/common";

const DAYS = [
  { label: "Mon", value: "MON" },
  { label: "Tue", value: "TUE" },
  { label: "Wed", value: "WED" },
  { label: "Thu", value: "THU" },
  { label: "Fri", value: "FRI" },
  { label: "Sat", value: "SAT" },
  { label: "Sun", value: "SUN" },
];

const TIME_FORMAT = "HH:mm";

function SlotsList({ value = [], onChange }: any) {
  const slots: any[] = Array.isArray(value) ? value : [];

  const update = (next: any[]) => onChange?.(next);

  const addSlot = () => {
    update([...slots, { day: "MON", startTime: "09:00", endTime: "10:00" }]);
  };

  const removeSlot = (idx: number) => {
    const next = [...slots];
    next.splice(idx, 1);
    update(next);
  };

  const patch = (idx: number, key: string, v: any) => {
    const next = [...slots];
    next[idx] = { ...next[idx], [key]: v };
    update(next);
  };

  return (
    <div className="">
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold text-[13px]">Weekly Slots</div>
        <Button size="small" onClick={addSlot} icon={<IoMdAdd size={14} />}>
          Add slot
        </Button>
      </div>
      {slots.length === 0 ? (
        <div className="text-[12px] text-gray-400 py-2">
          No slots added.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {slots.map((slot, idx) => (
            <div
              key={idx}
              className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-center"
            >
              <Select
                value={slot.day}
                options={DAYS}
                onChange={(v) => patch(idx, "day", v)}
              />
              <TimePicker
                value={slot.startTime ? dayjs(slot.startTime, TIME_FORMAT) : null}
                format={TIME_FORMAT}
                onChange={(d) =>
                  patch(idx, "startTime", d ? d.format(TIME_FORMAT) : null)
                }
                placeholder="Start"
                className="w-full!"
              />
              <TimePicker
                value={slot.endTime ? dayjs(slot.endTime, TIME_FORMAT) : null}
                format={TIME_FORMAT}
                onChange={(d) =>
                  patch(idx, "endTime", d ? d.format(TIME_FORMAT) : null)
                }
                placeholder="End"
                className="w-full!"
              />
              <Button
                size="small"
                danger
                onClick={() => removeSlot(idx)}
                className="p-1!"
              >
                <IoTrashOutline size={14} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SlotsList;
