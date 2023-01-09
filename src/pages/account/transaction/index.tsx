import { Table, Typography } from 'antd';
import { GetServerSidePropsContext, InferGetStaticPropsType } from 'next';
import { getToken } from 'next-auth/jwt';
import { useRouter } from 'next/router';
import { ReactElement, ReactNode, useState } from 'react';
import EqualexTable from '../../../common/components/EqualexTable';
import { MoneyTransactionResponse } from '../../../interfaces/account';
import DashboardLayout from '../../../layout/dashboard';
import { moneyFormatter, nameof } from '../../../lib/utils';
import { getMoneyTransactions } from '../../../modules/account/api/getMoneyTransactions';
import MoneyTransactionColumns from '../../../modules/account/components/MoneyTransactionColumns';

type MoneyTransactionPageProps = InferGetStaticPropsType<typeof getServerSideProps>;

export default function MoneyTransactionPage({ transactions, selectedAccountId }: MoneyTransactionPageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const columns = MoneyTransactionColumns(
    transactions,
    () => {
      setLoading(true);
      router.replace('/account/transaction');
      if (router.isReady) setLoading(false);
    },
    selectedAccountId
  );

  return (
    <EqualexTable
      addLink="/account/transaction/add"
      title="Money transactions"
      columns={columns}
      dataSource={transactions}
      rowKey={nameof<MoneyTransactionResponse>('id')}
      loading={loading}
      summary={accountTransactionsSummary}
    />
  );
}

MoneyTransactionPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout title="Money transactions">{page}</DashboardLayout>;
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { accountId } = ctx.query;
  const token = await getToken(ctx);
  const userId = token?.sub as string;
  const transactions = token ? await getMoneyTransactions(userId) : [];
  return {
    props: {
      transactions,
      selectedAccountId: accountId as string | undefined,
    },
  };
};

function accountTransactionsSummary(pageData: readonly MoneyTransactionResponse[]): ReactNode {
  const totalAmount = pageData.map((s) => s.amount).reduce((partialSum: number, a) => partialSum + a, 0);
  const { Text } = Typography;
  return (
    <Table.Summary.Row>
      <Table.Summary.Cell index={0} colSpan={2}>
        <Text strong>Summary</Text>
      </Table.Summary.Cell>
      <Table.Summary.Cell index={1} align="right">
        <Text strong>{moneyFormatter(totalAmount)}</Text>
      </Table.Summary.Cell>
    </Table.Summary.Row>
  );
}
