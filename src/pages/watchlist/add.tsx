import { Card, Divider } from 'antd';
import Link from 'next/link';
import { ReactElement, useState } from 'react';
import { SecuritySearchResponse } from '../../interfaces/security';
import DashboardLayout from '../../layout/dashboard';
import SearchForm from '../../modules/watchlist/components/SearchForm';
import WatchlistAddForm from '../../modules/watchlist/components/WatchlistAddForm';

export default function SecurityAddPage() {
  const [security, setSecurity] = useState<SecuritySearchResponse>();

  const resetForm = () => {
    setSecurity(undefined);
  };

  const onSecurityFound = (security: SecuritySearchResponse) => {
    setSecurity(security);
  };

  return (
    <>
      <Card title="Search security">
        <SearchForm onValuesChange={resetForm} onSecurityFound={onSecurityFound} />
        <Divider type="horizontal" />
        <WatchlistAddForm security={security} />
      </Card>
    </>
  );
}

SecurityAddPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <DashboardLayout
      breadcrumbParent="/watchlist"
      breadcrumbTitle={
        <Link href="/security/add" className="ant-typograph">
          Add
        </Link>
      }
    >
      {page}
    </DashboardLayout>
  );
};
