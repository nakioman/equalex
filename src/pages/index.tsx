import { ReactElement } from 'react';
import DashboardLayout from '../layout/dashboard';

export default function Home() {
  return (
    <>
      <div>Index</div>
    </>
  );
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout title="Home">{page}</DashboardLayout>;
};
