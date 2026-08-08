"use client";

import { useState } from "react";
import { Card, Steps, Typography } from "antd";
import Step1 from "./step1";
import Step2 from "./step2";
import Step3 from "./step3";

const { Title, Paragraph } = Typography;

export default function GetStartedPage() {
  const [current, setCurrent] = useState(0);
  const [dbUri, setDbUri] = useState("");
  const [appName, setAppName] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-(--background)">
      <Card className="w-full max-w-2xl shadow-lg">
        <Title level={3} style={{ marginBottom: 4 }}>
          Get started
        </Title>
        <Paragraph type="secondary" style={{ marginBottom: 20 }}>
          Configure your app in 3 steps.
        </Paragraph>

        <Steps
          current={current}
          size="small"
          style={{ marginBottom: 24 }}
          items={[
            { title: "Environment" },
            { title: "Checks" },
            { title: "Settings" },
          ]}
        />

        {current === 0 && (
          <Step1
            onDone={(uri, name) => {
              setDbUri(uri);
              setAppName(name);
              setCurrent(1);
            }}
          />
        )}
        {current === 1 && (
          <Step2
            dbUri={dbUri}
            onBack={() => setCurrent(0)}
            onNext={() => setCurrent(2)}
          />
        )}
        {current === 2 && (
          <Step3 initialName={appName} onBack={() => setCurrent(1)} />
        )}
      </Card>
    </div>
  );
}
