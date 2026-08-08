import ProfileContainer from "./pageContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
  robots: { index: false, follow: false },
};

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-500/5">
      <ProfileContainer />
    </div>
  );
}
