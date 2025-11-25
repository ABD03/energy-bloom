import { useCallback } from "react";
import { Button, Card, Tag } from "antd";
import { File, SquarePen } from "lucide-react";

const HistoryItem = (props: any) => {
  return (
    <Card
      size="small"
      title={<div className="font-base font-medium">{props?.item?.doctor}</div>}
      style={{marginBottom:30}}
      extra={
        <div className="flex gap-2">
          <Tag
            variant="outlined"
            color={
              props?.item?.status === "pending"
                ? "orange"
                : props?.item?.status === "canceled"
                ? "red"
                : "green"
            }
            className="text-xs!"
          >
            {props?.item?.status}
          </Tag>
          <Button type="text" size="small" onClick={() => props?.onClick()}>
            <SquarePen size={15} />
          </Button>
        </div>
      }
    >
      {props?.item?.status === "pending" ? (
        <div>This appointment is not confirmed yet. Action needed</div>
      ) : (
        <div>{props?.item?.desc}</div>
      )}
      {props?.item?.files?.length ? (
        <div className="mt-5 flex flex-wrap gap-4">
          {props?.item?.files?.map((file: any) => (
            <Button type="default" key={file?.id}>
              {file?.name}
              <File size={15} />
            </Button>
          ))}
        </div>
      ) : null}
    </Card>
  );
};

export default HistoryItem;
