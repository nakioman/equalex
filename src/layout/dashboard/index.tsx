import { Layout } from 'antd';
import Head from 'next/head';
import { ReactNode } from 'react';
import Footer from './footer';
import { Header } from './header';
import Sidebar from './sidebar';

type DashboardLayout = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayout) {
  const { Content } = Layout;

  return (
    <>
      <Head>
        <title>Equalex</title>
      </Head>
      <Layout style={{ minHeight: '100vh' }}>
        <Sidebar />
        <Layout>
          <Header />
          <Content>{children}</Content>
          <Footer />
        </Layout>
      </Layout>
    </>
  );
}
