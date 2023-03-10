import { MenuProps } from 'antd';
import { AiFillBank, AiOutlineCalculator, AiOutlinePlus, AiOutlineStock } from 'react-icons/ai';
import { FaHome, FaMoneyBill } from 'react-icons/fa';
import { GiPayMoney } from 'react-icons/gi';
import { RiStockLine } from 'react-icons/ri';

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
      {
        label: 'All transactions',
        key: '/security/transaction?status=open',
        icon: <RiStockLine />,
      },
      {
        label: 'Add transaction',
        key: '/security/transaction/add',
        icon: <AiOutlinePlus />,
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
        icon: <FaMoneyBill />,
      },
      {
        label: 'Add Money',
        key: '/account/transaction/add',
        icon: <GiPayMoney />,
      },
    ],
  },
  {
    label: 'Utilities',
    key: 'utilities',
    type: 'group',
    children: [
      {
        label: 'Risk/Reward',
        key: '/utilities/risk_reward',
        icon: <AiOutlineCalculator />,
      },
    ],
  },
];

export default Routes;
