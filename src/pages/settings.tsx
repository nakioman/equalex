import { Button, Card, Form, message, Select } from 'antd';
import Link from 'next/link';
import { ReactElement, useState } from 'react';
import { SecurityChartTimeFrame } from '../interfaces/security';
import { AppSettings } from '../interfaces/settings';
import DashboardLayout from '../layout/dashboard';
import { nameof } from '../lib/utils';

export default function SettingsPage() {
  const [settingsForms] = Form.useForm<AppSettings>();
  const [saving, setSaving] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();

  const saveSettings = (values: AppSettings) => {};

  return (
    <>
      {contextHolder}
      <Card>
        <Form
          form={settingsForms}
          labelCol={{ span: 10 }}
          wrapperCol={{ span: 14 }}
          layout="vertical"
          onFinish={saveSettings}
        >
          <Form.Item
            name={nameof<AppSettings>('defaultTimeframe')}
            label="Default chart Time frame"
            rules={[{ required: true, message: 'You must choose a default time frame' }]}
          >
            <Select>
              <Select.Option value={SecurityChartTimeFrame.Month}>1 Month</Select.Option>
              <Select.Option value={SecurityChartTimeFrame.SixMonth}>6 Months</Select.Option>
              <Select.Option value={SecurityChartTimeFrame.YearToDate}>Year to date</Select.Option>
              <Select.Option value={SecurityChartTimeFrame.Year}>1 Year</Select.Option>
              <Select.Option value={SecurityChartTimeFrame.FiveYear}>5 Years</Select.Option>
              <Select.Option value={SecurityChartTimeFrame.Max}>Max</Select.Option>
            </Select>
          </Form.Item>
          <Button type="primary" disabled={saving} loading={saving} htmlType="submit">
            Save Settings
          </Button>
        </Form>
      </Card>
    </>
  );
}

SettingsPage.getLayout = function getLayout(page: ReactElement) {
  const breadcrumbTitle = (
    <Link href="/settings" className="ant-typograph">
      Settings
    </Link>
  );
  return (
    <DashboardLayout title="Settings" breadcrumbParent="/" breadcrumbTitle={breadcrumbTitle}>
      {page}
    </DashboardLayout>
  );
};
