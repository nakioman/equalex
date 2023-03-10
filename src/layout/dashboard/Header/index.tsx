import { Col, Dropdown, Layout, MenuProps, Row, theme, Typography } from 'antd';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { FaCog } from 'react-icons/fa';
import Breadcrumbs, { BreadcrumbProps } from './Breadcrumbs';

export interface HeaderProps extends BreadcrumbProps {
  title: string;
}

const settingsItems: MenuProps['items'] = [
  {
    key: 'settings',
    label: <Link href="/settings">Settings</Link>,
  },
  {
    key: 'signOut',
    label: (
      <Link href="#" onClick={() => signOut()}>
        Logout
      </Link>
    ),
  },
];

export function Header({ title, ...props }: HeaderProps) {
  const { Header: AntHeader } = Layout;
  const { Title } = Typography;
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <AntHeader
      style={{
        padding: '10px 20px',
        background: colorBgContainer,
      }}
    >
      <Row>
        <Col span={23}>
          <Breadcrumbs {...props} />
          <Title level={3}>{title}</Title>
        </Col>
        <Col span={1}>
          <Dropdown menu={{ items: settingsItems }} placement="bottom" arrow={{ pointAtCenter: true }}>
            <Typography.Link href="#" onClick={(e) => e.preventDefault()}>
              <FaCog size={20} />
            </Typography.Link>
          </Dropdown>
        </Col>
      </Row>
    </AntHeader>
  );
}
