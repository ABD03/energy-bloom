import ThemeProvider from "@/utils/themeProvider";
import { getMasterData, getSettings } from "./service";

import Header from "@/components/header";
import Footer from "@/components/footer";
import ScrollProgress from "@/components/scrollProgress";
import {
  HeadScripts,
  BodyScripts,
  FooterScripts,
} from "@/components/customScripts";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [settings, masterdata] = await Promise.all([
    getSettings(),
    getMasterData(),
  ]);

  return (
    <>
      <HeadScripts scripts={settings?.data?.scripts} />
      <main
        style={{
          fontFamily:
            'var(--font-kumbh), system-ui, sans-serif',
        }}
      >
        <ThemeProvider>
          <ScrollProgress />
          <Header settings={settings?.data} data={masterdata} />
          {children}
          <BodyScripts scripts={settings?.data?.scripts} />
          <Footer settings={settings?.data} masterdata={masterdata} />
        </ThemeProvider>
      </main>
      <FooterScripts scripts={settings?.data?.scripts} />
    </>
  );
}
