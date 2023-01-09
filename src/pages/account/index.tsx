import { Table, Typography } from 'antd';
import { GetServerSidePropsContext, InferGetStaticPropsType } from 'next';
import { getToken } from 'next-auth/jwt';
import { useRouter } from 'next/router';
import { ReactElement, ReactNode, useState } from 'react';
import EqualexTable from '../../common/components/EqualexTable';
import { AccountResponse } from '../../interfaces/account';
import DashboardLayout from '../../layout/dashboard';
import { moneyFormatter, nameof } from '../../lib/utils';
import { getAccounts } from '../../modules/account/api/getAccounts';
import AccountColumns from '../../modules/account/components/AccountColumns';

type AccountIndexPageProps = InferGetStaticPropsType<typeof getServerSideProps>;

export default function AccountIndexPage({ accounts }: AccountIndexPageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const columns = AccountColumns(() => {
    setLoading(true);
    router.replace('/account');
    if (router.isReady) setLoading(false);
  });

  return (
    <EqualexTable
      addLink="/account/add"
      title="Accounts"
      columns={columns}
      dataSource={accounts}
      rowKey={nameof<AccountResponse>('id')}
      loading={loading}
      summary={accountSummary}
    />
  );
}

AccountIndexPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout title="Accounts">{page}</DashboardLayout>;
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const token = await getToken(ctx);
  const userId = token?.sub as string;
  const accounts = token ? await getAccounts(userId) : [];

  return {
    props: {
      accounts,
    },
  };
};

function accountSummary(pageData: readonly AccountResponse[]): ReactNode {
  const totalCashAvailable = pageData.map((s) => s.cashAvailable).reduce((partialSum: number, a) => partialSum + a, 0);
  const totalInvested = pageData.map((s) => s.cashInvested).reduce((partialSum: number, a) => partialSum + (a ?? 0), 0);
  const totalActualValue = pageData
    .map((s) => s.actualInvestedValue)
    .reduce((partialSum: number, a) => partialSum + (a ?? 0), 0);
  const { Text } = Typography;
  return (
    <Table.Summary.Row>
      <Table.Summary.Cell index={0}>
        <Text strong>Summary</Text>
      </Table.Summary.Cell>
      <Table.Summary.Cell index={1} align="right">
        <Text strong>{moneyFormatter(totalCashAvailable)}</Text>
      </Table.Summary.Cell>
      <Table.Summary.Cell index={2} align="right">
        <Text strong>{moneyFormatter(totalInvested)}</Text>
      </Table.Summary.Cell>
      <Table.Summary.Cell index={3} align="right">
        <Text strong type={totalActualValue > totalInvested ? 'success' : 'danger'}>
          {moneyFormatter(totalActualValue)}
        </Text>
      </Table.Summary.Cell>
    </Table.Summary.Row>
  );
}
