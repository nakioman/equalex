import { GetServerSidePropsContext, InferGetStaticPropsType } from 'next';
import { getToken } from 'next-auth/jwt';
import { useRouter } from 'next/router';
import { ReactElement, useState } from 'react';
import EqualexTable from '../../common/components/EqualexTable';
import { AccountResponse } from '../../interfaces/account';
import DashboardLayout from '../../layout/dashboard';
import { nameof } from '../../lib/utils';
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
