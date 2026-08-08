"use client";
import { Tabs } from "antd";
interface TabBarProps {
  menuItems: any[];
  activeTab: string;
  onTabChange: (key: string) => void;
  children: React.ReactNode;
}

export default function TabBar({
  menuItems,
  activeTab,
  onTabChange,
  children,
}: TabBarProps) {
  const items = menuItems.map(({ key, label, Icon }: any) => ({
    key,
    label: (
      <span className="inline-flex items-center gap-1.5">
        <Icon size={14} />
        <span className="text-[12px]">{label}</span>
      </span>
    ),
    children,
  }));

  return (
    <Tabs
      activeKey={activeTab}
      onChange={onTabChange}
      items={items}
      size="small"
      centered
    />
  );
}
