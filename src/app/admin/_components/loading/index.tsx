"use client";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
export default function Loading(props: any) {
  return (
    <div className="flex flex-col items-center justify-center h-[50vh]">
      <div className="bg-white flex flex-col items-center justify-center p-[20px_30px] aspect-square border border-[#f2f2f2] rounded-[10px]">
        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
        <br />
        <div>Loading . . .</div>
      </div>
    </div>
  );
}
