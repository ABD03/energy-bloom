import type { Metadata } from "next";
import Script from "next/script";
import { Plus_Jakarta_Sans, Kumbh_Sans } from "next/font/google";
import { StoreProvider } from "@/redux/util/StoreProvider";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import seoMetaData from "@/utils/seoMetaData";
import { getSettings } from "@/app/(website)/service";

import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return seoMetaData(settings?.data);
}

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  fallback: ["system-ui", "sans-serif"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const kumbhSans = Kumbh_Sans({
  subsets: ["latin"],
  variable: "--font-kumbh",
  fallback: ["system-ui", "sans-serif"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();
  const lang = settings?.data?.app?.language?.code || "en";

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <Script src={"/_editor/tinymce.min.js"} />
      </head>
      <body className={`${plusJakartaSans.variable} ${kumbhSans.variable}`}>
        <StoreProvider>
          <AntdRegistry>
            {children}
            <Script
              src="https://platform.twitter.com/widgets.js"
              strategy="lazyOnload"
            />
          </AntdRegistry>
        </StoreProvider>
      </body>
    </html>
  );
}
