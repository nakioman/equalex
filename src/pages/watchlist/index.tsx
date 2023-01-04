import { PlusOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Col, Row, Table } from 'antd';
import { useRouter } from 'next/router';
import { ReactElement, useEffect, useState } from 'react';
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
  }, [loading]);

  return (
    <>
      <Row gutter={[24, 0]}>
        <Col xs="24" xl={24}>
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
        </Col>
      </Row>
    </>
  );
}

SecurityPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
