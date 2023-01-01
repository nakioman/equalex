import { Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { SecurityResponse } from "../../../interfaces/security";
import { nameof } from "../../../lib/utils";
import RowActions from "./RowActions";

const { Text } = Typography;

const columns = (refresh: () => void): ColumnsType<SecurityResponse> => [
  {
    title: 'Ticker',
    align: 'center',
    dataIndex: nameof<SecurityResponse>('ticker'),
    width: 150,
    sorter: (a, b) => a.ticker.localeCompare(b.ticker),
  },
  {
    title: 'Name',
    dataIndex: nameof<SecurityResponse>('name'),
    sorter: (a, b) => a.name.localeCompare(b.name),
  },
  {
    title: 'Latest',
    align: 'right',
    width: 200,
    dataIndex: nameof<SecurityResponse>('lastPrice'),
    sorter: (a, b) => (a.lastPrice && b.lastPrice ? a.lastPrice - b.lastPrice : 0),
  },
  {
    title: 'Δ %',
    align: 'right',
    width: 200,
    dataIndex: nameof<SecurityResponse>('dailyChangePercentage'),
    sorter: (a, b) =>
      a.dailyChangePercentage && b.dailyChangePercentage ? a.dailyChangePercentage - b.dailyChangePercentage : 0,
    render: (value) => (
      <Text type={value > 0 ? 'success' : 'danger'}>{(value * 100)?.toFixed(2)}</Text>
    ),
  },
  {
    title: 'Δ amount',
    align: 'right',
    width: 200,
    dataIndex: nameof<SecurityResponse>('dailyChange'),
    sorter: (a, b) => (a.dailyChange && b.dailyChange ? a.dailyChange - b.dailyChange : 0),
    render: (value) => <Text type={value > 0 ? 'success' : 'danger'}>{value}</Text>,
  },
  {
    title: 'Updated',
    width: 200,
    dataIndex: nameof<SecurityResponse>('updatedAt'),
    render: (value) => dayjs(value).format('MMM D, YYYY'),
  },
  {
    title: 'Action',
    key: 'actions',
    align: 'center',
    width: 100,
    render: (_, record) => <RowActions security={record} refresh={refresh} />,
  },
];

export default columns;
