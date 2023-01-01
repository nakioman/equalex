import { Button, Form, Input, message, Row, Select, Space } from 'antd';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { SecuritySectorType } from '../../../../interfaces/enums';
import { SecurityResponse } from '../../../../interfaces/security';
import { WatchlistRequest } from '../../../../interfaces/watchlist';

export type WatchlistAddFormProps = {
  security?: SecurityResponse;
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
        <Form.Item hidden name="type">
          <Input hidden />
        </Form.Item>
        <Row>
          <Space align="baseline">
            <Form.Item label="Ticker" name="ticker">
              <Input readOnly />
            </Form.Item>
            <Form.Item label="Name">
              <Input readOnly value={security?.name} style={{ width: 500 }} />
            </Form.Item>
          </Space>
        </Row>
        <Row>
          <Form.Item
            name="sector"
            label="Sector"
            rules={[{ required: true, message: 'You must choose the security sector' }]}
          >
            <Select style={{ width: 400 }}>
              <Select.Option value={SecuritySectorType.TECHNOLOGY}>Technology</Select.Option>
            </Select>
          </Form.Item>
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
