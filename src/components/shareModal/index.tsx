"use client";
import React from "react";
import Image from "next/image";
import { Button, Input, message, Modal } from "antd";

import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import { IoCopyOutline } from "react-icons/io5";
import { MdEmail, MdOutlineFacebook } from "react-icons/md";
import { RiTwitterXLine } from "react-icons/ri";
import { ImLinkedin } from "react-icons/im";
import { IoLogoWhatsapp } from "react-icons/io";

import { ImageLoader } from "@/utils/common";
import { ViewImage } from "@/utils/viewImage";

const SOCIALS = [
  {
    Button: WhatsappShareButton,
    Icon: IoLogoWhatsapp,
    color: "#25D366",
    bg: "bg-[#25D366]/10!",
    label: "WhatsApp",
  },
  {
    Button: FacebookShareButton,
    Icon: MdOutlineFacebook,
    color: "#4267B2",
    bg: "bg-[#4267B2]/10!",
    label: "Facebook",
  },
  {
    Button: TwitterShareButton,
    Icon: RiTwitterXLine,
    color: "#000",
    bg: "bg-black/5!",
    label: "X",
  },
  {
    Button: LinkedinShareButton,
    Icon: ImLinkedin,
    color: "#0a66c2",
    bg: "bg-[#0a66c2]/10!",
    label: "LinkedIn",
  },
  {
    Button: EmailShareButton,
    Icon: MdEmail,
    color: "#2071f5",
    bg: "bg-[#2071f5]/10!",
    label: "Email",
  },
];

const ShareModal = (props: any) => {
  const host = window.location.origin;
  const link = `${host}/${props?.permalink}`;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      message.success("Link copied!");
    } catch (err) {
      message.error("Failed to copy text");
    }
  };

  return (
    <Modal
      title="Share Now"
      open={props.visible}
      onCancel={() => props?.close()}
      centered
      width={400}
      footer={null}
      closable
      styles={{ body: { padding: 0 } }}
    >
      {props?.image && (
        <div className="rounded-xl overflow-hidden mb-2 border border-gray-400/20">
          <Image
            src={ViewImage(props.image)}
            alt={props?.title || "share"}
            width={0}
            height={0}
            loader={ImageLoader}
            className="w-full h-52 object-cover"
          />
        </div>
      )}
      <h3 className="text-lg font-bold leading-snug mb-1 line-clamp-2">
        {props?.title}
      </h3>
      <div className="text-[12px] text-gray-500 mb-4">{link}</div>
      <div className="flex items-center justify-between gap-3 mb-5">
        {SOCIALS.map(({ Button: ShareBtn, Icon, color, bg, label }) => (
          <ShareBtn key={label} url={link} title={props?.title}>
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`${bg} h-12 w-12 rounded-full border border-gray-400/20 flex items-center justify-center cursor-pointer`}
              >
                <Icon size={22} color={color} />
              </div>
              <span className="text-[10px] text-gray-500">{label}</span>
            </div>
          </ShareBtn>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Input value={link} readOnly size="large" />
        <Button
          type="primary"
          size="large"
          icon={<IoCopyOutline size={16} />}
          onClick={() => copyToClipboard(link)}
        >
          Copy
        </Button>
      </div>
    </Modal>
  );
};

export default ShareModal;
