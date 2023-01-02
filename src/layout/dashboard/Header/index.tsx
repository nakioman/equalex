import { Col, Dropdown, Layout, MenuProps, Row, theme, Typography } from 'antd';
import Link from 'next/link';
import { FaCog } from 'react-icons/fa';
import Breadcrumbs, { BreadcrumbProps } from './Breadcrumbs';

export interface HeaderProps extends BreadcrumbProps {}

const settingsItems: MenuProps['items'] = [
  {
    key: '1',
    label: <Link href="/logout">Logout</Link>,
  },
];

export function Header(props: HeaderProps) {
  const { Header: AntHeader } = Layout;
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
