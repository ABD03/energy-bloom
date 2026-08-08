"use client";

import { useState } from "react";
import { Alert, Button, Card, Space, Typography } from "antd";
import { testDatabase, testUpload } from "./actions";

const { Text } = Typography;

type Check = { ok: boolean; message: string } | null;

type Props = {
  dbUri: string;
  onBack: () => void;
  onNext: () => void;
};

export default function Step2({ dbUri, onBack, onNext }: Props) {
  const [testingDb, setTestingDb] = useState(false);
  const [testingUpload, setTestingUpload] = useState(false);
  const [dbCheck, setDbCheck] = useState<Check>(null);
  const [uploadCheck, setUploadCheck] = useState<Check>(null);

  const runDbTest = async () => {
    setTestingDb(true);
    setDbCheck(null);
    const res = await testDatabase(dbUri);
    setDbCheck(res);
    setTestingDb(false);
  };

  const runUploadTest = async () => {
    setTestingUpload(true);
    setUploadCheck(null);
    const res = await testUpload();
    setUploadCheck(res);
    setTestingUpload(false);
  };

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <Alert
        type="info"
        showIcon
        message="If checks fail after saving step 1, restart the dev server so new env vars load."
      />

      <Card size="small" title="Database connection">
        <Space direction="vertical" style={{ width: "100%" }}>
          <Text type="secondary">
            Attempts a connection to the DATABASE_URI you provided.
          </Text>
          <Button
            onClick={runDbTest}
            loading={testingDb}
            type={dbCheck?.ok ? "default" : "primary"}
          >
            {dbCheck?.ok ? "Re-run check" : "Test connection"}
          </Button>
          {dbCheck && (
            <Alert
              type={dbCheck.ok ? "success" : "error"}
              showIcon
              message={dbCheck.message}
            />
          )}
        </Space>
      </Card>

      <Card size="small" title="File upload (S3)">
        <Space direction="vertical" style={{ width: "100%" }}>
          <Text type="secondary">
            Puts and deletes a tiny test object in your bucket.
          </Text>
          <Button
            onClick={runUploadTest}
            loading={testingUpload}
            type={uploadCheck?.ok ? "default" : "primary"}
          >
            {uploadCheck?.ok ? "Re-run check" : "Test upload"}
          </Button>
          {uploadCheck && (
            <Alert
              type={uploadCheck.ok ? "success" : "error"}
              showIcon
              message={uploadCheck.message}
            />
          )}
        </Space>
      </Card>

      <Space>
        <Button onClick={onBack}>Back</Button>
        <Button
          type="primary"
          disabled={!dbCheck?.ok}
          onClick={onNext}
        >
          Continue
        </Button>
      </Space>
    </Space>
  );
}
