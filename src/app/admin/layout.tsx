"use client";
import "./styles.scss";
import { Layout } from "antd";
import SiderBar from "./_components/siderBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main lang="en">
      <Layout>
        <Layout.Sider
          breakpoint="lg"
          collapsedWidth="0"
          width={230}
          style={{ height: "100vh" }}
        >
          <SiderBar />
        </Layout.Sider>
        <Layout>
          <Layout.Content>
            <div className="dashboard-Content">{children}</div>
          </Layout.Content>
        </Layout>
      </Layout>
    </main>
  );
}
