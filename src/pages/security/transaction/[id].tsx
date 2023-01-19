import { MoneyAccountType, TransactionType } from '@prisma/client';
import { Button, Card, DatePicker, Form, Input, InputNumber, message, Select } from 'antd';
import dayjs from 'dayjs';
import { GetServerSidePropsContext, InferGetStaticPropsType } from 'next';
import { getToken } from 'next-auth/jwt';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { ReactElement, useEffect, useState } from 'react';
import { SecurityTransactionRequest } from '../../../interfaces/security';
import DashboardLayout from '../../../layout/dashboard';
import { getAccounts } from '../../../modules/account/api/getAccounts';
import { getSecurityTransaction } from '../../../modules/security/api/getSecurityTransactions';
import getWatchlist from '../../../modules/watchlist/api/getWatchlist';

type AddSecurityTransactionPageProps = InferGetStaticPropsType<typeof getServerSideProps>;

export default function AddSecurityTransactionPage({
  accounts,
  securities,
  initialValues,
}: AddSecurityTransactionPageProps) {
  const [transactionForm] = Form.useForm<SecurityTransactionRequest>();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();

  useEffect(() => {
    const { openAt, closeAt, ...otherValues } = initialValues;
    transactionForm.setFieldsValue({
      openAt: dayjs(openAt),
      closeAt: closeAt ? dayjs(closeAt) : undefined,
      ...otherValues,
    });
  }, [initialValues, transactionForm]);

  const onFinish = async (values: SecurityTransactionRequest) => {
    setIsSaving(true);

    const res = await fetch('/api/security/transaction', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });

    if (res.ok) router.push('/security/transaction');
    else messageApi.error({ type: 'error', content: 'Error adding transaction, please try again', duration: 5 });

    setIsSaving(false);
  };

  return (
    <>
      {contextHolder}
      <Card title="New transaction">
        <Form
          name="transaction-add"
          layout="horizontal"
          form={transactionForm}
          onFinish={onFinish}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
        >
          <Form.Item hidden name="id">
            <Input hidden />
          </Form.Item>
          <Form.Item name="accountId" label="Account" rules={[{ required: true, message: 'Please choose an account' }]}>
            <Select autoFocus>
              {accounts.map((account) => (
                <Select.Option key={account.id} value={account.id}>
                  {account.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="securityId"
            label="Security"
            rules={[{ required: true, message: 'Please choose a security' }]}
          >
            <Select showSearch optionFilterProp="label" options={securities} />
          </Form.Item>
          <Form.Item name="type" label="Type" rules={[{ required: true, message: 'Please choose a type' }]}>
            <Select>
              <Select.Option value={TransactionType.LONG}>Long</Select.Option>
              <Select.Option value={TransactionType.SHORT}>Short</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Open date (YYYY-MM-DD)"
            name="openAt"
            rules={[{ required: true, message: 'Please input an open date for the transaction' }]}
          >
            <DatePicker format={['MMM D, YYYY', 'YYYY-MM-DD']} style={{ width: 150 }} />
          </Form.Item>
          <Form.Item
            label="Buy price"
            name="buyPrice"
            rules={[{ required: true, message: 'Please input a buy price for the transaction' }]}
          >
            <InputNumber style={{ width: 150 }} />
          </Form.Item>
          <Form.Item
            label="Quantity"
            name="quantity"
            rules={[{ required: true, message: 'Please input amount of securities bought' }]}
          >
            <InputNumber style={{ width: 150 }} />
          </Form.Item>
          <Form.Item label="Close date (YYYY-MM-DD)" name="closeAt">
            <DatePicker format={['MMM D, YYYY', 'YYYY-MM-DD']} style={{ width: 150 }} />
          </Form.Item>
          <Form.Item label="Sell price" name="closePrice">
            <InputNumber style={{ width: 150 }} />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="default" htmlType="submit" disabled={isSaving} loading={isSaving}>
              {initialValues?.id ? 'Update' : 'Add'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
}

AddSecurityTransactionPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout title="Add security transaction">{page}</DashboardLayout>;
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { id } = ctx.params as ParsedUrlQuery;
  const { accountId, securityId } = ctx.query;
  const token = await getToken(ctx);
  const userId = token?.sub as string;
  const accounts = token ? await (await getAccounts(userId)).filter((a) => a.type === MoneyAccountType.INVESTMENT) : [];
  const watchlist = token ? await getWatchlist(userId) : [];
  const securities = watchlist.map((a) => ({ value: a.securityId, label: a.name }));
  const transaction = token ? await getSecurityTransaction(id as string) : undefined;

  const initialValues = transaction
    ? {
        id: transaction.id,
        accountId: transaction.moneyAccountId,
        buyPrice: transaction.buyPrice,
        openAt: transaction.openAt,
        quantity: transaction.quantity,
        securityId: transaction.securityId,
        type: transaction.type,
        closeAt: transaction.closeAt,
        closePrice: transaction.closePrice,
        description: transaction.description,
      }
    : {
        id: undefined,
        buyPrice: undefined,
        quantity: undefined,
        closeAt: undefined,
        closePrice: undefined,
        description: undefined,
        openAt: Date.now(),
        accountId: accountId as string,
        type: TransactionType.LONG,
        securityId: securityId as string,
      };

  return {
    props: {
      accounts,
      securities,
      initialValues,
    },
  };
};
