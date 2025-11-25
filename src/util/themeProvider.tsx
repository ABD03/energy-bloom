"use client";
import { ThemeProvider as NextThemeProvider, useTheme } from "next-themes";
import { ConfigProvider, theme as antdTheme } from "antd";
import { useEffect, useState } from "react";

export default function ThemeProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AntdThemeWrapper>{children}</AntdThemeWrapper>
    </NextThemeProvider>
  );
}

function AntdThemeWrapper({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const [themes, setTheme] = useState({
    colorPrimary: "#824ff8",
    fontFamily: "var(--font-inter)",
    borderRadius: 6,
  });
  const [antdMode, setAntdMode] = useState<"light" | "dark">("light");

  return (
    <ConfigProvider
      theme={{
        algorithm:
          antdMode === "dark"
            ? antdTheme.darkAlgorithm
            : antdTheme.defaultAlgorithm,
        token: themes,
        components: {
          Notification: {
            padding: 2,
          },
          Form:{
            labelFontSize:13,
            verticalLabelMargin:2,
            verticalLabelPadding:0,
            itemMarginBottom:15
          }
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
