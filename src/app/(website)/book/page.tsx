"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  DatePicker,
  Form,
  Input,
  message,
  Select,
  TimePicker,
} from "antd";
import { FiArrowLeft, FiCheckCircle } from "react-icons/fi";

import { API } from "@/config/apis";
import { GET, POST } from "@/utils/apiCalls";
import { dayjs } from "@/utils/common";
import { UseAppSelector } from "@/redux/util/hooks";

const DAY_MAP = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const TF = "HH:mm";

export default function BookAppointment() {
  const router = useRouter();
  const Auth = UseAppSelector((s: any) => s?.Auth);
  const user = Auth?.user;

  const [form] = Form.useForm();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [slotIdx, setSlotIdx] = useState<number | null>(null);
  const [manualSlot, setManualSlot] = useState<{
    startTime?: string;
    endTime?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<any>(null);

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    const res: any = await GET(API.WEB_DOCTORS, null);
    if (res?.status) setDoctors(res.data);
  };

  const doctorSlots: any[] = useMemo(
    () => (Array.isArray(selectedDoctor?.slots) ? selectedDoctor.slots : []),
    [selectedDoctor],
  );

  const onDoctorChange = (id: string) => {
    const d = doctors.find((x) => x._id === id);
    setSelectedDoctor(d || null);
    setSlotIdx(null);
    setManualSlot({});
  };

  const submit = async (value: any) => {
    if (!user?._id) {
      message.warning("Please sign in to book an appointment");
      router.push(`/login?redirect=/book`);
      return;
    }
    try {
      setLoading(true);
      let date: any = value?.date ? value.date.toDate() : null;
      if (!date) {
        message.error("Please pick a date");
        return;
      }
      let slot: any = null;
      if (doctorSlots.length) {
        if (slotIdx === null || slotIdx === undefined) {
          message.error("Please pick a slot");
          return;
        }
        const s = doctorSlots[slotIdx];
        const targetDay = DAY_MAP.indexOf(s.day);
        if (targetDay >= 0 && date.getDay() !== targetDay) {
          message.error(`Selected date must be a ${s.day}`);
          return;
        }
        const [h, m] = s.startTime.split(":");
        date.setHours(Number(h), Number(m), 0, 0);
        slot = { day: s.day, startTime: s.startTime, endTime: s.endTime };
      } else if (manualSlot.startTime && manualSlot.endTime) {
        if (manualSlot.endTime <= manualSlot.startTime) {
          message.error("End time must be after start time");
          return;
        }
        const [h, m] = manualSlot.startTime.split(":");
        date.setHours(Number(h), Number(m), 0, 0);
        slot = {
          day: DAY_MAP[date.getDay()],
          startTime: manualSlot.startTime,
          endTime: manualSlot.endTime,
        };
      }
      const res: any = await POST(API.WEB_APPOINTMENTS, {
        doctor: value?.doctor,
        date,
        slot,
        notes: value?.notes,
      });
      if (res?.status) {
        setDone({ ...res.data, doctor: selectedDoctor });
      } else {
        message.error(res?.message || "Booking failed");
      }
    } catch (err) {
      message.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <section className="py-20">
        <div className="max-w-xl mx-auto px-6 text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
            <FiCheckCircle size={32} />
          </div>
          <h1 className="mt-5 text-2xl md:text-3xl font-semibold text-gray-900">
            Appointment booked!
          </h1>
          <p className="mt-3 text-gray-600">
            You're booked with <strong>{done?.doctor?.name}</strong> on{" "}
            <strong>{dayjs(done?.date).format("lll")}</strong>. A confirmation
            has been recorded.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Button onClick={() => router.push("/")}>Back to home</Button>
            <Button
              type="primary"
              onClick={() => {
                setDone(null);
                form.resetFields();
                setSelectedDoctor(null);
                setSlotIdx(null);
                setManualSlot({});
              }}
            >
              Book another
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50 min-h-[70vh]">
      <div className="max-w-3xl mx-auto px-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1 text-[13px] text-gray-500 hover:text-primary mb-4"
        >
          <FiArrowLeft /> Back
        </button>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
          <div className="text-[11px] uppercase tracking-widest text-primary font-semibold">
            Book an appointment
          </div>
          <h1 className="mt-1 text-2xl md:text-3xl font-semibold text-gray-900">
            Choose your doctor and time
          </h1>
          <p className="mt-2 text-gray-600 text-[14px]">
            Fill in the details below and we'll confirm your booking right away.
          </p>

          <Form
            form={form}
            layout="vertical"
            onFinish={submit}
            initialValues={{ status: "upcoming" }}
            className="mt-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
              <Form.Item
                label="Doctor"
                name="doctor"
                rules={[{ required: true, message: "Please pick a doctor" }]}
                className="md:col-span-2"
              >
                <Select
                  showSearch
                  placeholder="Search doctor"
                  filterOption={(input, opt) =>
                    String(opt?.label || "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  onChange={onDoctorChange}
                  options={doctors.map((d) => ({
                    label: `${d.name}${d.specialization ? ` — ${d.specialization}` : ""}`,
                    value: d._id,
                  }))}
                />
              </Form.Item>

              <Form.Item
                label="Date"
                name="date"
                rules={[{ required: true, message: "Please pick a date" }]}
              >
                <DatePicker className="w-full!" format="YYYY-MM-DD" />
              </Form.Item>

              {doctorSlots.length > 0 ? (
                <Form.Item label="Slot">
                  <Select
                    placeholder="Select a slot"
                    value={slotIdx ?? undefined}
                    onChange={(v) => setSlotIdx(v)}
                    options={doctorSlots.map((s, idx) => ({
                      label: `${s.day} · ${s.startTime} – ${s.endTime}`,
                      value: idx,
                    }))}
                  />
                </Form.Item>
              ) : (
                <Form.Item label="Time">
                  <div className="grid grid-cols-2 gap-2">
                    <TimePicker
                      value={
                        manualSlot.startTime
                          ? dayjs(manualSlot.startTime, TF)
                          : null
                      }
                      onChange={(d) =>
                        setManualSlot((p) => ({
                          ...p,
                          startTime: d ? d.format(TF) : undefined,
                        }))
                      }
                      format={TF}
                      minuteStep={5}
                      placeholder="Start"
                      className="w-full!"
                    />
                    <TimePicker
                      value={
                        manualSlot.endTime
                          ? dayjs(manualSlot.endTime, TF)
                          : null
                      }
                      onChange={(d) =>
                        setManualSlot((p) => ({
                          ...p,
                          endTime: d ? d.format(TF) : undefined,
                        }))
                      }
                      format={TF}
                      minuteStep={5}
                      placeholder="End"
                      className="w-full!"
                    />
                  </div>
                </Form.Item>
              )}

              <Form.Item label="Notes" name="notes" className="md:col-span-2">
                <Input.TextArea
                  rows={3}
                  placeholder="Anything the doctor should know?"
                />
              </Form.Item>
            </div>

            {!user?._id ? (
              <div className="mt-2 mb-4 p-3 rounded-lg bg-amber-50 text-amber-700 text-[13px]">
                You'll need to{" "}
                <button
                  type="button"
                  onClick={() => router.push("/login?redirect=/book")}
                  className="underline font-medium"
                >
                  sign in
                </button>{" "}
                to confirm your booking.
              </div>
            ) : null}

            <div className="flex items-center justify-end gap-2">
              <Button onClick={() => router.back()}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Book appointment
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </section>
  );
}
