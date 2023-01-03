import { ConfigProvider, theme } from 'antd';
import 'antd/dist/reset.css';
import { NextPage } from 'next';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { ReactElement, ReactNode } from 'react';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const customTheme = {
  token: {
    colorPrimary: '#55a22f',
  },
  algorithm: theme.defaultAlgorithm,
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <SessionProvider session={pageProps.session}>
        <ConfigProvider theme={customTheme}>{getLayout(<Component {...pageProps} />)}</ConfigProvider>
      </SessionProvider>
    </>
  );
}
