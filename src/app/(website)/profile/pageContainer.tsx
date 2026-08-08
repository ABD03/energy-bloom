"use client";

import { Button } from "antd";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { HiUser } from "react-icons/hi2";
import { IoEyeSharp, IoHelpCircle } from "react-icons/io5";
import { RiLockPasswordFill } from "react-icons/ri";

import Breadcrumbs from "@/components/breadcrumb";
import { UseAppSelector } from "@/redux/util/hooks";

import SideBar from "./_components/sideBar";
import TabBar from "./_components/tabBar";
import AccountCard from "./_components/accountCard";

import Profile from "./tabs/profile";
import ChangePassword from "./tabs/password";

export default function ProfileContainer() {
  const Auth = UseAppSelector((s: any) => s?.Auth);
  const router = useRouter();
  const searchParams = useSearchParams();
  const user: any = Auth?.user || {};
  const activeTab = searchParams.get("tab") || "profile";

  if (!Auth?.auth) {
    return (
      <div className="max-w-md mx-auto px-3 sm:px-6 py-16 text-center">
        <div className="text-lg font-semibold mb-2">You are not signed in</div>
        <div className="text-sm text-gray-500 mb-6">
          Sign in to view your profile and account settings.
        </div>
        <Link href="/login" prefetch={false}>
          <Button type="primary" size="large">
            Sign in
          </Button>
        </Link>
      </div>
    );
  }

  const handleTabChange = (key: string) => {
    if (key === "help") {
      router.push("/contact-us");
      return;
    }
    if (key === "privacy") {
      router.push("/page/privacy-policy");
      return;
    }
    router.replace(`?tab=${key}`);
  };

  const menuItems = [
    { key: "profile", label: "My Profile", Icon: HiUser },
    { key: "password", label: "Reset Password", Icon: RiLockPasswordFill },
    { key: "help", label: "Help Center", Icon: IoHelpCircle },
    { key: "privacy", label: "Account Privacy", Icon: IoEyeSharp },
  ];

  const content = (
    <div className="flex-1 h-full">
      {activeTab === "profile" && <Profile Auth={Auth} />}
      {activeTab === "password" && <ChangePassword Auth={Auth} />}
      {activeTab === "help" && <div>help</div>}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto pt-2 px-3 sm:px-0">
      <Breadcrumbs />
      {/* Desktop: sidebar + content */}
      <div className="h-full hidden sm:flex sm:gap-12 mt-2">
        <SideBar
          menuItems={menuItems}
          user={user}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
        <div className="flex-1 h-full">
          {activeTab === "profile" ? <AccountCard Auth={Auth} /> : null}
          {content}
        </div>
      </div>

      {/* Mobile: tabs */}
      <div className="sm:hidden">
        {activeTab === "profile" ? (
          <div className="my-2">
            <AccountCard Auth={Auth} />
          </div>
        ) : null}

        <TabBar
          menuItems={menuItems}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        >
          {content}
        </TabBar>
      </div>
    </div>
  );
}
