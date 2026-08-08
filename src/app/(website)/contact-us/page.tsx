import { Metadata } from "next";
import { getSettings } from "../service";
import ContactContainer from "./pageContainer";

export const metadata: Metadata = {
  title: "Contact Us",
  robots: { index: false, follow: false },
};

export default async function ContactUsPage() {
  const [settings] = await Promise.all([getSettings()]);
  return (
    <div className="min-h-screen">
      <ContactContainer settings={settings?.data} />
    </div>
  );
}
