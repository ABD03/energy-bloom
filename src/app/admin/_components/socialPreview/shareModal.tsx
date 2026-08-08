"use client";
import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Checkbox,
  Collapse,
  Input,
  message,
  Modal,
  Space,
} from "antd";
import { IoCopyOutline } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";
import {
  FaWhatsapp,
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaTelegram,
  FaThreads,
} from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";
import { dayjs } from "@/utils/common";
import { UseAppSelector } from "@/redux/util/hooks";
import { FiEdit3 } from "react-icons/fi";

const socialPlatforms = [
  { key: "whatsapp", label: "WhatsApp", icon: <FaWhatsapp /> },
  { key: "facebook", label: "Facebook", icon: <FaFacebookF /> },
  { key: "instagram", label: "Instagram", icon: <FaInstagram /> },
  { key: "twitter", label: "X (Twitter)", icon: <FaXTwitter /> },
  { key: "youtube", label: "YouTube", icon: <FaYoutube /> },
  { key: "telegram", label: "Telegram", icon: <FaTelegram /> },
  { key: "threads", label: "Threads", icon: <FaThreads /> },
];

function whatsappToHtml(text: string): string {
  if (!text) return "";
  const escape = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return escape(text).replace(/\*([^*\n]+)\*/g, "<strong>$1</strong>");
}

interface ShareOptions {
  includeDate: boolean;
  includeDescription: boolean;
  includeReadMore: boolean;
  includeContact: boolean;
  includeBrand: boolean;
  selectedSocials: string[];
}

export default function ShareModal(props: any) {
  const Data = UseAppSelector((state: any) => state?.Data);
  const contact = Data?.settings?.settings?.contact || {};

  const availableSocials = useMemo(
    () => socialPlatforms.filter((p) => contact[p.key]?.trim()),
    [contact],
  );

  const [options, setOptions] = useState<ShareOptions>({
    includeDate: true,
    includeDescription: true,
    includeReadMore: true,
    includeContact: true,
    includeBrand: true,
    selectedSocials: [],
  });

  useEffect(() => {
    if (props?.open) {
      setOptions((prev) => ({
        ...prev,
        selectedSocials: availableSocials.map((s) => s.key),
      }));
    }
  }, [props?.open, availableSocials]);

  const dateLabel = props?.publishedAt
    ? dayjs(props.publishedAt).format("D MMMM")
    : dayjs().format("D MMMM");

  const brandName = Data?.settings?.settings?.app?.name || "";
  const contactNumber = contact?.phone || "";

  const shareText = useMemo(() => {
    const socialLinks = options.selectedSocials
      .map((key) => {
        const platform = socialPlatforms.find((p) => p.key === key);
        if (!platform || !contact[key]?.trim()) return null;
        return { label: platform.label, url: contact[key].trim() };
      })
      .filter(Boolean) as { label: string; url: string }[];

    return buildShareText(
      {
        title: props?.meta_title || props?.title || "",
        description: props?.meta_description || props?.description || "",
        link: props?.link || "",
        date: dateLabel,
        brandName,
        contactNumber,
        socialLinks,
      },
      options,
    );
  }, [
    props?.meta_title,
    props?.title,
    props?.meta_description,
    props?.description,
    props?.link,
    dateLabel,
    brandName,
    contactNumber,
    options,
    contact,
  ]);

  const [editedText, setEditedText] = useState(shareText);

  useEffect(() => {
    setEditedText(shareText);
  }, [shareText]);

  const toggle = (key: keyof Omit<ShareOptions, "selectedSocials">) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleSocial = (key: string, checked: boolean) => {
    setOptions((prev) => ({
      ...prev,
      selectedSocials: checked
        ? [...prev.selectedSocials, key]
        : prev.selectedSocials.filter((k) => k !== key),
    }));
  };
  

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      message.success("Copied to clipboard");
    } catch {
      message.error("Failed to copy");
    }
  };

  function buildShareText(
  args: {
    title: string;
    description: string;
    link: string;
    date: string;
    brandName: string;
    contactNumber: string;
    socialLinks: { label: string; url: string }[];
  },
  options: ShareOptions,
) {
  const lines: string[] = [];

  const titlePart = options.includeDate && args.date
    ? `🧾  *${args.title} (${args.date})*`
    : `🧾  *${args.title}*`;
  lines.push(titlePart);

  if (options.includeDescription && args.description) {
    const desc = args.description.trim();
    const trimmed = desc.length > 220 ? desc.slice(0, 220).trim() + "…" : desc;
    lines.push("", trimmed);
  }

  if (options.includeReadMore) {
    lines.push(
      `*കൂടുതൽ വായിക്കുന്നതിന് ലിങ്കിൽ ക്ലിക്ക് ചെയ്യുക*`,
      ` - ${args.link}`,
    );
  }

  if (args.socialLinks.length > 0) {
    lines.push("", `*Follow us* 👇`);
    for (const s of args.socialLinks) {
      lines.push(`${s.label}: ${s.url}`);
    }
  }

  if (options.includeContact && args.contactNumber) {
    lines.push(
      "",
      `*വാർത്തകളും, പരസ്യങ്ങളും നൽകുന്നതിനായി താഴെ കാണുന്ന നമ്പറിൽ ബന്ധപ്പെടുക Mob: ${args.contactNumber}*`,
    );
  }

  if (options.includeBrand && args.brandName) {
    lines.push(`*🔊${args.brandName}🔊*`);
  }

  return lines.join("\n");
}

  return (
    <Modal
      title="Share on WhatsApp"
      onCancel={props?.onCancel}
      open={props?.open}
      footer={null}
      width={460}
      centered
    >
      <div className="rounded-xl bg-[#dcf8c6] text-[13.5px] text-gray-900 p-4 mb-3 overflow-y-auto">
        <div
          className="whitespace-pre-wrap leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: whatsappToHtml(editedText).replace(
              /(https?:\/\/[^\s]+)/g,
              '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline">$1</a>',
            ),
          }}
        />
      </div>

      <Collapse
        size="small"
        className="mt-3!"
        items={[
          {
            key: "edit",
            label: (
              <span className="flex items-center gap-1.5 text-xs font-medium">
                <FiEdit3 size={14} />
                Edit text
              </span>
            ),
            children: (
              <Input.TextArea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                autoSize={{ minRows: 6, maxRows: 12 }}
                className="font-mono! text-[12px]!"
              />
            ),
          },
          {
            key: "settings",
            label: (
              <span className="flex items-center gap-1.5 text-xs font-medium">
                <IoSettingsOutline size={14} />
                Settings
              </span>
            ),
            children: (
              <div className="flex flex-col gap-2.5">
                <div className="grid grid-cols-3 gap-x-2 gap-y-1">
                  <Checkbox
                    checked={options.includeDate}
                    onChange={() => toggle("includeDate")}
                  >
                    <span className="text-xs">Date</span>
                  </Checkbox>
                  <Checkbox
                    checked={options.includeDescription}
                    onChange={() => toggle("includeDescription")}
                  >
                    <span className="text-xs">Description</span>
                  </Checkbox>
                  <Checkbox
                    checked={options.includeReadMore}
                    onChange={() => toggle("includeReadMore")}
                  >
                    <span className="text-xs">Read more</span>
                  </Checkbox>
                  <Checkbox
                    checked={options.includeContact}
                    onChange={() => toggle("includeContact")}
                  >
                    <span className="text-xs">Contact</span>
                  </Checkbox>
                  <Checkbox
                    checked={options.includeBrand}
                    onChange={() => toggle("includeBrand")}
                  >
                    <span className="text-xs">Brand</span>
                  </Checkbox>
                </div>
                {availableSocials.length > 0 && (
                  <div className="grid grid-cols-3 gap-x-2 gap-y-1 border-t border-gray-200 pt-2">
                    {availableSocials.map((platform) => (
                      <Checkbox
                        key={platform.key}
                        checked={options.selectedSocials.includes(platform.key)}
                        onChange={(e) =>
                          toggleSocial(platform.key, e.target.checked)
                        }
                      >
                        <span className="flex items-center gap-1 text-xs">
                          {platform.icon}
                          {platform.label}
                        </span>
                      </Checkbox>
                    ))}
                  </div>
                )}
              </div>
            ),
          },
        ]}
      />

      <div className="flex items-center justify-between gap-2 mt-3">
        <div></div>
        <Space>
          <Button onClick={props?.onCancel}>Close</Button>
          <Button
            type="primary"
            icon={<IoCopyOutline size={16} />}
            onClick={() => copyToClipboard(editedText)}
          >
            Copy
          </Button>
        </Space>
      </div>
    </Modal>
  );
}
