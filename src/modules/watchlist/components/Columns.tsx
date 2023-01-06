import { Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import Link from 'next/link';
import { WatchlistResponse } from '../../../interfaces/watchlist';
import { nameof } from '../../../lib/utils';
import RowActions from './RowActions';

dayjs.extend(utc);

const { Text } = Typography;

const columns = (refresh: () => void): ColumnsType<WatchlistResponse> => [
  {
    title: 'Ticker',
    align: 'center',
    dataIndex: nameof<WatchlistResponse>('ticker'),
    width: 150,
    sorter: (a, b) => a.ticker.localeCompare(b.ticker),
    render: (value, record) => <Link href={`/security/${record.securityId}`} className="ant-typograph">{value}</Link>,
    defaultSortOrder: 'ascend',
  },
  {
    title: 'Name',
    dataIndex: nameof<WatchlistResponse>('name'),
    sorter: (a, b) => a.name.localeCompare(b.name),
  },
  {
    title: 'Latest',
    align: 'right',
    width: 200,
    dataIndex: nameof<WatchlistResponse>('lastPrice'),
    sorter: (a, b) => (a.lastPrice && b.lastPrice ? a.lastPrice - b.lastPrice : 0),
    render: (value) => (value ? Math.round((value + Number.EPSILON) * 100) / 100 : ''),
  },
  {
    title: 'Δ %',
    align: 'right',
    width: 200,
    dataIndex: nameof<WatchlistResponse>('dailyChangePercentage'),
    sorter: (a, b) =>
      a.dailyChangePercentage && b.dailyChangePercentage ? a.dailyChangePercentage - b.dailyChangePercentage : 0,
    render: (value) => <Text type={value > 0 ? 'success' : 'danger'}>{value ? (value * 100).toPrecision(2) + '%' : ''}</Text>,
  },
  {
    title: 'Δ amount',
    align: 'right',
    width: 200,
    dataIndex: nameof<WatchlistResponse>('dailyChange'),
    sorter: (a, b) => (a.dailyChange && b.dailyChange ? a.dailyChange - b.dailyChange : 0),
    render: (value) => (
      <Text type={value > 0 ? 'success' : 'danger'}>
        {value ? Math.round((value + Number.EPSILON) * 100) / 100 : ''}
      </Text>
    ),
  },
  {
    title: 'Price Date',
    width: 150,
    dataIndex: nameof<WatchlistResponse>('lastPriceUpdatedAt'),
    render: (value) => dayjs(value).utc().format('MMM D, YYYY'),
  },
  {
    title: 'Updated',
    width: 200,
    dataIndex: nameof<WatchlistResponse>('updatedAt'),
    render: (value) => dayjs(value).format('MMM D, YYYY HH:mm'),
  },
  {
    title: 'Action',
    key: 'actions',
    align: 'center',
    width: 100,
    render: (_, record) => <RowActions watchlist={record} refresh={refresh} />,
  },
];

export default columns;
