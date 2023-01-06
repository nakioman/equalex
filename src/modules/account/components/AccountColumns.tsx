import { Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { AccountResponse } from '../../../interfaces/account';
import { nameof } from '../../../lib/utils';
import AccountRowActions from './AccountRowActions';

const { Text } = Typography;

const columns = (): ColumnsType<AccountResponse> => [
  {
    title: 'Name',
    dataIndex: nameof<AccountResponse>('name'),
    sorter: (a, b) => a.name.localeCompare(b.name),
    defaultSortOrder: 'ascend',
  },
  {
    title: 'Cash Available',
    dataIndex: nameof<AccountResponse>('cashAvailable'),
    sorter: (a, b) => a.cashAvailable - b.cashAvailable,
    render: (val) => (val > 0 ? val : '-'),
    width: 250,
    align: 'right',
  },
  {
    title: 'Cash Invested',
    dataIndex: nameof<AccountResponse>('cashInvested'),
    sorter: (a, b) => a.cashAvailable - b.cashAvailable,
    render: (val) => (val > 0 ? val : '-'),
    width: 250,
    align: 'right',
  },
  {
    title: 'Δ %',
    align: 'right',
    width: 250,
    dataIndex: nameof<AccountResponse>('dailyChangePercent'),
    sorter: (a, b) => a.dailyChangePercent - b.dailyChangePercent,
    render: (value) => (
      <Text type={value > 0 ? 'success' : 'danger'}>{value ? (value * 100).toPrecision(2) + '%' : ''}</Text>
    ),
  },
  {
    title: 'Δ amount',
    align: 'right',
    width: 250,
    dataIndex: nameof<AccountResponse>('dailyChange'),
    sorter: (a, b) => a.dailyChange - b.dailyChange,
    render: (value) => (
      <Text type={value > 0 ? 'success' : 'danger'}>
        {value ? Math.round((value + Number.EPSILON) * 100) / 100 : ''}
      </Text>
    ),
  },
  {
    title: 'Action',
    key: 'actions',
    align: 'center',
    width: 150,
    render: (_, record) => <AccountRowActions />,
  },
];

export default columns;