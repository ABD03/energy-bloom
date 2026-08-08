import { Metadata } from "next";
import PageContainer from "./pageContainer";

export const metadata: Metadata = {
  title: "Forgot Password",
  robots: { index: false, follow: false },
};

export default async function Page() {
  return <PageContainer />;
}
