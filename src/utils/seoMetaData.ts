import { API } from "@/config/apis";
import { FindFileType } from "./common";
import { ViewImage } from "./viewImage";

export interface MetaSettings {
  app?: {
    name?: string;
    category?: string;
    favicon?: string;
    language?: { og_locale?: string };
    meta_alt_language?: { og_locale?: string }[];
    google_verification?: string;
  };
  meta_data?: {
    meta_title?: string;
    meta_description?: string;
    meta_image?: string;
    meta_keywords?: string[];
    meta_creator?: string;
    shortcut?: string;
    apple?: string;
  };
  default_editor?: {
    name?: string;
  };
}

const seoMetaData = (settings?: MetaSettings) => {
  const baseUrl = API.BASE;
  const app = settings?.app;
  const meta_data = settings?.meta_data;
  const dEditor = settings?.default_editor;

  const title = meta_data?.meta_title || process.env?.NEXT_PUBLIC_NAME || "Title";
  const description = meta_data?.meta_description || "Description";
  const image = ViewImage(meta_data?.meta_image);
  const keywords = meta_data?.meta_keywords;
  const language = app?.language?.og_locale || "en_US";
  const alt_language = app?.meta_alt_language
    ?.map((l) => l.og_locale)
    .filter((v): v is string => Boolean(v));

  return {
    metadataBase: new URL(baseUrl),
    category: app?.category || "website",
    title: title,
    description: description,
    alternates: {
      canonical: baseUrl,
      languages: {
        "x-default": baseUrl,
      },
    },

    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large" as const,
      "max-snippet": -1,
      "max-video-preview": -1,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large" as const,
      },
    },

    manifest: "/manifest.json",

    verification: {
      google: app?.google_verification || "",
    },

    openGraph: {
      locale: language,
      alternateLocale: alt_language?.length ? alt_language : [language],
      type: "website" as const,
      authors: [
        `${baseUrl}/author/${encodeURIComponent(dEditor?.name || "Author")}`,
      ],
      section: app?.category || "website",
      tags: keywords || [],
      url: baseUrl,
      siteName: app?.name || "Website",
      title: title,
      description: description,
      images: [
        {
          url: image,
          secureUrl: image,
          width: 1200,
          height: 630,
          alt: title,
          type: FindFileType(image),
        },
      ],
    },

    twitter: {
      card: "summary_large_image" as const,
      site: meta_data?.meta_creator || "@site",
      creator: meta_data?.meta_creator || "@editor",
      title: title,
      description: description,
      images: [
        {
          url: image,
          alt: title,
          width: 1200,
          height: 630,
        },
      ],
    },

    icons: {
      icon: [
        {
          url: ViewImage(app?.favicon),
          sizes: "32x32",
          type: FindFileType(app?.favicon),
        },
        {
          url: ViewImage(meta_data?.shortcut),
          sizes: "16x16",
          type: FindFileType(meta_data?.shortcut),
        },
      ],
      apple: [
        {
          url: ViewImage(meta_data?.apple),
          sizes: "180x180",
          type: FindFileType(meta_data?.apple),
        },
      ],
    },
  };
};

export default seoMetaData;
