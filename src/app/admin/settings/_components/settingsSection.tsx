"use client";
import { Form, Input, Select } from "antd";
import FilePicker from "../../_components/filePicker";
import type { SectionConfig, FieldConfig } from "./settingsConfig";

function FilePickerField({
  form,
  name,
  label,
}: {
  form: any;
  name: string[];
  label: string;
}) {
  const value = Form.useWatch(name, form);
  return (
    <Form.Item label={label} name={name}>
      <FilePicker
        url={value}
        onchange={(v: any) => form?.setFieldValue(name, v?.name)}
      />
    </Form.Item>
  );
}

function FieldRenderer({
  field,
  form,
  group,
}: {
  field: FieldConfig;
  form: any;
  group: string;
}) {
  const name = [group, field.name];

  if (field.type === "file") {
    return <FilePickerField form={form} name={name} label={field.label} />;
  }

  const input = () => {
    switch (field.type) {
      case "code":
        return (
          <Input.TextArea
            rows={field.rows || 10}
            placeholder={field.placeholder}
            className=" text-blue-700! rounded-lg!"
          />
        );
      case "textarea":
        return (
          <Input.TextArea
            rows={field.rows || 3}
            maxLength={field.maxLength}
            showCount={field.showCount}
            placeholder={field.placeholder}
          />
        );
      case "select":
        return (
          <Select placeholder={field.placeholder}>
            {field.options?.map((opt) => (
              <Select.Option key={opt.value} value={opt.value}>
                {opt.label}
              </Select.Option>
            ))}
          </Select>
        );
      case "multiselect":
        return (
          <Select
            mode={field.options?.length ? "multiple" : "tags"}
            placeholder={field.placeholder}
          >
            {field.options?.map((opt) => (
              <Select.Option key={opt.value} value={opt.value}>
                {opt.label}
              </Select.Option>
            ))}
          </Select>
        );
      default:
        return <Input prefix={field.prefix} placeholder={field.placeholder} />;
    }
  };

  return (
    <Form.Item label={field.label} name={name}>
      {input()}
    </Form.Item>
  );
}

export default function SettingsSection({
  sections,
  form,
}: {
  sections: SectionConfig[];
  form: any;
}) {
  return (
    <div>
      {sections.map((section, idx) => (
        <div key={section.title}>
          <div>
            <div
              className={`text-base font-semibold mb-2 ${idx > 0 ? "border-t border-gray-200 pt-6 mt-6" : ""}`}
            >
              {section.title}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-gray-500">{section.description}</div>
            </div>
            <div>
              {section.fields.map((field) => (
                <FieldRenderer
                  key={field.name}
                  field={field}
                  form={form}
                  group={section.group}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
