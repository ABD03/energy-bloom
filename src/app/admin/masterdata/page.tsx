"use client";

import { useState } from "react";
import { Button, Tabs, TabsProps } from "antd";
import { RiRefreshLine } from "react-icons/ri";
import { useRouter, useSearchParams } from "next/navigation";

import PageHeader from "../_components/pageHeader";

export default function MasterData() {
  const navigation = useRouter();
  const searchParams = useSearchParams();
  const view = searchParams.get("view") || "";

  const [refresh, setRefresh] = useState<any>(false);

  const items: TabsProps["items"] = [];

  const onChange = (key: string) => {
    navigation.push(`/admin/masterdata?view=${key}`);
  };

  return (
    <div>
      <PageHeader
        title={"Master Datas"}
        icon={"LiaDatabaseSolid"}
        showBack={true}
        showMenu={false}
        showMobileBack={false}
        showMobileMenu={true}
        subtitle={"All Notification"}
      >
        <Button onClick={() => setRefresh(true)} className="p-2!">
          <RiRefreshLine size={18} />
        </Button>
      </PageHeader>
      <Tabs
        size="small"
        defaultActiveKey={view}
        items={items}
        onChange={onChange}
      />
    </div>
  );
}
