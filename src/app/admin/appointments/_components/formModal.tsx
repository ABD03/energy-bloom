"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  DatePicker,
  Drawer,
  Form,
  Input,
  InputNumber,
  message,
} from "antd";
import { FaRegSave, FaWhatsapp } from "react-icons/fa";
import { FiCopy, FiRotateCcw } from "react-icons/fi";

import { API } from "@/config/apis";
import { POST, PUT } from "@/utils/apiCalls";
import { dayjs } from "@/utils/common";
import PatientPicker from "../../patients/_components/patientPicker";
import DoctorPicker from "../../doctors/_components/doctorPicker";
import SlotPicker, { Slot } from "../../doctors/_components/slotPicker";

const DAY_MAP = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

// Prefixed to 10-digit numbers so wa.me can open the right chat.
const DEFAULT_COUNTRY_CODE = "91";

const toWhatsAppNumber = (phone?: string) => {
  const digits = String(phone || "")
    .replace(/\D/g, "")
    .replace(/^0+/, "");
  if (!digits) return "";
  return digits.length === 10 ? DEFAULT_COUNTRY_CODE + digits : digits;
};

const to12h = (t?: string) => (t ? dayjs(t, "HH:mm").format("h:mm A") : "");

function FormModal(props: any) {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const [selectedPatient, setSelectedPatient] = useState<any>(
    props?.data?.patient || null,
  );
  const [selectedDoctor, setSelectedDoctor] = useState<any>(
    props?.data?.doctor || null,
  );
  const [slot, setSlot] = useState<Slot | null>(props?.data?.slot || null);

  // null = follow the generated text; a string = the user has edited it
  const [customMessage, setCustomMessage] = useState<string | null>(null);

  const watchedDate = Form.useWatch("date", form);
  const watchedFee = Form.useWatch("fee", form);

  const shareMessage = useMemo(() => {
    if (!selectedPatient || !selectedDoctor || !watchedDate) return "";
    const lines = [
      `Hello ${selectedPatient.name},`,
      "",
      "Your appointment details:",
      "",
      `Doctor: ${selectedDoctor.name}${
        selectedDoctor.specialization ? ` (${selectedDoctor.specialization})` : ""
      }`,
      `Date: ${dayjs(watchedDate).format("dddd, D MMM YYYY")}`,
    ];
    if (slot?.startTime && slot?.endTime) {
      lines.push(`Time: ${to12h(slot.startTime)} – ${to12h(slot.endTime)}`);
    }
    if (props?.data?.token) {
      lines.push(
        `Token: ${dayjs(props.data.date).format("DDMM")}/${String(props.data.token).padStart(2, "0")}`,
      );
    }
    if (Number(watchedFee) > 0) lines.push(`Fee: ₹${watchedFee}`);
    lines.push("", "Please let us know if you need to reschedule. Thank you!");
    return lines.join("\n");
  }, [selectedPatient, selectedDoctor, watchedDate, watchedFee, slot, props?.data]);

  const messageText = customMessage ?? shareMessage;
  const hasMessage = messageText.trim().length > 0;

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(messageText);
      message.success("Message copied");
    } catch (err) {
      message.error("Could not copy. Please select the text and copy manually.");
    }
  };

  const shareOnWhatsApp = () => {
    const number = toWhatsAppNumber(selectedPatient?.phone);
    const url = `https://wa.me/${number}?text=${encodeURIComponent(messageText)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const doctorSlots: any[] = useMemo(
    () => (Array.isArray(selectedDoctor?.slots) ? selectedDoctor.slots : []),
    [selectedDoctor],
  );

  const onDoctorSelect = (doc: any) => {
    setSelectedDoctor(doc || null);
    setSlot(null);
  };

  useEffect(() => {
    if (selectedDoctor) {
      form.setFieldValue("fee", selectedDoctor?.consultationFee ?? 0);
    }
  }, [selectedDoctor, form]);

  const submit = async (value: any) => {
    try {
      setIsLoading(true);

      let date: any = value?.date ? value.date.toDate() : null;
      if (!date) {
        message.error("Please select a date");
        setIsLoading(false);
        return;
      }

      let finalSlot: any = null;
      if (slot?.startTime && slot?.endTime) {
        if (slot.endTime <= slot.startTime) {
          message.error("End time must be after start time");
          setIsLoading(false);
          return;
        }
        if (doctorSlots.length) {
          const targetDay = DAY_MAP.indexOf(slot.day || "");
          if (targetDay >= 0 && date.getDay() !== targetDay) {
            message.error(`Selected date must be a ${slot.day}`);
            setIsLoading(false);
            return;
          }
        }
        const [h, m] = String(slot.startTime).split(":");
        date.setHours(Number(h || 0), Number(m || 0), 0, 0);
        finalSlot = {
          day: slot.day || DAY_MAP[date.getDay()],
          startTime: slot.startTime,
          endTime: slot.endTime,
        };
      }

      const obj: any = {
        createdBy: props?.user?._id,
        _id: props?.data?._id,
        patient: value?.patient,
        doctor: value?.doctor,
        date,
        slot: finalSlot,
        fee: value?.fee ?? 0,
        notes: value?.notes,
        status: "upcoming",
      };
      const METHOD = props?.data?._id ? PUT : POST;
      const response: any = await METHOD(API.APPOINTMENTS, obj);
      if (response?.status) {
        message.success(
          `Appointment ${props?.data?._id ? "updated" : "created"} successfully`,
        );
        props?.onchange();
        props?.onCancel();
      } else {
        message.error(response?.message);
      }
      setIsLoading(false);
    } catch (err) {
      message.error("oops.something gone wrong.");
      console.log("err", err);
      setIsLoading(false);
    }
  };

  const initialDate = props?.data?.date ? dayjs(props?.data?.date) : null;

  return (
    <Drawer
      title={`${props?.data?._id ? "Edit" : "New"} appointment`}
      onClose={props?.onCancel}
      open={props.visible}
      placement="right"
      size="large"
      styles={{ body: { padding: 20 } }}
      footer={
        <div className="flex items-center justify-end gap-2 py-1">
          <Button size="large" onClick={() => props.onCancel()} danger>
            Close
          </Button>
          <Button
            size="large"
            type="primary"
            loading={isLoading}
            onClick={() => form.submit()}
          >
            <FaRegSave /> Save
          </Button>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={submit}
        initialValues={{
          patient: props?.data?.patient?._id,
          doctor: props?.data?.doctor?._id,
          date: initialDate,
          fee: props?.data?.fee ?? props?.data?.doctor?.consultationFee ?? 0,
          notes: props?.data?.notes,
          status: props?.data?.status || "upcoming",
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
          <Form.Item
            label="Patient"
            name="patient"
            rules={[{ required: true, message: "Required" }]}
          >
            <PatientPicker
              initial={props?.data?.patient}
              onChange={(_id, patient) => setSelectedPatient(patient || null)}
            />
          </Form.Item>
          <Form.Item
            label="Doctor"
            name="doctor"
            rules={[{ required: true, message: "Required" }]}
          >
            <DoctorPicker
              initial={props?.data?.doctor}
              onSelect={onDoctorSelect}
            />
          </Form.Item>

          <Form.Item
            label="Date"
            name="date"
            rules={[{ required: true, message: "Required" }]}
          >
            <DatePicker className="w-full!" format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item label="Slot">
            <SlotPicker
              slots={doctorSlots}
              value={slot}
              onChange={(v) => setSlot(v)}
            />
          </Form.Item>

          <Form.Item label="Fee" name="fee">
            <InputNumber min={0} className="w-full!" />
          </Form.Item>

          <Form.Item label="Notes" name="notes" className="md:col-span-2">
            <Input.TextArea rows={3} />
          </Form.Item>
        </div>
      </Form>

      <div className="border border-gray-200 rounded-md overflow-hidden">
        <div className="flex items-center justify-between gap-2 px-2 py-1 bg-gray-50 border-b border-gray-200">
          <span className="text-[11px] font-semibold text-gray-600">
            Message to patient
            {customMessage !== null ? (
              <span className="ml-1 font-normal text-amber-600">· edited</span>
            ) : null}
          </span>
          <div className="flex items-center gap-1">
            {customMessage !== null ? (
              <Button
                size="small"
                type="text"
                icon={<FiRotateCcw />}
                title="Regenerate from the form details"
                onClick={() => setCustomMessage(null)}
              >
                Reset
              </Button>
            ) : null}
            {hasMessage ? (
              <>
                <Button size="small" icon={<FiCopy />} onClick={copyMessage}>
                  Copy
                </Button>
                <Button
                  size="small"
                  type="primary"
                  className="bg-green-500!"
                  icon={<FaWhatsapp />}
                  onClick={shareOnWhatsApp}
                >
                  WhatsApp
                </Button>
              </>
            ) : null}
          </div>
        </div>
        {messageText || customMessage !== null ? (
          <Input.TextArea
            value={messageText}
            onChange={(e) => setCustomMessage(e.target.value)}
            autoSize={{ minRows: 4, maxRows: 10 }}
            variant="borderless"
            className="text-[12px]! leading-snug!"
          />
        ) : (
          <div className="px-2 py-1.5 text-[11px] text-gray-400">
            Select patient, doctor and date to generate the message.
          </div>
        )}
      </div>
    </Drawer>
  );
}

export default FormModal;
