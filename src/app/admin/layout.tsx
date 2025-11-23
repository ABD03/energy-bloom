"use client";
import "./styles.scss";
import { Layout } from "antd";
import SiderBar from "./_components/siderBar";
import { Inter } from "next/font/google";

 const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
  });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

 
  
  return (
    <main lang="en" className={inter.variable}>
      <Layout>
        <Layout.Sider
          breakpoint="lg"
          collapsedWidth="0"
          width={230}
          style={{ height: "100vh" }}
        >
          <SiderBar/>
        </Layout.Sider>
        <Layout>
          <Layout.Content>
            <div>{children}</div>
          </Layout.Content>
        </Layout>
      </Layout>
    </main>
  );
}
