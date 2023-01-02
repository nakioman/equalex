import { SearchEngineType } from '@prisma/client';
import { Button, Form, Input, message, Select } from 'antd';
import { useState } from 'react';
import { SecuritySearchResponse } from '../../../interfaces/security';

export type SearchTickerForm = {
  ticker: string;
  searchEngine: SearchEngineType;
};

export type SearchFormProps = {
  onValuesChange?: () => void;
  onSecurityFound?: (security: SecuritySearchResponse) => void;
};

export default function SearchForm({ onValuesChange, onSecurityFound }: SearchFormProps) {
  const [tickerForm] = Form.useForm<SearchTickerForm>();
  const [searching, setSearching] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values: SearchTickerForm) => {
    setSearching(true);
    const res = await fetch(`/api/security/search?searchEngine=${values.searchEngine}&ticker=${values.ticker}`);
    if (res.ok) {
      const json = await res.json();
      if (onSecurityFound) {
        onSecurityFound(json);
      }
    } else {
      messageApi.open({ type: 'info', content: 'Security not found', duration: 5 });
    }
    setSearching(false);
  };

  return (
    <>
      {contextHolder}
      <Form
        name="ticker-add"
        layout="inline"
        form={tickerForm}
        onFinish={onFinish}
        initialValues={{ searchEngine: SearchEngineType.YAHOO_FINANCE }}
        onValuesChange={onValuesChange}
      >
        <Form.Item label="Ticker" name="ticker" rules={[{ required: true, message: 'Please input a ticker to find' }]}>
          <Input autoFocus />
        </Form.Item>
        <Form.Item name="searchEngine" label="Search Engine" rules={[{ required: true }]}>
          <Select>
            <Select.Option value={SearchEngineType.YAHOO_FINANCE}>Yahoo Finance</Select.Option>
            <Select.Option value={SearchEngineType.RAVA_BURSATIL}>Rava Bursatil</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="default" htmlType="submit" disabled={searching} loading={searching}>
            Search
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
