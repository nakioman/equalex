import { Layout, Menu } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { MenuClickEventHandler } from 'rc-menu/lib/interface';
import { useState } from 'react';
import logoIconImage from '../../../public/img/icon.png';
import logoImage from '../../../public/img/logo.png';
import Routes from './routes';

function Footer() {
  const [collapsed, setCollapsed] = useState(false);
  const { Sider } = Layout;
  const router = useRouter();

  const handleMenuClick: MenuClickEventHandler = ({ key }) => {
    router.push(key);
  };

  return (
    <Sider
      theme="light"
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
    >
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {!collapsed && (
          <Image
            src={logoImage}
            alt="Equalex"
            height={42}
            style={{ margin: 4 }}
          />
        )}
        {collapsed && (
          <Image
            src={logoIconImage}
            alt="Equalex"
            height={42}
            style={{ margin: 4 }}
          />
        )}
      </div>
      <Menu
        selectedKeys={[router.route]}
        mode="inline"
        items={Routes}
        onClick={handleMenuClick}
      />
    </Sider>
  );
}

export default Footer;
