"use client";
import { useEffect, useState } from "react";
import { ConfigProvider, Layout, message, Result, theme } from "antd";
import { UseAppSelector } from "@/redux/util/hooks";
import SiderBar from "./_components/siderBar";

function LayoutWrapper({ children }: Readonly<{ children: React.ReactNode }>) {
  const [themes, setTheme] = useState({
    colorPrimary: "#6104cc",
    fontFamily: "var(--font-plus-jakarta-sans)",
    borderRadius: 8,
  });
  const [mounted, setMounted] = useState(false);
  const Auth = UseAppSelector((state: any) => state?.Auth);

  useEffect(() => {
    setMounted(true);
    message.config({ top: 70 });
  }, []);

  if (!mounted) return null;

  return (
    <main
      style={{
        fontFamily: "var(--font-plus-jakarta-sans), system-ui, sans-serif",
      }}
    >
      <ConfigProvider
        theme={{
          algorithm: theme.defaultAlgorithm,
          token: themes,
          components: {
            Form: {
              labelFontSize: 12,
              verticalLabelMargin: 2,
              verticalLabelPadding: 0,
              itemMarginBottom: 10,
            },
            Table: {
              borderRadius: 0,
              headerBorderRadius: 0,
              fontWeightStrong: 500,
            },
            Button: {
              paddingContentHorizontal: 25,
              primaryShadow: "none",
              fontSizeLG: 14,
              fontSize: 13,
            },
          },
        }}
      >
        {Auth?.auth && Auth?.user?.type === "editor" ? (
          <Layout>
            <Layout.Sider
              breakpoint="lg"
              collapsedWidth="0"
              width={240}
              style={{ height: "100vh" }}
              className="hidden! lg:block!"
            >
              <SiderBar />
            </Layout.Sider>
            <Layout>
              <Layout.Content>
                <div className="h-screen overflow-y-scroll scrollbar-hide bg-linear-to-b from-primary/4 to-sky-300/10">
                  {children}
                </div>
              </Layout.Content>
            </Layout>
          </Layout>
        ) : (
          <Result status="404" />
        )}
      </ConfigProvider>
    </main>
  );
}
export default LayoutWrapper;
