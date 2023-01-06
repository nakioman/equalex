import { MoneyAccountType } from '@prisma/client';
import { Button, Card, Form, Input, message, Select } from 'antd';
import { useRouter } from 'next/dist/client/router';
import Link from 'next/link';
import { ReactElement, useState } from 'react';
import { AccountRequest } from '../../interfaces/account';
import DashboardLayout from '../../layout/dashboard';

export default function AddAcountPage() {
  const [accountForm] = Form.useForm<AccountRequest>();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();

  const onFinish = async (values: AccountRequest) => {
    setIsSaving(true);

    const res = await fetch('/api/account', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });

    if (res.ok) router.push('/account');
    else messageApi.error({ type: 'error', content: 'Error adding account, please try again', duration: 5 });

    setIsSaving(false);
  };

  return (
    <>
      {contextHolder}
      <Card title="New account">
        <Form
          name="account-add"
          layout="vertical"
          form={accountForm}
          onFinish={onFinish}
          initialValues={{ type: MoneyAccountType.INVESTMENT }}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input a name for the acocunt' }]}
          >
            <Input autoFocus />
          </Form.Item>
          <Form.Item name="type" label="Acocunt type" rules={[{ required: true }]}>
            <Select>
              <Select.Option value={MoneyAccountType.INVESTMENT}>Investments</Select.Option>
              <Select.Option value={MoneyAccountType.SAVINGS}>Savings</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="default" htmlType="submit" disabled={isSaving} loading={isSaving}>
              Add
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
}

AddAcountPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <DashboardLayout
      breadcrumbParent="/account"
      title="Add an account"
      breadcrumbTitle={
        <Link href="/account/add" className="ant-typograph">
          Add
        </Link>
      }
    >
      {page}
    </DashboardLayout>
  );
};
