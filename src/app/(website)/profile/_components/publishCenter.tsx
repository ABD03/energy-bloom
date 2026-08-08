"use client";

import { useEffect, useState } from "react";
import { Card } from "antd";
import { BsFileText, BsCollection, BsPatchQuestion } from "react-icons/bs";

import { GET } from "@/utils/apiCalls";
import { API } from "@/config/apis";

export default function PublishCenter(props: any) {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    GET(`${API.USER_STATS}?id=${props?.user?._id}`, null).then((res: any) => {
      if (res?.status) setStats(res.data);
    });
  }, []);

  const items = [
    {
      icon: <BsFileText size={20} />,
      label: "Contents",
      count: stats?.contents ?? "-",
    },
    {
      icon: <BsCollection size={20} />,
      label: "Stories",
      count: stats?.stories ?? "-",
    },
    {
      icon: <BsPatchQuestion size={20} />,
      label: "Quizzes",
      count: stats?.quizzes ?? "-",
    },
  ];

  return (
    <Card title="Publish Center" size="small" className="mb-4!"
    extra={<a className="text-primary" href={`/author/${props?.user?.username}`}>View Page</a>}>
      <div className="grid grid-cols-3 gap-3">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex flex-col items-center gap-1 py-3 rounded-xl bg-primary/5"
          >
            <div className="text-primary">{item.icon}</div>
            <div className="text-xl font-bold">{item.count}</div>
            <div className="text-[11px] text-gray-500">{item.label}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
