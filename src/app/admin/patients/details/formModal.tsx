"use client";
import { useState } from "react";
import { Button, Checkbox, Drawer, Form, Input, message, Tag } from "antd";
import { FaRegSave } from "react-icons/fa";
import { IoCloseCircleOutline } from "react-icons/io5";

import TextEditor from "../../_components/textEditor";
import FilePicker from "../../_components/filePicker";

import { API } from "@/config/apis";
import { PUT } from "@/utils/apiCalls";
import { dayjs } from "@/utils/common";

const FEEDBACK_OPTIONS = [
  { label: "Helpful", value: "helpful" },
  { label: "Better", value: "better" },
  { label: "No improvement", value: "no_improvement" },
];

function FormModal(props: any) {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const appt = props?.data || {};

  const [briefing, setBriefing] = useState<string>(appt?.briefing || "");
  const [attachments, setAttachments] = useState<string[]>(
    Array.isArray(appt?.attachments) ? appt.attachments : [],
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
      setIsLoading(true);
      const obj: any = {
        _id: appt?._id,
        patient: appt?.patient?._id,
        doctor: appt?.doctor?._id,
        date: appt?.date,
        slot: appt?.slot,
        fee: appt?.fee,
        briefing,
        remark: value?.remark,
        attachments,
        feedback: value?.feedback || [],
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
      title="Attend appointment"
      onClose={props?.onCancel}
      open={props.visible}
      placement="right"
      width={720}
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
            <FaRegSave /> Mark attended
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
          <span className="font-semibold text-[13px]">
            {appt?.doctor?.name}
          </span>
          {appt?.doctor?.specialization ? (
            <Tag>{appt.doctor.specialization}</Tag>
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
          feedback: Array.isArray(appt?.feedback) ? appt.feedback : [],
        }}
      >
        <Form.Item label="Briefing">
          <TextEditor value={briefing} onChange={(v: string) => setBriefing(v)} />
        </Form.Item>

        <Form.Item label="Remark" name="remark">
          <Input.TextArea rows={3} placeholder="Short remark" />
        </Form.Item>

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

        <Form.Item label="Feedback" name="feedback">
          <Checkbox.Group options={FEEDBACK_OPTIONS} />
        </Form.Item>
      </Form>
    </Drawer>
  );
}

export default FormModal;
