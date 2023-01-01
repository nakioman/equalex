import { MenuProps } from 'antd';
import { AiOutlineStock } from 'react-icons/ai';
import { FaHome } from 'react-icons/fa';

export type MenuItem = Required<MenuProps>['items'][number];

const Routes: MenuItem[] = [
  {
    label: 'Home',
    icon: <FaHome />,
    key: '/',
  },
  {
    label: 'Securities',
    key: 'security',
    type: 'group',
    children: [
      {
        label: 'Watchlist',
        key: '/watchlist',
        icon: <AiOutlineStock />,
      },

    ],
  },
];

export default Routes;
