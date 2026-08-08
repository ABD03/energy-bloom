import { API } from "@/config/apis";
import { ViewImage } from "@/utils/viewImage";

export interface MetaContent {
  permalink?: string;
  title?: string;
  description?: string;
  image?: string;
  keywords?: string[];
  category?: string;
  type?: string;
  language?: string;
  editor?: { name?: string };
  publishedAt?: string;
  updatedAt?: string;
}

const pageMetaData = (content?: MetaContent) => {
  if (!content) return {};
  const baseUrl = API.BASE;
  const canonical = content.permalink
    ? `${baseUrl}/${content.permalink}`
    : undefined;
  const image = content.image ? ViewImage(content.image) : undefined;

  return {
    ...(content.title && { title: content.title }),
    ...(content.description && { description: content.description }),
    ...(canonical && {
      alternates: {
        canonical,
        languages: { "x-default": canonical },
      },
    }),
    openGraph: {
      ...(content.type && { type: content.type as "article" | "website" }),
      ...(content.language && { locale: content.language }),
      ...(canonical && { url: canonical }),
      ...(content.title && { title: content.title }),
      ...(content.description && { description: content.description }),
      ...(content.category && { section: content.category }),
      ...(content.keywords?.length && { tags: content.keywords }),
      ...(content.editor?.name && {
        authors: [
          `${baseUrl}/author/${encodeURIComponent(content.editor.name)}`,
        ],
      }),
      ...(content.publishedAt && { publishedTime: content.publishedAt }),
      ...(content.updatedAt && { modifiedTime: content.updatedAt }),
      ...(image && {
        images: [
          {
            url: image,
            secureUrl: image,
            width: 1200,
            height: 630,
            alt: content.title || "",
            type: "image/webp",
          },
        ],
      }),
    },
    twitter: {
      ...(content.title && { title: content.title }),
      ...(content.description && { description: content.description }),
      ...(image && {
        images: [
          {
            url: image,
            alt: content.title || "",
            width: 1200,
            height: 630,
          },
        ],
      }),
    },
  };
};

export default pageMetaData;
