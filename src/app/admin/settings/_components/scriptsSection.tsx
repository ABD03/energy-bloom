"use client";
import { Button, Card, Form, Input, Select, Tag } from "antd";
import { IoMdAdd } from "react-icons/io";
import { MdDelete } from "react-icons/md";

export default function ScriptsSection() {
  return (
    <div>
      <div className="text-sm text-gray-500 mb-4">
        Add custom scripts like Google Analytics, Facebook Pixel, chat widgets,
        or any third-party JavaScript. Choose where each script loads —{" "}
        <Tag color="blue">Head</Tag> for tracking/analytics that need to load
        first, <Tag color="green">Body</Tag> for widgets that load after page
        content, <Tag color="orange">Footer</Tag> for scripts that load last.
      </div>

      <Form.List name="scripts">
        {(fields, { add, remove }) => (
          <div className="flex flex-col gap-4">
            {fields.map((field, idx) => (
              <Card
                key={field.key}
                size="small"
                title={
                  <span className="text-[13px] font-semibold">
                    Script {idx + 1}
                  </span>
                }
                extra={
                  <Button
                    size="small"
                    danger
                    icon={<MdDelete />}
                    onClick={() => remove(field.name)}
                  />
                }
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Form.Item
                    name={[field.name, "name"]}
                    label="Script name"
                    rules={[{ required: true, message: "Required" }]}
                    className="mb-0!"
                  >
                    <Input placeholder="e.g. Google Analytics" />
                  </Form.Item>
                  <Form.Item
                    name={[field.name, "position"]}
                    label="Load position"
                    rules={[{ required: true, message: "Required" }]}
                    className="mb-0!"
                  >
                    <Select placeholder="Select position">
                      <Select.Option value="head">Head</Select.Option>
                      <Select.Option value="body">Body</Select.Option>
                      <Select.Option value="footer">Footer</Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name={[field.name, "strategy"]}
                    label="Loading strategy"
                    rules={[{ required: true, message: "Required" }]}
                    className="mb-0!"
                  >
                    <Select placeholder="Select strategy">
                      <Select.Option value="beforeInteractive">
                        Before Interactive — highest priority
                      </Select.Option>
                      <Select.Option value="afterInteractive">
                        After Interactive — after hydration
                      </Select.Option>
                      <Select.Option value="lazyOnload">
                        Lazy Onload — during idle time
                      </Select.Option>
                    </Select>
                  </Form.Item>
                </div>
                <Form.Item
                  name={[field.name, "content"]}
                  label="Script code"
                  rules={[{ required: true, message: "Required" }]}
                  className="mt-4! mb-0!"
                >
                  <Input.TextArea
                    rows={10}
                    placeholder={'<script async src="https://..."></script>'}
                    style={{ fontFamily: "monospace", fontSize: 12, }}
                     className=" text-blue-700!"
                  />
                </Form.Item>
              </Card>
            ))}
            <Button
              type="dashed"
              icon={<IoMdAdd />}
              onClick={() =>
                add({
                  name: "",
                  position: "head",
                  strategy: "afterInteractive",
                  content: "",
                })
              }
              size="large"
              block
            >
              Add Script
            </Button>
          </div>
        )}
      </Form.List>
    </div>
  );
}
