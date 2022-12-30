import { Layout, theme } from 'antd';
import Head from 'next/head';
import { ReactNode } from 'react';
import Footer from './footer';
import { Header } from './header';
import Sidebar from './sidebar';

type DashboardLayout = {
  children: ReactNode;
  breadcrumbParent?: string
  breadcrumbTitle?: ReactNode
};

export default function DashboardLayout({ children, breadcrumbParent, breadcrumbTitle }: DashboardLayout) {
  const { Content } = Layout;
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <>
      <Head>
        <title>Equalex</title>
      </Head>
      <Layout style={{ minHeight: '100vh', background: colorBgContainer }}>
        <Sidebar />
        <Layout>
          <Header breadcrumbParent={breadcrumbParent} breadcrumbTitle={breadcrumbTitle} />
          <Content
            style={{ margin: '10px 20px' }}
          >
            {children}
          </Content>
          <Footer />
        </Layout>
      </Layout>
    </>
  );
}
