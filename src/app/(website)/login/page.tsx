import { Suspense } from "react";
import { Metadata } from "next";
import PageContainer from "./pageContainer";

export const metadata: Metadata = {
  title: "Login",
  robots: { index: false, follow: false },
};
export default async function Page() {
  return (
    <div>
      <Suspense>
        <PageContainer />
      </Suspense>
    </div>
  );
}
