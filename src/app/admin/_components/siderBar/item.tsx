import DynamicIcon from "@/utils/dynamicIcons";
import { usePathname, useRouter } from "next/navigation";

export default function Item(props: any) {
  const navigation = useRouter();
  const pathname = usePathname();

  const isActive =
    pathname === props?.item?.base ||
    pathname.startsWith(props?.item?.base + "/");

  return (
    <div
      className={`flex items-center gap-2.5 my-0.5 p-2 rounded-lg text-[14px] cursor-pointer transition
    ${
      isActive
        ? "bg-linear-to-r from-primary to-primary/60 text-white font-semibold"
        : "text-black hover:bg-[#f5f7f9] hover:text-primary"
    } text-[13px]!`}
      onClick={() => navigation.push(props?.item?.route)}
    >
      <div>
        <DynamicIcon size={20} name={props?.item?.icon} />
      </div>
      <div>{props?.item?.menu}</div>
    </div>
  );
}
