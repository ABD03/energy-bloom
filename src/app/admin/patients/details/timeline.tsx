"use client";
import { Timeline } from "antd";
import Empty from "../../_components/empty";
import TimelineItem from "../_components/timelineItem";

const DOT_COLORS: Record<string, string> = {
  upcoming: "blue",
  attended: "green",
  expired: "orange",
  cancelled: "red",
};

function TimelineTab({
  data = [] as any[],
  onAttend,
}: {
  data?: any[];
  onAttend?: (appt: any) => void;
}) {
  if (!data.length) return <Empty />;

  const items = data.map((appt: any) => ({
    color: DOT_COLORS[appt?.status] || "gray",
    content: <TimelineItem appt={appt} onAttend={onAttend} />,
  }));

  return (
    <div>
      <Timeline items={items} />
    </div>
  );
}

export default TimelineTab;
