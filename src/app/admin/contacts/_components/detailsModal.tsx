"use client";
import React, { useState } from "react";
import { Button, message, Modal, Tag } from "antd";
import { HiOutlineCheckCircle } from "react-icons/hi";
import { dayjs } from "@/utils/common";

import { PUT } from "@/utils/apiCalls";
import { API } from "@/config/apis";

function DetailsModal(props: any) {
  const [isLoading, setIsLoading] = useState(false);
  const data = props?.data || {};
  const isRead = !!data?.status;
  const initial = data?.name?.charAt(0)?.toUpperCase() || "?";

  const markAsRead = async () => {
    try {
      setIsLoading(true);
      const response: any = await PUT(API.CONTACT, {
        _id: data?._id,
        status: true,
      });
      if (response?.status) {
        message.success("Marked as read");
        props?.onchange?.();
        props?.onCancel?.();
      } else {
        message.error(response?.message || "Failed to update");
      }
    } catch (err) {
      message.error("Oops. Something went wrong.");
      console.log("err", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      onCancel={props?.onCancel}
      open={props.visible}
      footer={null}
      width={400}
      centered
      title={null}
      styles={{ body: { padding: 0 } }}
    >
      <div>
        <Tag color={isRead ? "green" : "blue"}>
          {isRead ? "READ" : "INBOX · UNREAD"}
        </Tag>

        <div className="flex items-start gap-3 pt-4">
          <div className="bg-primary/20 text-primary w-11 h-11 rounded-full flex items-center justify-center text-[16px] font-semibold shrink-0">
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[15px] font-semibold leading-tight truncate">
              {data?.name || "Unknown"}
            </div>
            <a
              href={data?.email ? `mailto:${data.email}` : undefined}
              className="text-[12.5px] text-gray-500 hover:text-primary truncate block"
              style={{ textDecoration: "none" }}
            >
              {data?.email || ""}
            </a>
          </div>
          <div className="text-[11px] text-gray-400 text-right shrink-0">
            {dayjs(data?.createdAt).format("DD MMM")}
            <br />
            {dayjs(data?.createdAt).format("hh:mm A")}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-[12px] text-gray-500 border-y border-slate-500/10 py-2.5">
          {data?.phone ? (
            <div>
              <span className="text-gray-400 mr-1">Phone</span>{" "}
              <a
                href={`tel:${data.phone}`}
                className="text-gray-700 hover:text-primary font-medium"
                style={{ textDecoration: "none" }}
              >
                {data.phone}
              </a>
            </div>
          ) : null}
        </div>
      </div>
      <div className="py-4">
        <div className="text-[14px] leading-7 text-gray-800 whitespace-pre-wrap max-h-80 overflow-y-auto">
          {data?.message || (
            <span className="text-gray-400 italic">No message body</span>
          )}
        </div>

        <div className="mt-5 text-[12px] text-gray-400">
          — Sent via the website contact form
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1" />
        {!isRead ? (
          <Button
            type="primary"
            icon={<HiOutlineCheckCircle size={16} />}
            onClick={markAsRead}
            loading={isLoading}
          >
            Mark as read
          </Button>
        ) : (
          <span className="text-[12px] text-emerald-600 font-medium px-2">
            ✓ Resolved
          </span>
        )}
      </div>
    </Modal>
  );
}

export default DetailsModal;
