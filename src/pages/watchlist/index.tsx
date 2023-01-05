import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Table } from 'antd';
import { GetServerSidePropsContext, InferGetStaticPropsType } from 'next';
import { getToken } from 'next-auth/jwt';
import { useRouter } from 'next/router';
import { ReactElement, useState } from 'react';
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
    router.replace('/watchlist')
    if (router.isReady) setLoading(false);
  });

  return (
    <>
      <Card
        title="Securities"
        extra={
          <Button icon={<PlusOutlined />} onClick={() => router.push('/watchlist/add')}>
            Add
          </Button>
        }
      >
        <Table
          dataSource={watchlist}
          columns={columns}
          rowKey={nameof<WatchlistResponse>('ticker')}
          pagination={false}
          loading={loading}
        />
      </Card>
    </>
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
      watchlist
    }
  }
}