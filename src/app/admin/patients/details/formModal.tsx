"use client";
import { useMemo, useState } from "react";
import { Button, Drawer, Form, Input, message, Radio, Tag } from "antd";
import { FaRegSave } from "react-icons/fa";
import { IoCloseCircleOutline } from "react-icons/io5";

import TextEditor from "../../_components/textEditor";
import FilePicker from "../../_components/filePicker";
import DoctorPicker from "../../doctors/_components/doctorPicker";
import SlotPicker, { Slot } from "../../doctors/_components/slotPicker";

import { API } from "@/config/apis";
import { PUT } from "@/utils/apiCalls";
import { dayjs } from "@/utils/common";
import { FEEDBACK } from "../_components/feedback";

const DAY_MAP = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const FEEDBACK_OPTIONS = FEEDBACK.map((f) => ({
  value: f.value,
  label: (
    <span className="inline-flex items-center gap-1.5">
      {f.label}
      <span className="text-[18px] leading-none">{f.emoji}</span>
    </span>
  ),
}));

function FormModal(props: any) {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const appt = props?.data || {};
  const needsDoctor = !appt?.doctor?._id;

  const [briefing, setBriefing] = useState<string>(appt?.briefing || "");
  const [attachments, setAttachments] = useState<string[]>(
    Array.isArray(appt?.attachments) ? appt.attachments : [],
  );
  const [selectedDoctor, setSelectedDoctor] = useState<any>(
    appt?.doctor || null,
  );
  const [slot, setSlot] = useState<Slot | null>(appt?.slot || null);

  const doctorSlots: any[] = useMemo(
    () => (Array.isArray(selectedDoctor?.slots) ? selectedDoctor.slots : []),
    [selectedDoctor],
  );

  const addAttachment = (value: any) => {
    if (!value?.name) return;
    setAttachments((prev) => [...prev, value.name]);
  };

  const removeAttachment = (idx: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== idx));
  };

  const submit = async (value: any) => {
    try {
      if (needsDoctor && !selectedDoctor?._id) {
        message.error("Please select a healer");
        return;
      }
      if (
        needsDoctor &&
        doctorSlots.length &&
        (!slot?.startTime || !slot?.endTime)
      ) {
        message.error("Please select a slot");
        return;
      }
      if (needsDoctor && doctorSlots.length && slot?.day && appt?.date) {
        const targetDay = DAY_MAP.indexOf(slot.day);
        const apptDay = new Date(appt.date).getDay();
        if (targetDay >= 0 && apptDay !== targetDay) {
          message.error(`This slot is only available on ${slot.day}`);
          return;
        }
      }

      setIsLoading(true);
      const obj: any = {
        _id: appt?._id,
        patient: appt?.patient?._id,
        doctor: needsDoctor ? selectedDoctor?._id : appt?.doctor?._id,
        date: appt?.date,
        slot: needsDoctor ? slot : appt?.slot,
        fee: needsDoctor ? (selectedDoctor?.consultationFee ?? 0) : appt?.fee,
        notes: appt?.notes,
        briefing,
        remark: value?.remark,
        attachments,
        feedback: value?.feedback ? [value.feedback] : [],
        status: "attended",
      };
      const response: any = await PUT(API.APPOINTMENTS, obj);
      if (response?.status) {
        message.success("Marked as attended");
        props?.onchange?.();
        props?.onCancel?.();
      } else {
        message.error(response?.message);
      }
    } catch (err) {
      message.error("oops.something gone wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Drawer
      title="Attending"
      onClose={props?.onCancel}
      open={props.visible}
      placement="right"
      size={"large"}
      styles={{ body: { padding: 20 }, header: { padding: 14 } }}
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
            <FaRegSave /> Mark attended
          </Button>
        </div>
      }
      extra={
        !needsDoctor ? null : (
          <Tag color="orange">Booked online — no healer assigned</Tag>
        )
      }
    >
      <div className="mb-4 p-3 bg-gray-50 rounded border border-gray-200">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-[12px] text-gray-500">
            {appt?.token
              ? `${dayjs(appt?.date).format("DDMM")}/${String(appt.token).padStart(2, "0")}`
              : ""}
          </span>
          {!needsDoctor ? (
            <>
              <span className="font-semibold text-[13px]">
                {appt?.doctor?.name}
              </span>
            </>
          ) : null}
        </div>
        <div className="text-[12px] text-gray-600 mt-1">
          {appt?.date ? dayjs(appt.date).format("lll") : "-"}
          {appt?.slot?.startTime
            ? ` · ${appt.slot.day} ${appt.slot.startTime}–${appt.slot.endTime}`
            : ""}
        </div>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={submit}
        initialValues={{
          notes: appt?.notes || "",
          remark: appt?.remark || "",
          doctor: selectedDoctor?._id,
          feedback: Array.isArray(appt?.feedback)
            ? appt.feedback[0]
            : undefined,
        }}
      >
        {needsDoctor ? (
          <div>
            <Form.Item
              label="Healer"
              name="doctor"
              rules={[{ required: true, message: "Please select a healer" }]}
            >
              <DoctorPicker
                initial={selectedDoctor}
                onSelect={(doc) => {
                  setSelectedDoctor(doc || null);
                  setSlot(null);
                }}
              />
            </Form.Item>
            <Form.Item
              label="Slot"
              required
              validateStatus={
                doctorSlots.length && (!slot?.startTime || !slot?.endTime)
                  ? "error"
                  : undefined
              }
              help={
                doctorSlots.length && (!slot?.startTime || !slot?.endTime)
                  ? "Please select a slot"
                  : undefined
              }
            >
              <SlotPicker
                slots={doctorSlots}
                value={slot}
                onChange={setSlot}
                disabled={!selectedDoctor}
              />
            </Form.Item>
          </div>
        ) : null}

        <Form.Item label="Briefing">
          <TextEditor
            value={briefing}
            onChange={(v: string) => setBriefing(v)}
          />
        </Form.Item>
        <Form.Item label="Remark" name="remark">
          <Input.TextArea rows={4} placeholder="Short remark" />
        </Form.Item>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Form.Item label="Attachments">
            <div className="flex flex-col gap-2">
              {attachments.length ? (
                <div className="flex flex-wrap gap-2">
                  {attachments.map((f, idx) => (
                    <Tag
                      key={`${f}-${idx}`}
                      className="flex items-center gap-1 py-1! px-2!"
                    >
                      <span className="text-[12px]">{f}</span>
                      <IoCloseCircleOutline
                        size={16}
                        color="red"
                        className="cursor-pointer"
                        onClick={() => removeAttachment(idx)}
                      />
                    </Tag>
                  ))}
                </div>
              ) : null}
              <FilePicker url={null} onchange={addAttachment} />
            </div>
          </Form.Item>
        </div>

        <Form.Item label="Feedback" name="feedback">
          <Radio.Group options={FEEDBACK_OPTIONS} buttonStyle="solid" />
        </Form.Item>
      </Form>
    </Drawer>
  );
}

export default FormModal;
