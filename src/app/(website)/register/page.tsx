import { Suspense } from "react";
import PageContainer from "./pageContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register",
  robots: { index: false, follow: false },
};

export default async function Page() {
  return (
    <div >
      <Suspense>
        <PageContainer />
      </Suspense>
    </div>
  );
}
