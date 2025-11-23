import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import ThemeProviders from "@/util/themeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Energy Bloom",
  description: "PRANIC FENGSHUI CENTRE",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <AntdRegistry><ThemeProviders>{children}</ThemeProviders></AntdRegistry>
      </body>
    </html>
  );
}
