"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, DatePicker, Form, Input, message, Steps } from "antd";
import {
  FiCalendar,
  FiCheckCircle,
  FiMapPin,
  FiPhone,
  FiUser,
} from "react-icons/fi";

import { API } from "@/config/apis";
import { POST } from "@/utils/apiCalls";
import { dayjs } from "@/utils/common";

const STEPS = ["Your details", "Preferred date", "Confirm"];

export default function BookAppointmentContainer() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<any>(null);
  const [step, setStep] = useState(0);

  const submit = async () => {
    try {
      const value = form.getFieldsValue(true);
      setLoading(true);
      const res: any = await POST(API.WEB_APPOINTMENTS, {
        name: value?.name,
        phone: value?.phone,
        address: value?.address,
        date: value?.date ? value.date.toDate() : null,
        notes: value?.notes,
      });
      if (res?.status) {
        setDone(res.data);
      } else {
        message.error(res?.message || "Booking failed");
      }
    } catch (err) {
      message.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const goNext = async () => {
    if (step === 0) {
      await form.validateFields(["name", "phone"]);
      setStep(1);
    } else if (step === 1) {
      await form.validateFields(["date"]);
      setStep(2);
    }
  };

  if (done) {
    const p = done?.patient;
    const a = done?.appointment;
    return (
      <section className="min-h-[85vh] flex items-center justify-center  px-6 sm:px-4 py-16">
        <div className="max-w-md w-full text-center ">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-green-100 flex items-center justify-center rotate-3">
            <FiCheckCircle size={30} className="text-green-600"/>
          </div>
          <h1 className="mt-6 text-3xl font-semibold">
            Request sent, {p?.name?.split(" ")[0]}
          </h1>
          <p className="mt-3  text-[14px] leading-relaxed">
            We'll call{" "}
            <span className="font-mono ">{p?.phone}</span> to
            confirm your appointment on{" "}
            <strong className="">
              {dayjs(a?.date).format("dddd, MMM D")}
            </strong>
            .
          </p>
          {p?.patientId ? (
            <div className="mt-6 inline-flex items-center gap-2 border rounded-full px-4 py-2 text-[12px] font-mono">
              Reference · {p.patientId}
            </div>
          ) : null}
          <div className="mt-10 flex items-center justify-center gap-3">
            <Button
              size="large"
              className="bg-transparent! border-white/20! "
              onClick={() => router.push("/")}
            >
              Back to home
            </Button>
            <Button
              size="large"
              type="primary"
              onClick={() => {
                setDone(null);
                setStep(0);
                form.resetFields();
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
    <section className="min-h-[85vh] py-10 md:py-14">
      <div className="max-w-3xl mx-auto px-0 sm:px-6">

        <div className="text-center">
          <div className="text-[11px] uppercase tracking-[0.2em] text-primary font-semibold">
            Book an appointment
          </div>
          <h1 className="mt-3 text-3xl md:text-5xl font-semibold leading-tight">
            Let's get you scheduled.
          </h1>
        </div>

        {/* Step indicator */}
        <div className="mt-10 max-w-xl mx-auto px-4">
          <Steps
            current={step}
            items={STEPS.map((label) => ({ title: label }))}
            labelPlacement="vertical"
            size="small"
          />
        </div>

        {/* Form card */}
        <div className=" bg-white text-gray-900 rounded-3xl p-6 md:p-10">
          <Form form={form} layout="vertical" requiredMark={false}>
            {step === 0 ? (
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Who are we booking for?
                </h2>
                <p className="mt-1 text-[13px] text-gray-500">
                  We'll use these details to reach you.
                </p>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                  <Form.Item
                    label="Full name"
                    name="name"
                    rules={[
                      { required: true, message: "Please enter your name" },
                    ]}
                  >
                    <Input
                      size="large"
                      prefix={<FiUser className="text-gray-400" />}
                      placeholder="Jane Doe"
                    />
                  </Form.Item>
                  <Form.Item
                    label="Phone"
                    name="phone"
                    rules={[
                      { required: true, message: "Please enter your phone" },
                    ]}
                  >
                    <Input
                      size="large"
                      prefix={<FiPhone className="text-gray-400" />}
                      placeholder="+91 90000 00000"
                    />
                  </Form.Item>
                  <Form.Item
                    label="Address"
                    name="address"
                    className="sm:col-span-2"
                  >
                    <Input.TextArea rows={2} placeholder="Building, area, city" />
                  </Form.Item>
                </div>
              </div>
            ) : null}

            {step === 1 ? (
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  When works best for you?
                </h2>
                <p className="mt-1 text-[13px] text-gray-500">
                  Pick a date — we'll confirm the exact time by phone.
                </p>
                <div className="mt-6">
                  <Form.Item
                    label="Preferred date"
                    name="date"
                    rules={[{ required: true, message: "Please pick a date" }]}
                  >
                    <DatePicker
                      size="large"
                      className="w-full!"
                      format="YYYY-MM-DD"
                      suffixIcon={<FiCalendar className="text-gray-400" />}
                      disabledDate={(d) =>
                        d && d.isBefore(dayjs().startOf("day"))
                      }
                    />
                  </Form.Item>
                  <Form.Item label="Notes" name="notes">
                    <Input.TextArea
                      rows={3}
                      placeholder="Anything we should know — condition, preferred time, questions"
                    />
                  </Form.Item>
                </div>
              </div>
            ) : null}

            {step === 2 ? (
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Review &amp; confirm
                </h2>
                <p className="mt-1 text-[13px] text-gray-500">
                  Double-check your details before submitting.
                </p>
                <div className="mt-6 divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden">
                  {[
                    { icon: <FiUser />, label: "Name", value: form.getFieldValue("name") },
                    { icon: <FiPhone />, label: "Phone", value: form.getFieldValue("phone") },
                    {
                      icon: <FiMapPin />,
                      label: "Address",
                      value: form.getFieldValue("address") || "—",
                    },
                    {
                      icon: <FiCalendar />,
                      label: "Preferred date",
                      value: form.getFieldValue("date")
                        ? dayjs(form.getFieldValue("date")).format("dddd, MMM D, YYYY")
                        : "—",
                    },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex items-center gap-3 px-4 py-3"
                    >
                      <span className="text-gray-400">{row.icon}</span>
                      <span className="text-[12px] uppercase tracking-wide text-gray-400 w-28 shrink-0">
                        {row.label}
                      </span>
                      <span className="text-[14px] font-medium text-gray-900 truncate">
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mt-8 flex items-center justify-between gap-2">
              {step > 0 ? (
                <Button size="large" onClick={() => setStep(step - 1)}>
                  Back
                </Button>
              ) : (
                <span />
              )}
              {step < 2 ? (
                <Button size="large" type="primary" onClick={goNext}>
                  Continue
                </Button>
              ) : (
                <Button
                  size="large"
                  type="primary"
                  loading={loading}
                  onClick={submit}
                  className="min-w-40"
                >
                  {loading ? "Submitting…" : "Confirm booking"}
                </Button>
              )}
            </div>
          </Form>
        </div>
      </div>
    </section>
  );
}
