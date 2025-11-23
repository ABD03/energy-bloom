
import { Button } from "antd";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import DynamicIcon from "@/util/dynamicIcons";

export default function PageHeader(props: any) {
  const navigation = useRouter();
  return (
    <div className="dashboard-PageHeader">
      {props?.showBack ? (
        <Button type="text" size="small" onClick={() => navigation.back()}>
          <ChevronLeft />
        </Button>
      ) : null}
      <div className="dashboard-PageHeader-box1">
        <div className="title">
          <DynamicIcon size={13} name={props?.icon} />
          <div className="title-text">{props?.title}</div>
        </div>
      </div>
      <div>
        <ChevronRight size={15} />
      </div>
      <div className="dashboard-PageHeader-box2">
        {props?.subtitle ? (
          <span className="total-text">{props?.subtitle}</span>
        ) : (
          <>
            <span style={{ fontSize: 18 }}>
              {props?.total ? props?.total : 0}
            </span>{" "}
            <span className="total-text">Total {props?.title}</span>
          </>
        )}
      </div>
      <div style={{ flex: 1 }} />
      {props?.children ? (
        <div className="dashboard-PageHeader-box3">{props?.children}</div>
      ) : null}
    </div>
  );
}
