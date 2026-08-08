import { ReactNode } from "react";
import {
  FaWhatsapp,
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaLinkedinIn,
  FaYoutube,
  FaTelegram,
  FaReddit,
  FaGoogle,
  FaThreads,
  FaPinterestP,
} from "react-icons/fa6";
import {
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
} from "react-icons/hi";

import Categories from "@/config/appCategories.json";
import Languages from "@/config/applanguages.json";

export type FieldType =
  | "input"
  | "textarea"
  | "code"
  | "file"
  | "select"
  | "multiselect";

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  prefix?: ReactNode;
  rows?: number;
  maxLength?: number;
  showCount?: boolean;
  options?: { label: string; value: string }[];
}

export interface SectionConfig {
  title: string;
  description: string;
  group: string;
  fields: FieldConfig[];
}

const languageOptions = Languages.map((l: any) => ({
  label: l.label,
  value: l.code,
}));

const categoryOptions = Categories.map((c: string) => ({
  label: c.charAt(0).toUpperCase() + c.slice(1),
  value: c,
}));

export const settingsSections: Record<string, SectionConfig[]> = {
  contact: [
    {
      title: "Contact Details",
      description:
        "Add your primary contact information so visitors can reach you via email, phone, or find your physical location.",
      group: "contact",
      fields: [
        {
          name: "email",
          label: "Email",
          type: "input",
          prefix: <HiOutlineMail />,
          placeholder: "contact@example.com",
        },
        {
          name: "phone",
          label: "Phone",
          type: "input",
          prefix: <HiOutlinePhone />,
          placeholder: "+91 0000000000",
        },
        {
          name: "location",
          label: "Location (Google Maps URL)",
          type: "input",
          prefix: <HiOutlineLocationMarker />,
          placeholder: "https://maps.app.goo.gl/...",
        },
        {
          name: "address",
          label: "Address",
          type: "textarea",
          rows: 3,
          placeholder: "Street, City, State",
        },
      ],
    },
    {
      title: "Social Media",
      description:
        "Link your social media profiles to help visitors connect with you across platforms and improve your online presence.",
      group: "contact",
      fields: [
        {
          name: "google",
          label: "Google",
          type: "input",
          prefix: <FaGoogle />,
          placeholder: "https://google.com/...",
        },
        {
          name: "whatsapp",
          label: "WhatsApp",
          type: "input",
          prefix: <FaWhatsapp />,
          placeholder: "https://chat.whatsapp.com/...",
        },
        {
          name: "facebook",
          label: "Facebook",
          type: "input",
          prefix: <FaFacebookF />,
          placeholder: "https://facebook.com/...",
        },
        {
          name: "instagram",
          label: "Instagram",
          type: "input",
          prefix: <FaInstagram />,
          placeholder: "https://instagram.com/...",
        },
        {
          name: "twitter",
          label: "X (Twitter)",
          type: "input",
          prefix: <FaXTwitter />,
          placeholder: "https://x.com/...",
        },
        {
          name: "linkedin",
          label: "LinkedIn",
          type: "input",
          prefix: <FaLinkedinIn />,
          placeholder: "https://linkedin.com/...",
        },
        {
          name: "youtube",
          label: "YouTube",
          type: "input",
          prefix: <FaYoutube />,
          placeholder: "https://youtube.com/...",
        },
        {
          name: "telegram",
          label: "Telegram",
          type: "input",
          prefix: <FaTelegram />,
          placeholder: "https://t.me/...",
        },
        {
          name: "reddit",
          label: "Reddit",
          type: "input",
          prefix: <FaReddit />,
          placeholder: "https://reddit.com/r/...",
        },
        {
          name: "threads",
          label: "Threads",
          type: "input",
          prefix: <FaThreads />,
          placeholder: "https://threads.net/@...",
        },
        {
          name: "pinterest",
          label: "Pinterest",
          type: "input",
          prefix: <FaPinterestP />,
          placeholder: "https://pinterest.com/...",
        },
      ],
    },
    {
      title: "Default Editor & Disclaimer",
      description:
        "Configure the default author information and disclaimer text displayed on articles and in the website footer.",
      group: "default_editor",
      fields: [
        {
          name: "name",
          label: "Default editor name",
          type: "input",
          placeholder: "e.g. Editorial team",
        },
        {
          name: "image",
          label: "Default editor image",
          type: "file",
        },
        {
          name: "bio",
          label: "Default editor bio",
          type: "textarea",
          rows: 3,
          maxLength: 250,
          showCount: true,
          placeholder: "Short bio shown on articles",
        },
        {
          name: "disclaimer",
          label: "Disclaimer",
          type: "textarea",
          rows: 5,
          placeholder: "Disclaimer shown in the website footer",
        },
      ],
    },
  ],
  metadata: [
    {
      title: "Meta Data",
      description:
        "Configure page titles, meta descriptions, keywords, Open Graph tags, and other SEO-related information to improve search engine visibility and social media sharing.",
      group: "meta_data",
      fields: [
        {
          name: "meta_title",
          label: "Meta title",
          type: "input",
          placeholder: "Site default meta title",
        },
        {
          name: "meta_description",
          label: "Meta description",
          type: "textarea",
          rows: 3,
          maxLength: 160,
          showCount: true,
          placeholder: "Used when an article has no description",
        },
        {
          name: "meta_keywords",
          label: "Meta keywords",
          type: "multiselect",
          placeholder: "Used when an article has no keywords",
        },
        {
          name: "meta_creator",
          label: "Website creator ( twitter tag )",
          type: "input",
          placeholder: "What is your site creator",
        },
        {
          name: "meta_image",
          label: "Meta image ( 1200 x 650 )",
          type: "file",
        },
           {
          name: "shortcut",
          label: "Shortcut Icon (32×32)",
          type: "file",
        },
        {
          name: "apple",
          label: "Apple Icon (180×180)",
          type: "file",
        },
      ],
    },
    {
      title: "Schema.org",
      description:
        "Add structured data markup to help search engines better understand your content and enhance search result appearance with rich snippets.",
      group: "schema",
      fields: [
        {
          name: "alt_name",
          label: "App alt name",
          type: "input",
          placeholder: "What is your site alt name",
        },
        {
          name: "knowsAbout",
          label: "Knows About",
          type: "textarea",
          rows: 3,
          maxLength: 300,
          showCount: true,
          placeholder: "Comma-separated topics your site covers",
        },
      ],
    },
  ],
  website: [
    {
      title: "General",
      description:
        "Configure your website name, tagline, and basic identity used across the site.",
      group: "app",
      fields: [
        {
          name: "name",
          label: "Website name",
          type: "input",
          placeholder: "Name",
        },
        {
          name: "tagline",
          label: "Title or tagline",
          type: "textarea",
          rows: 3,
          maxLength: 160,
          showCount: true,
          placeholder: "A short tagline or subtitle for your website",
        },
        {
          name: "category",
          label: "Category",
          type: "select",
          placeholder: "Select a category",
          options: categoryOptions,
        },
        {
          name: "language",
          label: "Language",
          type: "select",
          placeholder: "Select website language",
          options: languageOptions,
        },
        {
          name: "meta_alt_language",
          label: "Alternate languages",
          type: "multiselect",
          placeholder: "Select languages",
          options: languageOptions,
        },
      ],
    },
    {
      title: "Branding",
      description:
        "Upload your favicon and logo variations. The light logo is used on dark backgrounds and the dark logo on light backgrounds.",
      group: "app",
      fields: [
        {
          name: "favicon",
          label: "Favicon (32×32)",
          type: "file",
        },
        {
          name: "logo_light",
          label: "Logo Light ( 200 x 75 )",
          type: "file",
        },
        {
          name: "logo_dark",
          label: "Logo Dark ( 200 x 75 )",
          type: "file",
        },
      ],
    },

    {
      title: "Google site verification",
      description:
        "generate a verification token through Google Search Console and apply it to your domain or website",
      group: "app",
      fields: [
        {
          name: "google_verification",
          label: "Verification code",
          type: "input",
          placeholder: "eg. google-site-verification=abc123",
        },
      ],
    },
    {
      title: "Robots.txt",
      description:
        "Control how search engine crawlers access your site. Edit the full robots.txt content served at /robots.txt.",
      group: "app",
      fields: [
        {
          name: "robots_txt",
          label: "Robots.txt",
          type: "code",
          rows: 12,
          placeholder: `User-agent: *\nDisallow: /admin/\nDisallow: /api/\nAllow: /`,
        },
      ],
    },
    {
      title: "Manifest.json",
      description:
        "Configure the web app manifest for PWA support, home screen icons, and app identity.",
      group: "app",
      fields: [
        {
          name: "manifest_json",
          label: "Manifest.json",
          type: "code",
          rows: 16,
          placeholder: `{\n  "name": "My App",\n  "short_name": "App",\n  "description": "...",\n  "start_url": "/",\n  "display": "standalone",\n  "background_color": "#ffffff",\n  "theme_color": "#d81c1c"\n}`,
        },
      ],
    },
    {
      title: "Ads.txt",
      description:
        "Add your ads.txt entries for authorized digital sellers. Used by ad networks like Google AdSense to verify ad inventory.",
      group: "app",
      fields: [
        {
          name: "ads_txt",
          label: "Ads.txt",
          type: "code",
          rows: 8,
          placeholder:
            "google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0",
        },
      ],
    },
  ],
};
