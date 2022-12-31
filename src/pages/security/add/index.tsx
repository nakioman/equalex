import { Card, Divider } from 'antd';
import Link from 'next/link';
import { ReactElement, useState } from "react";
import { SecurityResponse } from '../../../interfaces/security';
import DashboardLayout from "../../../layout/dashboard";
import SearchForm from './components/SearchForm';
import WatchlistAddForm from './components/WatchlistAddForm';



export default function SecurityAddPage() {
  const [security, setSecurity] = useState<SecurityResponse>();

  const resetForm = () => {
    setSecurity(undefined);
  }

  const onSecurityFound = (security: SecurityResponse) => {
    setSecurity(security);
  }

  return (
    <>
      <Card title="Search security">
        <SearchForm onValuesChange={resetForm} onSecurityFound={onSecurityFound} />
        <Divider type='horizontal' />
        <WatchlistAddForm security={security} />
      </Card>
    </>
  );
}

SecurityAddPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout breadcrumbParent="/security" breadcrumbTitle={<Link href="/security/add" className='ant-typograph' >Add</Link>}>{page}</DashboardLayout>;
};
