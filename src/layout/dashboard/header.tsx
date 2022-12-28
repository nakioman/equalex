import {
  Breadcrumb,
  Col,
  Dropdown,
  Layout,
  MenuProps,
  Row,
  theme,
  Typography,
} from 'antd';
import { MenuItemGroupType, SubMenuType } from 'antd/es/menu/hooks/useItems';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { MenuItemType } from 'rc-menu/lib/interface';
import { MouseEventHandler } from 'react';
import { FaCog } from 'react-icons/fa';
import Routes, { MenuItem } from './routes';

const traverseRoutes = (
  routes: MenuItem[],
  path: MenuItem[],
  pathname: string
): MenuItem[] | null => {
  const list: MenuItem[] = [];

  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];

    if (route?.key == pathname) {
      path.push(route);
      return path;
    }

    if ((route as SubMenuType)?.children != undefined) {
      path.push(route);
      return traverseRoutes((route as SubMenuType)?.children, path, pathname);
    }
  }
  return null;
};

const useBreadcrumbPath = (): MenuItem[] => {
  const router = useRouter();
  const removeQuestionMark = router.pathname.replace(/\?/g, '/');
  const removeEquals = removeQuestionMark.replace(/\=/g, '/');

  const list: MenuItem[] = [];
  const path = traverseRoutes(Routes, list, removeEquals) ?? [];
  return path;
};

const Breadcrumbs = () => {
  const breadcrumbPath = useBreadcrumbPath();
  const { Title, Text, Link } = Typography;
  const router = useRouter();

  return (
    <>
      <Breadcrumb>
        {breadcrumbPath.map((item, idx) => {
          const group = item as MenuItemGroupType;
          const menuItem = item as MenuItemType;
          const linkClickEvent: MouseEventHandler<HTMLElement> = (e) => {
            e.preventDefault();
            const anchor = e.target as HTMLAnchorElement;
            router.push(anchor.href);
          };
          return (
            <Breadcrumb.Item key={idx}>
              {group?.type == 'group' ? (
                <Text style={{ userSelect: 'none' }}>{menuItem.label}</Text>
              ) : (
                <Link href={menuItem.key as string} onClick={linkClickEvent}>
                  {menuItem.label}
                </Link>
              )}
            </Breadcrumb.Item>
          );
        })}
      </Breadcrumb>
      <Title level={3}>
        {(breadcrumbPath[breadcrumbPath.length - 1] as MenuItemType).label}
      </Title>
    </>
  );
};

const settingsItems: MenuProps['items'] = [
  {
    key: '1',
    label: <Link href="/logout">Logout</Link>,
  },
];

export function Header() {
  const { Header: AntHeader } = Layout;
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <AntHeader
      style={{
        padding: '5px 20px',
        background: colorBgContainer,
      }}
    >
      <Row>
        <Col span={23}>
          <Breadcrumbs />
        </Col>
        <Col span={1}>
          <Dropdown
            menu={{ items: settingsItems }}
            placement="bottom"
            arrow={{ pointAtCenter: true }}
          >
            <Typography.Link href="#" onClick={(e) => e.preventDefault()}>
              <FaCog size={20} />
            </Typography.Link>
          </Dropdown>
        </Col>
      </Row>
    </AntHeader>
  );
}
