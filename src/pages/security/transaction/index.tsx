import { Col, Radio, Row, Table, Typography } from 'antd';
import { GetServerSidePropsContext, InferGetStaticPropsType } from 'next';
import { getToken } from 'next-auth/jwt';
import { useRouter } from 'next/router';
import { ReactElement, ReactNode, useEffect, useState } from 'react';
import EqualexTable from '../../../common/components/EqualexTable';
import { SecurityTransactionResponse } from '../../../interfaces/security';
import DashboardLayout from '../../../layout/dashboard';
import { moneyFormatter, nameof } from '../../../lib/utils';
import { getSecurityTransactions } from '../../../modules/security/api/getSecurityTransactions';
import SecurityTransactionColumns from '../../../modules/security/components/SecurityTransactionColumns';

type SecurityTransactionPageProps = InferGetStaticPropsType<typeof getServerSideProps>;

export default function SecurityTransactionPage({ transactions }: SecurityTransactionPageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const { status } = router.query;

  const columns = SecurityTransactionColumns(() => {
    setLoading(true);
    router.replace('/security/transaction');
    if (router.isReady) setLoading(false);
  });

  useEffect(() => {
    router.isReady && setLoading(false);
  }, [router]);

  const updateTimeFrame = (value: boolean) => {
    setLoading(true);
    router.push(`/security/transaction?status=${value}`);
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
      <Row justify="start">
        <Col span={24} style={{ paddingBottom: 20 }}>
          <Radio.Group size="small" value={status ?? ''} onChange={(e) => updateTimeFrame(e.target.value)}>
            <Radio.Button value="open">Open</Radio.Button>
            <Radio.Button value="close">Close</Radio.Button>
            <Radio.Button value="">All</Radio.Button>
          </Radio.Group>
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
  const { status } = ctx.query;
  const userId = token?.sub as string;
  const transactions = token ? await getSecurityTransactions(userId) : [];
  const filteredTransaction = transactionsByStatus(transactions, status);
  return {
    props: {
      transactions: filteredTransaction,
    },
  };
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
