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
    <NextThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
    >
      <AntdThemeWrapper>{children}</AntdThemeWrapper>
    </NextThemeProvider>
  );
}

function AntdThemeWrapper({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark
          ? antdTheme.darkAlgorithm
          : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: "#6104cc",
          fontFamily: "var(--font-kumbh)",
          fontSizeLG: 14,
          borderRadius: 8,
        },
        components: {
          Form: {
            itemMarginBottom: 10,
            verticalLabelPadding: 2,
            labelFontSize: 14,
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
