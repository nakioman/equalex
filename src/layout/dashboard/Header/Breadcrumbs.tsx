import { Breadcrumb, Typography } from 'antd';
import { MenuItemGroupType, MenuItemType, SubMenuType } from 'antd/es/menu/hooks/useItems';
import { useRouter } from 'next/router';
import { MouseEventHandler, ReactElement } from 'react';
import Routes, { MenuItem } from '../routes';

export type BreadcrumbProps = {
  breadcrumbParent?: string;
  breadcrumbTitle?: ReactElement;
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
      const subList = traverseRoutes((route as SubMenuType)?.children, [route, ...path], pathname);
      if (subList && subList?.length > 0) list.push(...subList);
    }
  }
  return list;
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
  const { Text, Link } = Typography;
  const router = useRouter();

  const breadCrumbItems = breadcrumbPath.map((item, idx) => {
    const group = item as MenuItemGroupType;
    const menuItem = item as MenuItemType;
    const linkClickEvent: MouseEventHandler<HTMLElement> = (e) => {
      e.preventDefault();
      const anchor = e.target as HTMLAnchorElement;
      router.push(anchor.href);
    };
    return {
      title:
        group?.type == 'group' ? (
          <Text style={{ userSelect: 'none' }}>{menuItem.label}</Text>
        ) : (
          <Link href={menuItem.key as string} onClick={linkClickEvent}>
            {menuItem.label}
          </Link>
        ),
      key: idx,
    };
  });
  if (breadcrumbTitle) {
    breadCrumbItems.push({
      title: breadcrumbTitle,
      key: -1,
    });
  }
  return <Breadcrumb items={breadCrumbItems} />;
};

export default Breadcrumbs;
