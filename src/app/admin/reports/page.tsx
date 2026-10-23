"use client";

import { useEffect, useRef, useState } from "react";
import { Button, message, Select, Table, Tabs } from "antd";
import { RiRefreshLine } from "react-icons/ri";

import PageHeader from "../_components/pageHeader";
import Empty from "../_components/empty";
import Expense from "./expense";

import { API } from "@/config/apis";
import { GET } from "@/utils/apiCalls";
import { dayjs } from "@/utils/common";

type Tab = "day" | "month" | "healer" | "expense";

type Row = {
  key: number | string;
  name?: string;
  sub?: string;
  count: number;
  fee: number;
  otherFee: number;
  total: number;
  expense: number;
  balance: number;
};

type Report = {
  group: Tab;
  year: number;
  month: number;
  status: string;
  rows: Row[];
  totals: Omit<Row, "key" | "name" | "sub">;
};

const TABS = [
  { key: "day", label: "Month by date" },
  { key: "month", label: "Year by month" },
  { key: "healer", label: "By healers" },
  { key: "expense", label: "Expenses" },
];

const STATUS_OPTIONS = [
  { label: "Attended", value: "attended" },
  { label: "All statuses", value: "all" },
  { label: "Upcoming", value: "upcoming" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Expired", value: "expired" },
];

const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
  label: dayjs(new Date(2000, i, 1)).format("MMMM"),
  value: i + 1,
}));

const money = (n: number) =>
  `₹${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(n || 0)}`;

// Zero in a row reads as "-" so busy periods stand out.
const moneyOrDash = (n: number) => (n ? money(n) : "-");

// Balance can be negative (expenses above income): show "-₹1,200", not "₹-1,200".
const signedMoney = (n: number) => (n < 0 ? `-${money(-n)}` : money(n));

export default function Reports() {
  const now = new Date();
  const thisYear = now.getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => thisYear - i);

  const [tab, setTab] = useState<Tab>("day");
  const [year, setYear] = useState(thisYear);
  // 0 = all months. The "Month by date" tab always needs a real month.
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [status, setStatus] = useState("attended");
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<Report | null>(null);
  const requestId = useRef(0);

  const effectiveMonth = tab === "day" ? month || now.getMonth() + 1 : month;

  useEffect(() => {
    if (tab === "expense") return; // the Expenses tab loads its own data
    load();
  }, [tab, year, effectiveMonth, status]);

  const load = async () => {
    const id = ++requestId.current;
    try {
      setLoading(true);
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
      const qp = new URLSearchParams({
        group: tab,
        year: String(year),
        status,
        tz,
      });
      if (tab !== "month") qp.set("month", String(effectiveMonth));
      const res: any = await GET(`${API.REPORTS}?${qp}`, null);
      if (id !== requestId.current) return; // a newer request superseded this
      if (res?.status) {
        setReport(res.data);
      } else {
        message.error(res?.message || "oops.something gone wrong.");
      }
    } catch (err) {
      if (id === requestId.current) message.error("oops.something gone wrong.");
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  };

  // Don't show another tab's rows under this tab's columns while loading.
  const rows = report?.group === tab ? report.rows : [];
  const totals = report?.group === tab ? report.totals : null;

  const sortable = tab === "healer";
  const numberColumn = (title: string, dataIndex: keyof Row, bold = false) => ({
    title,
    dataIndex,
    key: dataIndex,
    align: "right" as const,
    sorter: sortable
      ? (a: Row, b: Row) => Number(a[dataIndex]) - Number(b[dataIndex])
      : undefined,
    render: (n: number) => {
      const text = dataIndex === "count" ? (n ? n : "-") : moneyOrDash(n);
      return bold ? <span className="font-semibold">{text}</span> : text;
    },
  });

  const firstColumn =
    tab === "month"
      ? {
          title: "Month",
          dataIndex: "key",
          key: "key",
          render: (m: number) => (
            <span className="font-semibold">
              {dayjs(new Date(year, m - 1, 1)).format("MMMM")}
            </span>
          ),
        }
      : tab === "day"
        ? {
            title: "Date",
            dataIndex: "key",
            key: "key",
            render: (d: number) => (
              <span className="font-semibold">
                {dayjs(new Date(year, effectiveMonth - 1, d)).format(
                  "ddd, D MMM",
                )}
              </span>
            ),
          }
        : {
            title: "Healer",
            dataIndex: "name",
            key: "name",
            render: (_: any, row: Row) => (
              <div>
                <div
                  className={
                    row.key === "unassigned"
                      ? "text-gray-400 italic"
                      : "font-semibold"
                  }
                >
                  {row.name}
                </div>
                {row.sub ? (
                  <div className="text-[11px] text-gray-500">{row.sub}</div>
                ) : null}
              </div>
            ),
          };

  const columns = [
    firstColumn,
    numberColumn("Appointments", "count"),
    numberColumn("Fees", "fee"),
    numberColumn("Other fees", "otherFee"),
    numberColumn("Total", "total", true),
    {
      ...numberColumn("Expenses", "expense"),
      render: (n: number) =>
        n ? <span className="text-red-600">{money(n)}</span> : "-",
    },
    {
      ...numberColumn("Balance", "balance"),
      // A zero balance only reads as "-" when nothing happened at all.
      render: (n: number, row: Row) =>
        row.total || row.expense ? (
          <span
            className={`font-semibold ${
              n < 0 ? "text-red-600" : n > 0 ? "text-green-600" : "text-gray-500"
            }`}
          >
            {signedMoney(n)}
          </span>
        ) : (
          "-"
        ),
    },
  ];

  const statusLabel =
    STATUS_OPTIONS.find((o) => o.value === status)?.label.toLowerCase() || "";
  const monthName = MONTH_OPTIONS.find((m) => m.value === effectiveMonth)?.label;
  const baseCaption =
    tab === "month"
      ? `Monthly summary of ${statusLabel} appointments for ${year}`
      : tab === "day"
        ? `Daily summary of ${statusLabel} appointments for ${monthName} ${year}`
        : effectiveMonth
          ? `${statusLabel} appointments by healer for ${monthName} ${year}`
          : `${statusLabel} appointments by healer for ${year}`;
  // The status filter only applies to appointments, never to expenses.
  const caption =
    status === "all"
      ? baseCaption
      : `${baseCaption} · expenses are not filtered by status`;

  return (
    <div>
      <PageHeader
        title={"Reports"}
        icon={"MdOutlineAssessment"}
        showBack={true}
        showMenu={false}
        showMobileBack={false}
        showMobileMenu={true}
      >
        {tab !== "expense" ? (
          <Button onClick={() => load()} loading={loading} className="p-2!">
            <RiRefreshLine size={20} />
          </Button>
        ) : null}
      </PageHeader>
      <div className="h-[92vh] overflow-y-auto overflow-x-hidden pb-[7vh]">
        <div className="px-3">
          <Tabs
            size="small"
            activeKey={tab}
            onChange={(k) => setTab(k as Tab)}
            items={TABS}
          />
        </div>

        {tab === "expense" ? (
          <Expense />
        ) : (
          <>
        <div className="flex flex-wrap items-center gap-2 px-2 pb-2">
          <Select
            value={year}
            onChange={setYear}
            options={years.map((y) => ({ label: y, value: y }))}
            className="w-28!"
          />
          {tab !== "month" ? (
            <Select
              value={effectiveMonth}
              onChange={setMonth}
              options={
                tab === "healer"
                  ? [{ label: "All months", value: 0 }, ...MONTH_OPTIONS]
                  : MONTH_OPTIONS
              }
              className="w-36!"
            />
          ) : null}
          <Select
            value={status}
            onChange={setStatus}
            options={STATUS_OPTIONS}
            className="w-40!"
          />
          <div className="text-[12px] text-gray-500">{caption}</div>
        </div>

        <Table
          size="small"
          rowKey="key"
          dataSource={rows}
          columns={columns}
          pagination={false}
          loading={loading}
          locale={{ emptyText: <Empty /> }}
          scroll={{ x: "max-content" }}
          summary={() =>
            totals ? (
              <Table.Summary fixed>
                <Table.Summary.Row className="font-semibold bg-gray-50">
                  <Table.Summary.Cell index={0}>Total</Table.Summary.Cell>
                  <Table.Summary.Cell index={1} align="right">
                    {totals.count}
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={2} align="right">
                    {money(totals.fee)}
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={3} align="right">
                    {money(totals.otherFee)}
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={4} align="right">
                    {money(totals.total)}
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={5} align="right">
                    <span className="text-red-600">{money(totals.expense)}</span>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={6} align="right">
                    <span
                      className={
                        totals.balance < 0 ? "text-red-600" : "text-green-600"
                      }
                    >
                      {signedMoney(totals.balance)}
                    </span>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            ) : null
          }
        />
          </>
        )}
      </div>
    </div>
  );
}
