import { GetServerSidePropsContext, InferGetStaticPropsType } from 'next';
import { getToken } from 'next-auth/jwt';
import { useRouter } from 'next/router';
import { ReactElement, useState } from 'react';
import EqualexTable from '../../../common/components/EqualexTable';
import { SecurityTransactionResponse } from '../../../interfaces/security';
import DashboardLayout from '../../../layout/dashboard';
import { nameof } from '../../../lib/utils';
import { getSecurityTransactions } from '../../../modules/security/api/getSecurityTransactions';
import SecurityTransactionColumns from '../../../modules/security/components/SecurityTransactionColumns';

type SecurityTransactionPageProps = InferGetStaticPropsType<typeof getServerSideProps>;

export default function SecurityTransactionPage({ transactions }: SecurityTransactionPageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const columns = SecurityTransactionColumns(() => {
    setLoading(true);
    router.replace('/security/transaction');
    if (router.isReady) setLoading(false);
  });

  return (
    <EqualexTable
      size="small"
      addLink="/security/transaction/add"
      title="Securities transactions"
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
    />
  );
}

SecurityTransactionPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout title="Transactions">{page}</DashboardLayout>;
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const token = await getToken(ctx);
  const userId = token?.sub as string;
  const transactions = token ? await getSecurityTransactions(userId) : [];

  return {
    props: {
      transactions,
    },
  };
};
