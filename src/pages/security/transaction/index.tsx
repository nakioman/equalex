import { MoneyAccountType } from '@prisma/client';
import { Col, Radio, Row, Select, Table, Typography } from 'antd';
import { GetServerSidePropsContext, InferGetStaticPropsType } from 'next';
import { getToken } from 'next-auth/jwt';
import { useRouter } from 'next/router';
import { ReactElement, ReactNode, useEffect, useState } from 'react';
import EqualexTable from '../../../common/components/EqualexTable';
import { SecurityTransactionResponse } from '../../../interfaces/security';
import DashboardLayout from '../../../layout/dashboard';
import { moneyFormatter, nameof } from '../../../lib/utils';
import { getAccounts } from '../../../modules/account/api/getAccounts';
import { getSecurityTransactions } from '../../../modules/security/api/getSecurityTransactions';
import SecurityTransactionColumns from '../../../modules/security/components/SecurityTransactionColumns';

type SecurityTransactionPageProps = InferGetStaticPropsType<typeof getServerSideProps>;

export default function SecurityTransactionPage({ transactions, accounts }: SecurityTransactionPageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const { status, accountId } = router.query;
  const columns = SecurityTransactionColumns(transactions, () => {
    setLoading(true);
    router.replace('/security/transaction');
    if (router.isReady) setLoading(false);
  });

  useEffect(() => {
    router.isReady && setLoading(false);
  }, [router]);

  const updateTimeFrame = (value: boolean) => {
    setLoading(true);
    const accounts =
      typeof accountId === 'string'
        ? `&accountId=${accountId}`
        : accountId?.map((v: string) => `&accountId=${v}`).join('');
    router.push(`/security/transaction?status=${value}${accounts}`);
  };

  const handleAccountChange = (values: string[]) => {
    setLoading(true);
    router.push(`/security/transaction?status=${status}${values.map((v) => `&accountId=${v}`).join('')}`);
  };

  return (
    <EqualexTable
      addLink="/security/transaction/add"
      title="Securities transactions"
      size="small"
      columns={columns}
      dataSource={transactions}
      rowKey={nameof<SecurityTransactionResponse>('id')}
      loading={loading}
      expandable={{
        expandedRowRender: (record) => (
          <>
            <p style={{ margin: 0 }}>Name: {record.securityName}</p>
            <p style={{ margin: 0 }}>Account: {record.moneyAccountName}</p>
            {record.description && <p style={{ margin: 0 }}>Description: {record.description}</p>}
          </>
        ),
      }}
      summary={transactionsSummary}
    >
      <Row justify="start" style={{ paddingBottom: 20 }} align="middle">
        <Col span={2}>
          <Radio.Group size="small" value={status ?? ''} onChange={(e) => updateTimeFrame(e.target.value)}>
            <Radio.Button value="open">Open</Radio.Button>
            <Radio.Button value="close">Close</Radio.Button>
            <Radio.Button value="">All</Radio.Button>
          </Radio.Group>
        </Col>
        <Col span={12}>
          <Select
            mode="multiple"
            allowClear
            style={{ width: '100%' }}
            placeholder="Filter by account"
            options={accounts.map((a) => ({
              label: a.name,
              value: a.id,
            }))}
            onChange={handleAccountChange}
            defaultValue={(accountId as string[] | undefined) ?? []}
          />
        </Col>
      </Row>
    </EqualexTable>
  );
}

SecurityTransactionPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout title="Transactions">{page}</DashboardLayout>;
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const token = await getToken(ctx);
  const { status, accountId } = ctx.query;
  const userId = token?.sub as string;
  const transactions = token ? await getSecurityTransactions(userId) : [];
  const filteredTransaction = transactionByAccounId(transactionsByStatus(transactions, status), accountId);
  const accounts = token ? await (await getAccounts(userId)).filter((a) => a.type == MoneyAccountType.INVESTMENT) : [];
  return {
    props: {
      transactions: filteredTransaction,
      accounts,
    },
  };
};

const transactionByAccounId = (
  transaction: SecurityTransactionResponse[],
  accountId: string | string[] | undefined
) => {
  const accounts = typeof accountId === 'string' ? [accountId] : accountId;

  if (!accounts) return transaction;

  return transaction.filter((t) => accounts.includes(t.moneyAccountId));
};

const transactionsByStatus = (transactions: SecurityTransactionResponse[], status: string | string[] | undefined) => {
  switch (status) {
    case 'open':
      return transactions.filter((t) => !t.closeAt);
    case 'close':
      return transactions.filter((t) => t.closeAt);
    default:
      return transactions;
  }
};

function transactionsSummary(pageData: readonly SecurityTransactionResponse[]): ReactNode {
  const totalInvestedOpen = pageData
    .filter((s) => !s.closeAt)
    .map((s) => s.totalInvested)
    .reduce((partialSum, a) => partialSum + a, 0);
  const totalInvestedClose = pageData
    .filter((s) => s.closeAt)
    .map((s) => s.totalInvested)
    .reduce((partialSum, a) => partialSum + a, 0);
  const totalAtClose = pageData
    .map((s) => s.totalInvestmentClose)
    .reduce((partialSum: number, a) => partialSum + (a ?? 0), 0);
  const amountDiff = totalAtClose ? totalAtClose - totalInvestedClose : undefined;
  const amountPercentage = amountDiff ? amountDiff / totalInvestedClose : undefined;
  const { Text } = Typography;
  return (
    <Table.Summary.Row>
      <Table.Summary.Cell colSpan={9} index={0}>
        <Text strong>Summary</Text>
      </Table.Summary.Cell>
      <Table.Summary.Cell index={1} align="right">
        <Text strong>{moneyFormatter(totalInvestedOpen + totalInvestedClose)}</Text>
      </Table.Summary.Cell>
      <Table.Summary.Cell index={2} align="right">
        <Text strong type={totalAtClose > totalInvestedClose ? 'success' : 'danger'}>
          {moneyFormatter(totalAtClose)}
        </Text>
      </Table.Summary.Cell>
      <Table.Summary.Cell index={3} align="right">
        <Text strong type={amountDiff && amountDiff > 0 ? 'success' : 'danger'}>
          {moneyFormatter(amountDiff)}
        </Text>
      </Table.Summary.Cell>
      <Table.Summary.Cell index={4} align="right">
        <Text strong type={amountPercentage && amountPercentage > 0 ? 'success' : 'danger'}>
          {amountPercentage ? (amountPercentage * 100).toPrecision(2) + '%' : ''}
        </Text>
      </Table.Summary.Cell>
    </Table.Summary.Row>
  );
}
