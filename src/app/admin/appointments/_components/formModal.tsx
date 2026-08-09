"use client";
import React, { useMemo, useState } from "react";
import {
  Button,
  DatePicker,
  Drawer,
  Form,
  Input,
  InputNumber,
  message,
  Select,
} from "antd";
import { FaRegSave } from "react-icons/fa";

import { API } from "@/config/apis";
import { POST, PUT } from "@/utils/apiCalls";
import { dayjs } from "@/utils/common";
import PatientPicker from "../../patients/_components/patientPicker";
import DoctorPicker from "../../doctors/_components/doctorPicker";

const DAY_MAP = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

function FormModal(props: any) {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const [selectedDoctor, setSelectedDoctor] = useState<any>(
    props?.data?.doctor || null,
  );
  const [selectedSlotIdx, setSelectedSlotIdx] = useState<number | null>(
    (() => {
      const s = props?.data?.slot;
      const slots = props?.data?.doctor?.slots || [];
      if (!s?.startTime) return null;
      const idx = slots.findIndex(
        (x: any) =>
          x.day === s.day &&
          x.startTime === s.startTime &&
          x.endTime === s.endTime,
      );
      return idx >= 0 ? idx : null;
    })(),
  );

  const doctorSlots: any[] = useMemo(
    () => (Array.isArray(selectedDoctor?.slots) ? selectedDoctor.slots : []),
    [selectedDoctor],
  );

  const onDoctorSelect = (doc: any) => {
    setSelectedDoctor(doc || null);
    setSelectedSlotIdx(null);
    form.setFieldsValue({ fee: doc?.consultationFee ?? 0 });
  };

  const submit = async (value: any) => {
    try {
      setIsLoading(true);

      let date: any = value?.date ? value.date.toDate() : null;
      let slot: any = null;

      if (doctorSlots.length) {
        if (selectedSlotIdx === null || selectedSlotIdx === undefined) {
          message.error("Please select a slot");
          setIsLoading(false);
          return;
        }
        const s = doctorSlots[selectedSlotIdx];
        slot = { day: s.day, startTime: s.startTime, endTime: s.endTime };

        if (!date) {
          message.error("Please select a date");
          setIsLoading(false);
          return;
        }
        const targetDay = DAY_MAP.indexOf(s.day);
        if (targetDay >= 0 && date.getDay() !== targetDay) {
          message.error(`Selected date must be a ${s.day}`);
          setIsLoading(false);
          return;
        }
        const [h, m] = String(s.startTime).split(":");
        date.setHours(Number(h || 0), Number(m || 0), 0, 0);
      } else {
        if (!date) {
          message.error("Please select a date & time");
          setIsLoading(false);
          return;
        }
      }

      const obj: any = {
        createdBy: props?.user?._id,
        _id: props?.data?._id,
        patient: value?.patient,
        doctor: value?.doctor,
        date,
        slot,
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
      width={670}
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
            <PatientPicker initial={props?.data?.patient} />
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

          {doctorSlots.length > 0 ? (
            <Form.Item label="Slot" className="md:col-span-2">
              <Select
                placeholder="Select a slot"
                value={selectedSlotIdx ?? undefined}
                onChange={(v) => setSelectedSlotIdx(v)}
                options={doctorSlots.map((s, idx) => ({
                  label: `${s.day} · ${s.startTime} – ${s.endTime}`,
                  value: idx,
                }))}
              />
            </Form.Item>
          ) : null}

          <Form.Item
            label={doctorSlots.length ? "Date" : "Date & time"}
            name="date"
            rules={[{ required: true, message: "Required" }]}
          >
            <DatePicker
              className="w-full!"
              showTime={doctorSlots.length ? false : { format: "HH:mm" }}
              format={doctorSlots.length ? "YYYY-MM-DD" : "YYYY-MM-DD HH:mm"}
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
    </Drawer>
  );
}

export default FormModal;
