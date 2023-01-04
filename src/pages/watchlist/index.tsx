import { PlusOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Table } from 'antd';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { ReactElement, useEffect, useState } from 'react';
import { SecurityResponse } from '../../interfaces/security';
import { WatchlistResponse } from '../../interfaces/watchlist';
import DashboardLayout from '../../layout/dashboard';
import { nameof } from '../../lib/utils';
import Columns from '../../modules/watchlist/components/Columns';

export default function SecurityPage() {
  const [watchlist, setWatchlist] = useState<WatchlistResponse[] | undefined>();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [showError, setShowError] = useState<boolean>();
  const columns = Columns(() => {
    setLoading(true);
  });
  const [selectedSecurity, setSelectedSecurity] = useState<SecurityResponse>();

  useEffect(() => {
    async function getSecurities() {
      const res = await fetch('/api/watchlist');

      if (!res.ok) setShowError(true);
      else {
        const json = await res.json();
        setWatchlist(json);
      }
      setLoading(false);
    }
    getSecurities();
    asyncFetch();
  }, [loading]);

  const asyncFetch = async () => {
    const securityId = 'clcgh6o4j0001nq01awk9llrc';
    const timeframe = 'Year';
    const res = await fetch(`/api/security/${securityId}?timeframe=${timeframe}`);
    const json = await res.json();
    setSelectedSecurity(json);
  };

  const closes = selectedSecurity ? selectedSecurity.prices.map((v) => v.close) : [];
  const min = Math.min(...closes) - 1;
  const Stock = dynamic(() => import('@ant-design/plots').then(({ Stock }) => Stock), {
    ssr: false,
    loading: () => <div>loading...</div>,
  });
  return (
    <>
      {showError && <Alert showIcon type="error" message="Error retreiving securities, please try again later" />}
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
      <Card>
        <Stock
          data={selectedSecurity ? selectedSecurity.prices : []}
          padding="auto"
          xField="date"
          yField={['open', 'close', 'high', 'low']}
        />
      </Card>
    </>
  );
}

SecurityPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
