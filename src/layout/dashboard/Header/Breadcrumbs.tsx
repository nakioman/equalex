import { Breadcrumb, Typography } from 'antd';
import { MenuItemGroupType, MenuItemType, SubMenuType } from 'antd/es/menu/hooks/useItems';
import { useRouter } from 'next/router';
import { MouseEventHandler, ReactNode } from 'react';
import Routes, { MenuItem } from '../routes';

export type BreadcrumbProps = {
  breadcrumbParent?: string;
  breadcrumbTitle?: ReactNode;
};

const traverseRoutes = (routes: MenuItem[], path: MenuItem[], pathname: string): MenuItem[] | null => {
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

const useBreadcrumbPath = (parent?: string): MenuItem[] => {
  const router = useRouter();
  const pathname = parent ?? router.pathname;
  const removeQuestionMark = pathname.replace(/\?/g, '/');
  const removeEquals = removeQuestionMark.replace(/\=/g, '/');

  const list: MenuItem[] = [];
  const path = traverseRoutes(Routes, list, removeEquals) ?? [];
  return path;
};

const Breadcrumbs = ({ breadcrumbParent, breadcrumbTitle }: BreadcrumbProps) => {
  const breadcrumbPath = useBreadcrumbPath(breadcrumbParent);
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
        {breadcrumbTitle && <Breadcrumb.Item>{breadcrumbTitle}</Breadcrumb.Item>}
      </Breadcrumb>
      <Title level={3}>{(breadcrumbPath[breadcrumbPath.length - 1] as MenuItemType).label}</Title>
    </>
  );
};

export default Breadcrumbs;
