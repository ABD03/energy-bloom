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
    fontFamily: "Inter, sans-serif",
    borderRadius:3
  
  });
  const [antdMode, setAntdMode] = useState<"light" | "dark">("light");

  useEffect(() => {
    if (theme === "dark") setAntdMode("dark");
    else setAntdMode("light");
    const rootStyles = getComputedStyle(document.documentElement);
    setTheme({
      colorPrimary: rootStyles.getPropertyValue("--primary").trim(),
      fontFamily: rootStyles.getPropertyValue("--font-family").trim(),
      borderRadius:3
    });
  }, [theme]);

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
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
