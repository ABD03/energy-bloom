"use client";

export default function PageHeader(props: any) {
  return (
    <div className="flex gap-2 sm:gap-3 border-b border-slate-200 pb-3 px-3 sm:px-0! mt-2 sm:mt-0!">
      <div className="flex-1 -mt-1">
        <div className="text-lg font-semibold">{props?.title}</div>
        <div className="text-[12px] text-slate-500 mt-1">
          {props?.description}
        </div>
      </div>
    </div>
  );
}
