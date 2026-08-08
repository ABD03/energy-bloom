"use client";

import { useState } from "react";
import { Button, message, Tag } from "antd";
import { FiGlobe, FiActivity, FiExternalLink } from "react-icons/fi";
import { PiBracketsCurly } from "react-icons/pi";
import { IoTextOutline } from "react-icons/io5";
import { MdCached } from "react-icons/md";
import { IoCopyOutline } from "react-icons/io5";
import { API } from "@/config/apis";
import { GET } from "@/utils/apiCalls";

export default function OverviewSection({ data }: { data?: any }) {
  const app = data?.app || {};
  const domain = window.location.origin || "/";

  const [loading, setLoading] = useState(false);

  const resetCache = async () => {
    try {
      setLoading(true);
      const response: any = await GET(`${API.REVALIDATE}?tag=refresh`, null);
      if (response?.status) {
        message.success("Cache cleared successfully");
      } else {
        message.error(response?.message || "Failed to clear cache");
      }
    } catch {
      message.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  function InfoRow({
    icon: Icon,
    label,
    value,
    action,
  }: {
    icon: any;
    label: string;
    value?: React.ReactNode;
    action?: React.ReactNode;
  }) {
    return (
      <div className="py-3 border-b border-gray-100 last:border-0">
        <div className="flex gap-4">
          <div className="h-9 w-9 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
            <Icon size={20} className="text-primary" />
          </div>
          <div className="flex-1 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className=" text-xs text-gray-500 mb-2">{label}</div>
              <div className="text-sm text-gray-800">
                {value || <span className="text-gray-300 italic">Not set</span>}
              </div>
            </div>
            {action ? <div>{action}</div> : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <InfoRow icon={IoTextOutline} label="Website Name" value={app.name} />
      <InfoRow
        icon={FiActivity}
        label="Status"
        value={
          <div>
            {data?._id ? (
              <Tag color="green">
                <span
                  className={`inline-block h-2 w-2 mr-2 rounded-full bg-green-500 animate-pulse`}
                />{" "}
                Active
              </Tag>
            ) : (
              <Tag color="red">Not configured</Tag>
            )}
          </div>
        }
      />
      <InfoRow
        icon={FiGlobe}
        label="Domain"
        value={domain}
        action={
          <Button
            onClick={() => window.open(domain, "_blank", "noopener noreferrer")}
          >
            Open Website
          </Button>
        }
      />

      <InfoRow
        icon={MdCached}
        label="Reset Cache"
        value={
          <div className="text-[12px] text-red-400">
            Clears locally cached data and forces a fresh fetch from the server.
            Use this if content appears outdated or fails to load, especially
            after a recent deployment.
          </div>
        }
        action={
          <Button onClick={() => resetCache()} loading={loading}>
            Reset Cache
          </Button>
        }
      />
      <InfoRow
        icon={PiBracketsCurly}
        label="Sitemap Path"
        value={
          <code className="text-xs bg-gray-100 px-2 py-1 rounded">
            {domain}/sitemap.xml
          </code>
        }
        action={
          <div className="flex gap-2">
            <Button
              className="p-2!"
              onClick={() => {
                navigator.clipboard.writeText(`${domain}/sitemap.xml`);
                message.success("Copied");
              }}
            >
              <IoCopyOutline size={16} className="text-green-500" />
            </Button>
            <Button
              className="p-2!"
              onClick={() =>
                window.open(
                  `${domain}/sitemap.xml`,
                  "_blank",
                  "noopener noreferrer",
                )
              }
            >
              <FiExternalLink size={16} />
            </Button>
          </div>
        }
      />

      <InfoRow
        icon={PiBracketsCurly}
        label="Robots.txt"
        value={
          <code className="text-xs bg-gray-100 px-2 py-1 rounded">
            {domain}/robots.txt
          </code>
        }
        action={
          <div className="flex gap-2">
            <Button
              className="p-2!"
              onClick={() => {
                navigator.clipboard.writeText(`${domain}/robots.txt`);
                message.success("Copied");
              }}
            >
              <IoCopyOutline size={16} className="text-green-500" />
            </Button>
            <Button
              className="p-2!"
              onClick={() =>
                window.open(
                  `${domain}/robots.txt`,
                  "_blank",
                  "noopener noreferrer",
                )
              }
            >
              <FiExternalLink size={16} />
            </Button>
          </div>
        }
      />
      <InfoRow
        icon={PiBracketsCurly}
        label="LLMs.txt ( AI Agent Accessibility — helps ChatGPT / Perplexity / Claude understand your site )"
        value={
          <code className="text-xs bg-gray-100 px-2 py-1 rounded">
            {domain}/llms.txt
          </code>
        }
        action={
          <div className="flex gap-2">
            <Button
              className="p-2!"
              onClick={() => {
                navigator.clipboard.writeText(`${domain}/llms.txt`);
                message.success("Copied");
              }}
            >
              <IoCopyOutline size={16} className="text-green-500" />
            </Button>
            <Button
              className="p-2!"
              onClick={() =>
                window.open(
                  `${domain}/llms.txt`,
                  "_blank",
                  "noopener noreferrer",
                )
              }
            >
              <FiExternalLink size={16} />
            </Button>
          </div>
        }
      />
      <InfoRow
        icon={PiBracketsCurly}
        label="Manifest.json"
        value={
          <code className="text-xs bg-gray-100 px-2 py-1 rounded">
            {domain}/manifest.json
          </code>
        }
        action={
          <div className="flex gap-2">
            <Button
              className="p-2!"
              onClick={() => {
                navigator.clipboard.writeText(`${domain}/manifest.json`);
                message.success("Copied");
              }}
            >
              <IoCopyOutline size={16} className="text-green-500" />
            </Button>
            <Button
              className="p-2!"
              onClick={() =>
                window.open(
                  `${domain}/manifest.json`,
                  "_blank",
                  "noopener noreferrer",
                )
              }
            >
              <FiExternalLink size={16} />
            </Button>
          </div>
        }
      />
    </div>
  );
}
