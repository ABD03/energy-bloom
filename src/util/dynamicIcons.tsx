import React from "react";
import {
  SquareDashed,
  Settings,
  UsersRound,
  FileUser,
  CalendarCheck,
  LayoutGrid,
  MessagesSquare,
  SquareUserRound,
  List,
  ClockFading
} from "lucide-react";

type IconName =
  | "SquareDashed"
  | "Settings"
  | "UsersRound"
  | "FileUser"
  | "CalendarCheck"
  | "LayoutGrid"
  | "MessagesSquare"
  | "SquareUserRound"
  | "List"
  |"ClockFading";

interface DynamicIconProps {
  name: IconName;
  size?: number;
  color?: string;
}

const icons: Record<IconName, React.ComponentType<any>> = {
  SquareDashed,
  Settings,
  UsersRound,
  FileUser,
  CalendarCheck,
  LayoutGrid,
  MessagesSquare,
  SquareUserRound,
  List,
  ClockFading
};

function DynamicIcon({ name, size = 20, color = "gray" }: DynamicIconProps) {
  const IconComponent = icons[name];

  if (!IconComponent) {
    console.warn(`Icon '${name}' not found. Using default icon.`);
    return <SquareDashed size={size} color={color}/>;
  }

  return <IconComponent size={size} />;
}

export default DynamicIcon;
