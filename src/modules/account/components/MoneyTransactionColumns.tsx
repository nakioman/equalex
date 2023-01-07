import { Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { MoneyTransactionResponse } from '../../../interfaces/account';
import { moneyFormatter, nameof } from '../../../lib/utils';
import MoneyTransactionRowActions from './MoneyTransactionRowActions';

dayjs.extend(utc);
const { Text } = Typography;

const columns = (refresh: () => void): ColumnsType<MoneyTransactionResponse> => [
    {
        title: 'Account',
        dataIndex: nameof<MoneyTransactionResponse>('accountName'),
        sorter: (a, b) => a.accountName.localeCompare(b.accountName),
        defaultSortOrder: 'ascend',
    },
    {
        title: 'Description',
        dataIndex: nameof<MoneyTransactionResponse>('description'),
    },
    {
        title: 'Amount',
        dataIndex: nameof<MoneyTransactionResponse>('amount'),
        sorter: (a, b) => a.amount - b.amount,
        width: 200,
        align: 'right',
        render: (value) => (<Text type={value > 0 ? 'success' : 'danger'}>{moneyFormatter(value)}</Text>)
    },
    {
        title: 'Date',
        dataIndex: nameof<MoneyTransactionResponse>('createdAt'),
        sorter: (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
        width: 200,
        align: 'center',
        render: (value) => dayjs(value).utc().format('MMM D, YYYY'),
    },
    {
        title: 'Action',
        key: 'actions',
        align: 'center',
        width: 150,
        render: (_, record) => <MoneyTransactionRowActions transaction={record} refresh={refresh} />,
    },
];

export default columns;
