import { MenuProps } from 'antd';
import { AiFillBank, AiOutlineStock } from 'react-icons/ai';
import { FaHome, FaMoneyBill } from 'react-icons/fa';
import { GiPayMoney } from 'react-icons/gi';

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
      {
        label: 'Transactions',
        key: '/account/transaction',
        icon: <FaMoneyBill />
      },
      {
        label: 'Add Money',
        key: '/account/transaction/add',
        icon: <GiPayMoney />
      }
    ],
  },
];

export default Routes;
