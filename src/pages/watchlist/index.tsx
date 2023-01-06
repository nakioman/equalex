import { GetServerSidePropsContext, InferGetStaticPropsType } from 'next';
import { getToken } from 'next-auth/jwt';
import { useRouter } from 'next/router';
import { ReactElement, useState } from 'react';
import EqualexTable from '../../common/components/EqualexTable';
import { WatchlistResponse } from '../../interfaces/watchlist';
import DashboardLayout from '../../layout/dashboard';
import { nameof } from '../../lib/utils';
import getWatchlist from '../../modules/watchlist/api/getWatchlist';
import Columns from '../../modules/watchlist/components/Columns';

type SecurityPageProps = InferGetStaticPropsType<typeof getServerSideProps>;

export default function SecurityPage({ watchlist }: SecurityPageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const columns = Columns(() => {
    setLoading(true);
    router.replace('/watchlist');
    if (router.isReady) setLoading(false);
  });

  return (
    <EqualexTable
      addLink="/watchlist/add"
      title="Securities"
      columns={columns}
      dataSource={watchlist}
      rowKey={nameof<WatchlistResponse>('ticker')}
      loading={loading}
    />
  );
}

SecurityPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout title="Watchlist">{page}</DashboardLayout>;
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const token = await getToken(ctx);
  const userId = token?.sub as string;
  const watchlist = token ? await getWatchlist(userId) : [];

  return {
    props: {
      watchlist,
    },
  };
};
