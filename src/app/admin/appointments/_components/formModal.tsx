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
import { FaRegSave } from "react-icons/fa";

import { API } from "@/config/apis";
import { POST, PUT } from "@/utils/apiCalls";
import { dayjs } from "@/utils/common";
import PatientPicker from "../../patients/_components/patientPicker";
import DoctorPicker from "../../doctors/_components/doctorPicker";
import SlotPicker, { Slot } from "../../doctors/_components/slotPicker";

const DAY_MAP = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

function FormModal(props: any) {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const [selectedDoctor, setSelectedDoctor] = useState<any>(
    props?.data?.doctor || null,
  );
  const [slot, setSlot] = useState<Slot | null>(props?.data?.slot || null);

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
    </Drawer>
  );
}

export default FormModal;
