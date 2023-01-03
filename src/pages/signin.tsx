import { Button, Col, Divider, Layout, Row, theme, Typography } from "antd";
import { BuiltInProviderType } from "next-auth/providers";
import { ClientSafeProvider, getProviders, LiteralUnion, signIn } from "next-auth/react";
import Image from 'next/image';
import { useRouter } from "next/router";
import { useState } from "react";
import logoImage from '../../../public/img/logo.png';
import Footer from "../layout/dashboard/Footer";

type SignInPageProps = {
  providers: Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider>
}

export default function SignInPage({ providers }: SignInPageProps) {
  const { Header, Content } = Layout;
  const { token: { colorBgContainer }, } = theme.useToken();
  const { Title } = Typography;
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const doSignIn = async (provider: ClientSafeProvider) => {
    setLoading(true);
    const result = await signIn(provider.id, {
      callbackUrl: router.query.callbackUrl as string,
      redirect: true
    });
  }

  return (
    <Layout style={{ minHeight: '100vh', background: colorBgContainer, }} >
      <Header style={{ background: colorBgContainer }}>
        <Image src={logoImage} alt="Equalex" height={42} style={{ margin: 4 }} />
      </Header>
      <Content>
        <Row justify="center">
          <Col xs={{ span: 24, offset: 0 }} lg={{ span: 6, }} md={{ span: 12 }}>
            <Title>Sign In</Title>
            <Title level={5}>Choose your login provider</Title>
            <Divider orientation="center" />
            {Object.values(providers).map((provider) => (
              <Row key={provider.id}>
                <Button loading={loading} type="primary" block onClick={() => doSignIn(provider)}>Sign in with {provider.name}</Button>
              </Row>
            ))}
          </Col>
        </Row>
      </Content>
      <Footer />
    </Layout >
  );
}

export async function getServerSideProps() {
  const providers = await getProviders()
  return {
    props: { providers },
  }
}
