import React from "react";
import { IconType } from "react-icons";
import { CgUnavailable } from "react-icons/cg";
import { RiHome5Line } from "react-icons/ri";
import { FiEdit } from "react-icons/fi";
import { IoMdAdd } from "react-icons/io";
import { BiImages } from "react-icons/bi";
import { FiUsers } from "react-icons/fi";
import { RiPagesLine } from "react-icons/ri";
import { PiUsersThree } from "react-icons/pi";
import {
  IoSettingsOutline,
  IoStatsChartOutline,
  IoPricetagsOutline,
} from "react-icons/io5";
import { VscFeedback } from "react-icons/vsc";
import { TiTabsOutline } from "react-icons/ti";
import { LiaDatabaseSolid } from "react-icons/lia";
import { TbFlag } from "react-icons/tb";

function DynamicIcon(props: any) {
  type IconName =
    | "CgUnavailable"
    | "RiHome5Line"
    | "FiEdit"
    | "IoMdAdd"
    | "BiImages"
    | "FiUsers"
    | "RiPagesLine"
    | "PiUsersThree"
    | "IoSettingsOutline"
    | "VscFeedback"
    | "TiTabsOutline"
    | "LiaDatabaseSolid"
    | "TbFlag"
    | "IoStatsChartOutline"
    | "IoPricetagsOutline";

  interface IconProps {
    iconName: IconName;
    size?: number;
    color?: string;
  }
  function Icon({ iconName, size = 26, color = "red" }: IconProps) {
    const icons: Record<IconName, IconType> = {
      CgUnavailable: CgUnavailable,
      RiHome5Line: RiHome5Line,
      FiEdit: FiEdit,
      IoMdAdd: IoMdAdd,
      BiImages: BiImages,
      FiUsers: FiUsers,
      RiPagesLine: RiPagesLine,
      PiUsersThree: PiUsersThree,
      IoSettingsOutline: IoSettingsOutline,
      VscFeedback: VscFeedback,
      TiTabsOutline: TiTabsOutline,
      LiaDatabaseSolid: LiaDatabaseSolid,
      TbFlag: TbFlag,
      IoStatsChartOutline: IoStatsChartOutline,
      IoPricetagsOutline: IoPricetagsOutline,
    };
    if (!icons.hasOwnProperty(iconName)) {
      console.warn(
        `Icon '${iconName}' not found. Rendering default icon instead.`,
      );
      iconName = "CgUnavailable"; // set default icon name
    }
    const IconComponent = icons[iconName];
    return <IconComponent size={size} color={props.color} />;
  }
  return <Icon iconName={props.name} size={props.size} />;
}
export default DynamicIcon;
