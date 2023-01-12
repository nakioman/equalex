import { SecuritySectorType, SecurityType } from '@prisma/client';
import { Button, Form, Input, message, Row, Select, Space } from 'antd';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { SecuritySearchResponse } from '../../../interfaces/security';
import { WatchlistRequest } from '../../../interfaces/watchlist';

export type WatchlistAddFormProps = {
  security?: SecuritySearchResponse;
};

export default function WatchlistAddForm({ security }: WatchlistAddFormProps) {
  const [watchlistForm] = Form.useForm<WatchlistRequest>();
  const [saving, setSaving] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();

  const saveSecurity = async (values: WatchlistRequest) => {
    setSaving(true);

    const res = await fetch('/api/watchlist', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });
    if (res.ok) router.push('/watchlist');
    else if (res.status == 409) {
      messageApi.open({ type: 'error', content: 'The same security already exists, cannot add it again', duration: 5 });
    } else {
      messageApi.open({ type: 'error', content: 'Error adding security, please try again', duration: 5 });
    }
    setSaving(false);
  };

  useEffect(() => {
    if (!security) watchlistForm.resetFields();
    if (security) watchlistForm.setFieldsValue(security);
  }, [security, watchlistForm]);

  return security ? (
    <>
      {contextHolder}
      <Form
        form={watchlistForm}
        labelCol={{ span: 10 }}
        wrapperCol={{ span: 14 }}
        layout="vertical"
        onFinish={saveSecurity}
      >
        <Form.Item hidden name="searchEngine">
          <Input hidden />
        </Form.Item>
        <Row>
          <Space align="baseline">
            <Form.Item label="Ticker" name="ticker">
              <Input readOnly />
            </Form.Item>
            <Form.Item label="Name" name="name">
              <Input style={{ width: 500 }} />
            </Form.Item>
          </Space>
        </Row>
        <Row>
          <Space align="baseline">
            <Form.Item name="type" label="Type" rules={[{ required: true, message: 'You must choose a type' }]}>
              <Select style={{ width: 100 }}>
                <Select.Option value={SecurityType.BOND}>Bond</Select.Option>
                <Select.Option value={SecurityType.EQUITY}>Equity</Select.Option>
                <Select.Option value={SecurityType.ETF}>ETF</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="sector"
              label="Sector"
              rules={[{ required: true, message: 'You must choose the security sector' }]}
            >
              <Select style={{ width: 400 }}>
                <Select.Option value={SecuritySectorType.TECHNOLOGY}>Technology</Select.Option>
                <Select.Option value={SecuritySectorType.ARGENTINA_BOND}>Argentina Treasure</Select.Option>
                <Select.Option value={SecuritySectorType.AEROSPACE}>Aerospace</Select.Option>
                <Select.Option value={SecuritySectorType.BASIC_MATERIALS}>Basic materials</Select.Option>
                <Select.Option value={SecuritySectorType.COMMUNICATION_SERVICES}>Communication services</Select.Option>
                <Select.Option value={SecuritySectorType.CONSUMER_DEFENSIVE}>Consumer defensive</Select.Option>
                <Select.Option value={SecuritySectorType.ELECTRONIC_ENTERTAINMENT}>
                  Electronic entertainment
                </Select.Option>
                <Select.Option value={SecuritySectorType.ENERGY}>Energy</Select.Option>
                <Select.Option value={SecuritySectorType.FINANCIAL}>Financial</Select.Option>
                <Select.Option value={SecuritySectorType.HEALTHCARE}>Healthcare</Select.Option>
                <Select.Option value={SecuritySectorType.REAL_STATE}>Real state</Select.Option>
                <Select.Option value={SecuritySectorType.UTILITIES}>Utilities</Select.Option>
              </Select>
            </Form.Item>
          </Space>
        </Row>
        <Row>
          <Space align="baseline">
            <Form.Item label="Last Price">
              <Input readOnly value={security?.lastPrice} />
            </Form.Item>
            <Form.Item label="Δ %">
              <Input
                readOnly
                value={security?.dailyChangePercentage ? (security?.dailyChangePercentage * 100).toPrecision(2) : ''}
              />
            </Form.Item>
          </Space>
        </Row>
        <Row>
          <Button type="primary" disabled={saving} loading={saving} htmlType="submit">
            Add Security
          </Button>
        </Row>
      </Form>
    </>
  ) : null;
}
