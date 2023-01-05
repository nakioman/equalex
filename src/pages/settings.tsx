import { Button, Card, Form, message, Select } from 'antd';
import { GetServerSidePropsContext, InferGetStaticPropsType } from 'next';
import { getToken } from 'next-auth/jwt';
import Link from 'next/link';
import { ReactElement, useState } from 'react';
import { SecurityChartTimeFrame } from '../interfaces/security';
import { AppSettingsModel } from '../interfaces/settings';
import DashboardLayout from '../layout/dashboard';
import { nameof } from '../lib/utils';
import { getSettings } from '../modules/settings/api/getSettings';

type SettingsPageProps = InferGetStaticPropsType<typeof getServerSideProps>;

export default function SettingsPage({ appSettings, userId }: SettingsPageProps) {
  const [settingsForms] = Form.useForm<AppSettingsModel>();
  const [saving, setSaving] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();

  const saveSettings = async (values: AppSettingsModel) => {
    setSaving(true);
    const res = await fetch(`/api/settings/${userId}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values)
    })

    if (res.ok) messageApi.success({ icon: true, content: 'Settings saved succesfully', duration: 5 });
    else messageApi.error({ icon: true, content: 'Error saving settings, please try again', duration: 5 })
    setSaving(false);
  };

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
          initialValues={appSettings}
        >
          <Form.Item
            name={nameof<AppSettingsModel>('defaultTimeframe')}
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

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const token = await getToken(ctx);
  const userId = token?.sub as string;
  const appSettings = token ? await getSettings(userId) : undefined;

  return {
    props: {
      userId,
      appSettings
    }
  }
}