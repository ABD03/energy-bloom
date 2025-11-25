import DynamicIcon from "@/util/dynamicIcons";
import { usePathname, useRouter } from "next/navigation";

export default function Item(props: any) {
  const navigation = useRouter();
  const pathname = usePathname();

  const isActive =
    pathname === props?.item?.base ||
    pathname.startsWith(props?.item?.base + "/");

  return (
    <div
      className={`dashboard-siderbar-item ${isActive ? "active" : ""}`}
      onClick={() => navigation.push(props?.item?.route)}
    >
     
      <div className="flex-1">{props?.item?.menu}</div>
       <div className="icon">
        <DynamicIcon size={18} name={props?.item?.icon} />
      </div>
    </div>
  );
}
