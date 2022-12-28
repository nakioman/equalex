import { Layout, Menu, MenuProps, Typography } from "antd";
import Image from 'next/image';
import { useRouter } from "next/router";
import { MenuClickEventHandler } from 'rc-menu/lib/interface';
import { useState } from "react";
import { AiOutlineStock } from "react-icons/ai";
import { FaHome } from 'react-icons/fa';

type MenuItem = Required<MenuProps>['items'][number];
const { Title } = Typography;

const Routes: MenuItem[] = [
    {
        label: "Home",
        icon: <FaHome />,
        key: "/"
    },
    {
        label: "Securities",
        icon: <AiOutlineStock />,
        key: "/security"
    },
]

function Footer() {
    const [collapsed, setCollapsed] = useState(false);
    const { Sider } = Layout;
    const router = useRouter();

    const handleMenuClick: MenuClickEventHandler = ({ key }) => {
        router.push(key);
    }

    return (
        <Sider theme="light" collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
            <div style={{ display: "flex", justifyContent: "center" }} >
                {!collapsed && <Image src="/img/logo.png" alt="Equalex" width={190} height={42.7} style={{ margin: 4 }} />}
                {collapsed && <Image src="/img/icon.png" alt="Equalex" width={28.6} height={42.7} style={{ margin: 4 }} />}
            </div>
            <Menu selectedKeys={[router.route]} mode="inline" items={Routes} onClick={handleMenuClick} />
        </Sider>
    );
}

export default Footer;