import { AssetType, Sector } from '@prisma/client';
import { Button, Card, Divider, Form, Input, message, Row, Select, Space } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactElement, useState } from "react";
import { SecurityResponse, SecurityType, WatchlistRequest } from '../../interfaces/security';
import DashboardLayout from "../../layout/dashboard";

type SearchTickerForm = {
  ticker: string,
  type: SecurityType
}

export default function SecurityAddPage() {
  const [tickerForm] = Form.useForm<SearchTickerForm>();
  const [watchlistForm] = Form.useForm<WatchlistRequest>();
  const [security, setSecurity] = useState<SecurityResponse | null>();
  const [searching, setSearching] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values: SearchTickerForm) => {
    setSearching(true);
    const res = await fetch(`/api/security/search?type=${values.type}&ticker=${values.ticker}`);
    if (res.ok) {
      const json = await res.json();
      setSecurity(json);
      watchlistForm.setFieldsValue(json)
    }
    else {
      messageApi.open({ type: 'info', content: 'Security not found', duration: 5 });
    }
    setSearching(false);
  };

  const resetForm = () => {
    watchlistForm.resetFields();
    setSecurity(null);
  }

  const saveSecurity = async (values: WatchlistRequest) => {
    setSaving(true);

    const res = await fetch('/api/watchlist', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(values),
    })
    if (res.ok) router.push('/security');
    else if (res.status == 409) {
      messageApi.open({ type: 'error', content: 'The same security already exists, cannot add it again', duration: 5 });
    } else {
      messageApi.open({ type: 'error', content: 'Error adding security, please try again', duration: 5 });
    }
    setSaving(false);
  }

  return (
    <>
      <Card title="Search security">
        {contextHolder}
        <Form name="ticker-add" layout='inline' form={tickerForm} onFinish={onFinish} initialValues={{ type: AssetType.EQUITY }} onValuesChange={resetForm}>
          <Form.Item label="Ticker" name="ticker" rules={[{ required: true, message: 'Please input a ticker to find' }]} >
            <Input autoFocus />
          </Form.Item>
          <Form.Item name="type" label="Type" rules={[{ required: true }]} >
            <Select>
              <Select.Option value={AssetType.BOND}>Bond</Select.Option>
              <Select.Option value={AssetType.EQUITY}>Equity</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="default" htmlType="submit" disabled={searching} loading={searching}>Search</Button>
          </Form.Item>
        </Form>
        {security &&
          <>
            <Divider type='horizontal' />
            <Form form={watchlistForm} labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} layout='vertical' onFinish={saveSecurity} >
              <Form.Item hidden name="type">
                <Input hidden />
              </Form.Item>
              <Row>
                <Space align='baseline'>
                  <Form.Item label="Ticker" name="ticker">
                    <Input readOnly />
                  </Form.Item>
                  <Form.Item label="Name">
                    <Input readOnly value={security?.name} style={{ width: 500 }} />
                  </Form.Item>
                </Space>
              </Row>
              <Row>
                <Form.Item name="sector" label="Sector" rules={[{ required: true, message: 'You must choose the security sector' }]} >
                  <Select style={{ width: 400 }}>
                    <Select.Option value={Sector.TECHNOLOGY}>Technology</Select.Option>
                  </Select>
                </Form.Item>
              </Row>
              <Row>
                <Space align='baseline'>
                  <Form.Item label="Last Price">
                    <Input readOnly value={security?.lastPrice} />
                  </Form.Item>
                  <Form.Item label="Δ %">
                    <Input readOnly value={security?.dailyChangePercentage ? (security?.dailyChangePercentage * 100).toPrecision(2) : ''} />
                  </Form.Item>
                </Space>
              </Row>
              <Row>
                <Button type="primary" disabled={saving} loading={saving} htmlType="submit" >Add Security</Button>
              </Row>
            </Form>
          </>
        }
      </Card>
    </>
  );
}

SecurityAddPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout breadcrumbParent="/security" breadcrumbTitle={<Link href="/security/add" className='ant-typograph' >Add</Link>}>{page}</DashboardLayout>;
};
