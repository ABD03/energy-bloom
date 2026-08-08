"use client";

interface SideBarProps {
  menuItems: any[];
  user: any;
  activeTab: string;
  onTabChange: (key: string) => void;
}

export default function SideBar({
  menuItems,
  activeTab,
  onTabChange,
}: SideBarProps) {
  return (
    <div className="sm:min-h-screen w-68 shrink-0 border-r border-slate-500/10">
      <div className="flex flex-col gap-2">
        {menuItems.map(({ key, label, Icon }) => (
          <div
            key={key}
            onClick={() => onTabChange(key)}
            className={`flex items-center gap-3 px-3 py-2 mr-6 rounded-lg cursor-pointer text-[13px] font-medium transition-colors ${
              activeTab === key
                ? "bg-primary/10 text-primary"
                : "text-gray-1000/10 hover:bg-gray-100"
            }`}
          >
            <Icon size={16} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
