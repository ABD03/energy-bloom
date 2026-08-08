"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Card, Form, message, Tabs } from "antd";
import {
  RiRefreshLine,
  RiSeoLine,
  RiSave2Line,
  RiCodeSSlashLine,
} from "react-icons/ri";
import { TbSettings } from "react-icons/tb";
import { HiOutlinePhone } from "react-icons/hi";
import { FiGlobe } from "react-icons/fi";

import Loading from "../_components/loading";
import PageHeader from "../_components/pageHeader";
import OverviewSection from "./_components/overviewSection";
import SettingsSection from "./_components/settingsSection";
import ScriptsSection from "./_components/scriptsSection";
import { settingsSections } from "./_components/settingsConfig";

import { useAppDispatch } from "@/redux/util/hooks";
import { updateSettings } from "@/redux/slice/dataSlice";
import { API } from "@/config/apis";
import { GET, POST } from "@/utils/apiCalls";

const tabMeta = [
  { key: "overview", label: "Overview", Icon: FiGlobe },
  { key: "website", label: "Settings", Icon: TbSettings },
  { key: "contact", label: "Contact & Social", Icon: HiOutlinePhone },
  { key: "metadata", label: "Metadata", Icon: RiSeoLine },
  { key: "scripts", label: "Custom Scripts", Icon: RiCodeSSlashLine },
];

export default function Settings() {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<any>({});
  const activeTab = searchParams.get("tab") || "overview";
  const [tabPosition, setTabPosition] = useState<any>("left");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => setTabPosition(mq.matches ? "left" : "top");
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") getData();
  }, []);

  const reloadData = () => {
    setLoading(true);
    getData();
  };

  const getData = async () => {
    try {
      const response: any = await GET(API.SETTINGS, null);
      if (response?.status) {
        const d = response?.data || {};
        if (d.app?.language?.code) d.app.language = d.app.language.code;
        if (Array.isArray(d.app?.meta_alt_language)) {
          d.app.meta_alt_language = d.app.meta_alt_language.map((l: any) =>
            typeof l === "object" ? l.code : l,
          );
        }
        setData(d);
      } else {
        message.error("oops.something gone wrong.");
      }
    } catch (err) {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  const updateData = async (values: any) => {
    try {
      setSaving(true);
      const obj = { _id: data?._id, ...values };
      const response: any = await POST(API.SETTINGS, obj);
      if (response?.status) {
        message.success("Updated successfully");
        if (response?.data?._id) {
          setData(response.data);
          dispatch(updateSettings(response.data));
        }
      } else {
        message.error(response?.message || "oops.something gone wrong.");
      }
    } catch (err) {
      message.error("oops.something gone wrong.");
    } finally {
      setSaving(false);
    }
  };

  const tabItems = tabMeta.map(({ key, label, Icon }) => ({
    key,
    label: (
      <span className="inline-flex items-center gap-2 mr-4 sm:mr-0">
        <Icon size={16} />
        <span className="text-[13px]">{label}</span>
      </span>
    ),
    children: (
      <div className="h-[91vh] sm:pt-4 pb-[8vh] overflow-y-scroll scrollbar-hide">
        <Card title={label} styles={{ header: { paddingRight: 10 } }}>
          {key === "overview" ? (
            <OverviewSection data={data} />
          ) : key === "scripts" ? (
            <ScriptsSection />
          ) : (
            <SettingsSection sections={settingsSections[key]} form={form} />
          )}
        </Card>
      </div>
    ),
  }));

  return (
    <div>
      <PageHeader
        title="Settings"
        icon="IoSettingsOutline"
        subtitle="Manage contact info, social links, content defaults, and site keys"
        showBack={true}
        showMenu={false}
        showMobileBack={false}
        showMobileMenu={true}
      >
        <Button onClick={() => reloadData()} loading={loading} className="p-2!">
          <RiRefreshLine size={18} />
        </Button>
      </PageHeader>

      <div className="h-[92vh] overflow-y-auto overflow-x-hidden">
        {loading ? (
          <Loading />
        ) : (
          <Form
            layout="vertical"
            form={form}
            onFinish={updateData}
            initialValues={data || {}}
          >
            <div className="p-4 sm:pl-4 py-0 border-t border-primary/10 pt-1 sm:pt-0">
              <Tabs
                size="small"
                activeKey={activeTab}
                onChange={(key) => router.replace(`?tab=${key}`)}
                items={tabItems}
                tabPlacement={tabPosition}
                className="settings-tabs"
                tabBarGutter={6}
              />
            </div>

            <div className="absolute bottom-0 left-0 sm:left-60 w-full sm:w-[calc(100%-15rem)] z-1000 p-2 h-[7vh] bg-white flex flex-row items-center gap-2.5 shadow-[0_-2px_3px_rgba(180,180,180,0.1)]">
              <div style={{ flex: 1 }} />
              <Form.Item noStyle>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={saving}
                  icon={<RiSave2Line size={16} />}
                >
                  Save Settings
                </Button>
              </Form.Item>
            </div>
          </Form>
        )}
      </div>
    </div>
  );
}
