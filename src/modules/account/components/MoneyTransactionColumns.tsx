import { Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { ColumnFilterItem } from 'antd/lib/table/interface';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { MoneyTransactionResponse } from '../../../interfaces/account';
import { moneyFormatter, nameof } from '../../../lib/utils';
import MoneyTransactionRowActions from './MoneyTransactionRowActions';

dayjs.extend(utc);
const { Text } = Typography;

const filterbyAccounts = (arr: MoneyTransactionResponse[]) => arr.reduce((acc: ColumnFilterItem[], current) => {
    const x = acc.find(item => item.value === current.accountId);
    if (!x) return acc.concat([{ text: current.accountName, value: current.accountId }]);
    return acc;
}, []);

const columns = (transactions: MoneyTransactionResponse[], refresh: () => void, defaultFilteredValue: string | undefined): ColumnsType<MoneyTransactionResponse> => [
    {
        title: 'Account',
        dataIndex: nameof<MoneyTransactionResponse>('accountName'),
        sorter: (a, b) => a.accountName.localeCompare(b.accountName),
        defaultSortOrder: 'ascend',
        filters: filterbyAccounts(transactions),
        filterSearch: true,
        onFilter: (value, record) => record.accountId === value,
        defaultFilteredValue: defaultFilteredValue ? [defaultFilteredValue] : undefined
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
