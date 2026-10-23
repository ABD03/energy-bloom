"use client";

import { useEffect, useRef, useState } from "react";
import {
  Button,
  DatePicker,
  Drawer,
  Form,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Select,
  Table,
} from "antd";
import { FaRegSave } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { IoTrashOutline } from "react-icons/io5";
import { MdOutlineEditNote } from "react-icons/md";
import { RiRefreshLine } from "react-icons/ri";

import Empty from "../_components/empty";
import DoctorPicker from "../doctors/_components/doctorPicker";

import { API } from "@/config/apis";
import { DELETE, GET, POST, PUT } from "@/utils/apiCalls";
import { dayjs } from "@/utils/common";

type ExpenseRow = {
  _id: string;
  date: string; // "YYYY-MM-DD"
  amount: number;
  note?: string;
  doctor?: { _id: string; name: string; doctorId?: string } | null;
};

type ExpenseData = {
  rows: ExpenseRow[];
  totals: { count: number; amount: number };
};

const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
  label: dayjs(new Date(2000, i, 1)).format("MMMM"),
  value: i + 1,
}));

const money = (n: number) =>
  `₹${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(n || 0)}`;

// ---------------------------------------------------------------------------
// Add / edit drawer. Mounted only while open so the form always starts fresh
// (a new expense gets today's date again).
// ---------------------------------------------------------------------------
function ExpenseDrawer({
  record,
  onCancel,
  onSaved,
}: {
  record: ExpenseRow | null;
  onCancel: () => void;
  onSaved: (date: string) => void;
}) {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  const submit = async (value: any) => {
    try {
      setSaving(true);
      const date = value.date.format("YYYY-MM-DD");
      const body = {
        _id: record?._id,
        date,
        amount: value.amount,
        doctor: value.doctor ?? null, // null clears the healer
        note: value.note || "",
      };
      const METHOD = record?._id ? PUT : POST;
      const res: any = await METHOD(API.EXPENSES, body);
      if (res?.status) {
        message.success(record?._id ? "Expense updated" : "Expense added");
        onSaved(date);
        onCancel();
      } else {
        message.error(res?.message || "oops.something gone wrong.");
      }
    } catch (err) {
      message.error("oops.something gone wrong.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Drawer
      title={`${record?._id ? "Edit" : "New"} expense`}
      open
      onClose={onCancel}
      placement="right"
      size="large"
      styles={{ body: { padding: 20 } }}
      footer={
        <div className="flex items-center justify-end gap-2 py-1">
          <Button size="large" onClick={onCancel} danger>
            Close
          </Button>
          <Button
            size="large"
            type="primary"
            loading={saving}
            onClick={() => form.submit()}
          >
            <FaRegSave /> Save
          </Button>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={submit}
        initialValues={{
          date: record?.date ? dayjs(record.date) : dayjs(),
          amount: record?.amount,
          doctor: record?.doctor?._id,
          note: record?.note,
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
          <Form.Item
            label="Date"
            name="date"
            rules={[{ required: true, message: "Required" }]}
          >
            <DatePicker
              className="w-full!"
              format="YYYY-MM-DD"
              allowClear={false}
            />
          </Form.Item>

          <Form.Item
            label="Amount"
            name="amount"
            rules={[
              { required: true, message: "Required" },
              { type: "number", min: 0.01, message: "Enter an amount above 0" },
            ]}
          >
            <InputNumber
              className="w-full!"
              prefix="₹"
              min={0}
              precision={2}
              placeholder="0.00"
            />
          </Form.Item>

          <Form.Item label="Healer" name="doctor" className="md:col-span-2">
            <DoctorPicker
              initial={record?.doctor}
              placeholder="Select healer (optional)"
            />
          </Form.Item>

          <Form.Item label="Note" name="note" className="md:col-span-2">
            <Input.TextArea
              rows={3}
              maxLength={500}
              showCount
              placeholder="What was this expense for?"
            />
          </Form.Item>
        </div>
      </Form>
    </Drawer>
  );
}

// ---------------------------------------------------------------------------
// The "Expenses" tab.
// ---------------------------------------------------------------------------
export default function Expense() {
  const now = new Date();
  const thisYear = now.getFullYear();

  const [year, setYear] = useState(thisYear);
  const [month, setMonth] = useState(now.getMonth() + 1); // 0 = all months
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ExpenseData | null>(null);
  // undefined = closed, null = adding a new one, a row = editing it
  const [drawer, setDrawer] = useState<ExpenseRow | null | undefined>(
    undefined,
  );
  const requestId = useRef(0);

  const yearOptions = Array.from(
    new Set([...Array.from({ length: 6 }, (_, i) => thisYear - i), year]),
  )
    .sort((a, b) => b - a)
    .map((y) => ({ label: y, value: y }));

  useEffect(() => {
    load();
  }, [year, month]);

  const load = async () => {
    const id = ++requestId.current;
    try {
      setLoading(true);
      const res: any = await GET(
        `${API.EXPENSES}?year=${year}&month=${month}`,
        null,
      );
      if (id !== requestId.current) return; // a newer request superseded this
      if (res?.status) {
        setData(res.data);
      } else {
        message.error(res?.message || "oops.something gone wrong.");
      }
    } catch (err) {
      if (id === requestId.current) message.error("oops.something gone wrong.");
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  };

  // After saving, make sure the saved expense is actually in view: jump to its
  // month if it falls outside the current filter, otherwise just refresh.
  const onSaved = (date: string) => {
    const d = dayjs(date);
    const nextYear = d.year();
    const nextMonth = month === 0 ? 0 : d.month() + 1;
    if (nextYear !== year || nextMonth !== month) {
      setYear(nextYear);
      setMonth(nextMonth);
    } else {
      load();
    }
  };

  const remove = async (row: ExpenseRow) => {
    try {
      const res: any = await DELETE(`${API.EXPENSES}?id=${row._id}`);
      if (res?.status) {
        message.success("Expense deleted");
        load();
      } else {
        message.error(res?.message || "oops.something gone wrong.");
      }
    } catch (err) {
      message.error("oops.something gone wrong.");
    }
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: 150,
      render: (d: string) => (
        <span className="font-semibold">{dayjs(d).format("ddd, D MMM YYYY")}</span>
      ),
    },
    {
      title: "Healer",
      dataIndex: "doctor",
      key: "doctor",
      render: (d: ExpenseRow["doctor"]) =>
        d?.name ? (
          <div>
            <div className="font-semibold text-[13px]">{d.name}</div>
            {d.doctorId ? (
              <div className="text-[11px] text-gray-500">{d.doctorId}</div>
            ) : null}
          </div>
        ) : (
          <span className="text-gray-400">-</span>
        ),
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
      render: (n: string) =>
        n ? (
          <span className="whitespace-pre-wrap">{n}</span>
        ) : (
          <span className="text-gray-400">-</span>
        ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      align: "right" as const,
      width: 130,
      render: (n: number) => <span className="font-semibold">{money(n)}</span>,
    },
    {
      title: "Action",
      key: "action",
      width: 100,
      render: (_: any, row: ExpenseRow) => (
        <div className="flex items-center justify-end gap-2">
          <Button size="small" onClick={() => setDrawer(row)} className="p-1!">
            <MdOutlineEditNote size={20} />
          </Button>
          <Popconfirm
            title="Delete the expense"
            description="Are you sure to delete this expense?"
            onConfirm={() => remove(row)}
            okText="Yes"
            cancelText="No"
            placement="left"
          >
            <Button size="small" danger className="p-1!">
              <IoTrashOutline size={15} color="red" />
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const monthName = MONTH_OPTIONS.find((m) => m.value === month)?.label;
  const totals = data?.totals;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 px-2 pb-2">
        <Select
          value={year}
          onChange={setYear}
          options={yearOptions}
          className="w-28!"
        />
        <Select
          value={month}
          onChange={setMonth}
          options={[{ label: "All months", value: 0 }, ...MONTH_OPTIONS]}
          className="w-36!"
        />
        <div className="text-[12px] text-gray-500">
          Expenses for {month ? `${monthName} ${year}` : year}
        </div>
        <div className="flex-1" />
        <Button onClick={() => load()} loading={loading} className="p-2!">
          <RiRefreshLine size={20} />
        </Button>
        <Button type="primary" onClick={() => setDrawer(null)}>
          <span className="text-[12px] hidden md:inline">New expense</span>
          <IoMdAdd size={20} />
        </Button>
      </div>

      <Table
        size="small"
        rowKey="_id"
        dataSource={data?.rows || []}
        columns={columns}
        pagination={false}
        loading={loading}
        locale={{ emptyText: <Empty /> }}
        scroll={{ x: "max-content" }}
        summary={() =>
          totals ? (
            <Table.Summary fixed>
              <Table.Summary.Row className="font-semibold bg-gray-50">
                <Table.Summary.Cell index={0} colSpan={3}>
                  Total · {totals.count} {totals.count === 1 ? "expense" : "expenses"}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3} align="right">
                  {money(totals.amount)}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={4} />
              </Table.Summary.Row>
            </Table.Summary>
          ) : null
        }
      />

      {drawer !== undefined ? (
        <ExpenseDrawer
          record={drawer}
          onCancel={() => setDrawer(undefined)}
          onSaved={onSaved}
        />
      ) : null}
    </div>
  );
}
