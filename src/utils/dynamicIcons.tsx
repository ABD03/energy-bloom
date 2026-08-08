import React from "react";
import { IconType } from "react-icons";
import { CgUnavailable } from "react-icons/cg";
import { RiHome5Line, RiPagesLine } from "react-icons/ri";
import { FiUsers } from "react-icons/fi";
import { BiImages } from "react-icons/bi";
import { IoSettingsOutline } from "react-icons/io5";
import { VscFeedback } from "react-icons/vsc";
import { LiaDatabaseSolid } from "react-icons/lia";
import { LuTicketSlash } from "react-icons/lu";
import { PiUsersThree } from "react-icons/pi";
import { FaUserDoctor } from "react-icons/fa6";

function DynamicIcon(props: any) {
  type IconName =
    | "CgUnavailable"
    | "RiHome5Line"
    | "BiImages"
    | "FiUsers"
    | "RiPagesLine"
    | "IoSettingsOutline"
    | "VscFeedback"
    | "LiaDatabaseSolid"
    | "LuTicketSlash"
    | "PiUsersThree"
    | "FaUserDoctor";

  interface IconProps {
    iconName: IconName;
    size?: number;
    color?: string;
  }
  function Icon({ iconName, size = 26, color = "red" }: IconProps) {
    const icons: Record<IconName, IconType> = {
      CgUnavailable: CgUnavailable,
      RiHome5Line: RiHome5Line,
      BiImages: BiImages,
      FiUsers: FiUsers,
      RiPagesLine: RiPagesLine,
      IoSettingsOutline: IoSettingsOutline,
      VscFeedback: VscFeedback,
      LiaDatabaseSolid: LiaDatabaseSolid,
      LuTicketSlash: LuTicketSlash,
      PiUsersThree: PiUsersThree,
      FaUserDoctor: FaUserDoctor,
    };
    if (!icons.hasOwnProperty(iconName)) {
      console.warn(
        `Icon '${iconName}' not found. Rendering default icon instead.`,
      );
      iconName = "CgUnavailable";
    }
    const IconComponent = icons[iconName];
    return <IconComponent size={size} color={props.color} />;
  }
  return <Icon iconName={props.name} size={props.size} />;
}
export default DynamicIcon;
