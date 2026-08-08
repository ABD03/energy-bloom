"use client";
import { useState } from "react";
import { Card } from "antd";
import { IoShareSocialOutline } from "react-icons/io5";
import { MdOutlineDatasetLinked } from "react-icons/md";

import SocialModal from "@/components/shareModal";
import ShareModal from "./shareModal";

export default function SocialPreview(props: any) {
  const [socialOpen, setSocialOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const host = window.location.origin;
  const link = `${props?.route ? `/${props.route}` : ""}/${props?.permalink || ""}`;

  return (
    <div>
      <Card
        size="small"
        hoverable
        actions={
          [
            <div
              key="social"
              onClick={() => setSocialOpen(true)}
              className="font-medium text-[13px] text-gray-900 flex items-center justify-center gap-2"
            >
              <MdOutlineDatasetLinked className="text-primary" />
              Social
            </div>,
            <div
              key="share"
              onClick={() => setShareOpen(true)}
              className="font-medium text-[13px] text-gray-900 flex items-center justify-center gap-2"
            >
              <IoShareSocialOutline className="text-primary" /> Share
            </div>,
          ] as any
        }
      >
        <Card.Meta
          title="Preview content"
          description="See how your content will appear to users before publishing."
          className="p-0!"
        />
      </Card>
      {shareOpen ? (
        <ShareModal
          open={shareOpen}
          onCancel={() => setShareOpen(false)}
          link={`${host}${link}`}
          title={props?.title}
          meta_title={props?.meta_title}
          description={props?.description}
          meta_description={props?.meta_description}
          publishedAt={props?.publishedAt}
        />
      ) : null}

      <SocialModal
        visible={socialOpen}
        close={() => setSocialOpen(false)}
        permalink={encodeURIComponent(link)}
        title={props?.title}
        image={props?.meta_image}
      />
    </div>
  );
}
