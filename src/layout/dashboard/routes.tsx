import { MenuProps } from 'antd';
import { AiFillBank, AiOutlineStock } from 'react-icons/ai';
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
  {
    label: 'Accounts',
    key: 'accounts',
    type: 'group',
    children: [
      {
        label: 'Summary',
        key: '/account',
        icon: <AiFillBank />,
      },
    ],
  },
];

export default Routes;
