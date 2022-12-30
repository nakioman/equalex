import { MenuProps } from 'antd';
import { AiOutlineStock, AiOutlineTransaction } from 'react-icons/ai';
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
        label: 'All',
        key: '/security',
        icon: <AiOutlineStock />,
      },
      {
        label: 'Transactions',
        key: '/security/transaction',
        icon: <AiOutlineTransaction />,
      },
    ],
  },
];

export default Routes;
