import { Layout, theme } from 'antd';
import Head from 'next/head';
import { ReactNode } from 'react';
import Footer from './Footer';
import { Header, HeaderProps } from './Header';
import Sidebar from './Sidebar';

type DashboardLayout = HeaderProps & {
  children: ReactNode;
};

export default function DashboardLayout({ children, ...props }: DashboardLayout) {
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
          <Header {...props} />
          <Content style={{ margin: '10px 20px' }}>{children}</Content>
          <Footer />
        </Layout>
      </Layout>
    </>
  );
}
