import { Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { AccountResponse } from '../../../interfaces/account';
import { moneyFormatter, nameof } from '../../../lib/utils';
import AccountRowActions from './AccountRowActions';

const { Text } = Typography;

const columns = (refresh: () => void): ColumnsType<AccountResponse> => [
  {
    title: 'Name',
    dataIndex: nameof<AccountResponse>('name'),
    sorter: (a, b) => a.name.localeCompare(b.name),
    defaultSortOrder: 'ascend',
  },
  {
    title: 'Cash Available',
    dataIndex: nameof<AccountResponse>('cashAvailable'),
    sorter: (a, b) => (a.cashAvailable && b.cashAvailable ? a.cashAvailable - b.cashAvailable : 0),
    render: value => moneyFormatter(value),
    width: 200,
    align: 'right',
  },
  {
    title: 'Cash Invested',
    dataIndex: nameof<AccountResponse>('cashInvested'),
    sorter: (a, b) => (a.cashInvested && b.cashInvested ? a.cashInvested - b.cashInvested : 0),
    render: value => moneyFormatter(value),
    width: 200,
    align: 'right',
  },
  {
    title: 'Actual value',
    dataIndex: nameof<AccountResponse>('actualInvestedValue'),
    sorter: (a, b) => (a.actualInvestedValue && b.actualInvestedValue ? a.actualInvestedValue - b.actualInvestedValue : 0),
    render: (value, record) => (<Text type={value > (record.cashInvested ?? 0) ? 'success' : 'danger'}>{moneyFormatter(value)}</Text>),
    width: 200,
    align: 'right',
  },
  {
    title: 'Action',
    key: 'actions',
    align: 'center',
    width: 150,
    render: (_, record) => <AccountRowActions account={record} refresh={refresh} />,
  },
];

export default columns;
