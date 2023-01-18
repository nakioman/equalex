import { Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { SecurityTransactionResponse } from '../../../interfaces/security';
import { moneyFormatter, nameof } from '../../../lib/utils';
import SecurityTransactionRowActions from './SecurityTransactionRowActions';

dayjs.extend(utc);

const { Text } = Typography;

const columns = (refresh: () => void): ColumnsType<SecurityTransactionResponse> => [
  {
    title: 'Open Date',
    width: 125,
    dataIndex: nameof<SecurityTransactionResponse>('openAt'),
    render: (value) => dayjs(value).utc().format('MMM D, YYYY'),
    sorter: (a, b) => a.openAt.getTime() - b.openAt.getTime(),
  },
  {
    title: 'Buy Price',
    align: 'right',
    width: 125,
    dataIndex: nameof<SecurityTransactionResponse>('buyPrice'),
    sorter: (a, b) => a.buyPrice - b.buyPrice,
    render: (value) => (value ? Math.round((value + Number.EPSILON) * 100) / 100 : ''),
  },
  {
    title: 'Quantity',
    align: 'right',
    width: 75,
    dataIndex: nameof<SecurityTransactionResponse>('quantity'),
    sorter: (a, b) => a.quantity - b.quantity,
  },
  {
    title: 'Close Date',
    width: 125,
    dataIndex: nameof<SecurityTransactionResponse>('closeAt'),
    render: (value) => (value ? dayjs(value).utc().format('MMM D, YYYY') : '-'),
    sorter: (a, b) => (a.closeAt && b.closeAt ? a.closeAt.getTime() - b.closeAt.getTime() : 0),
  },
  {
    title: 'Close Price',
    align: 'right',
    width: 125,
    dataIndex: nameof<SecurityTransactionResponse>('closePrice'),
    sorter: (a, b) => a.buyPrice - b.buyPrice,
    render: (value, record) => (
      <Text type={value > record.buyPrice ? 'success' : 'danger'}>
        {value ? Math.round((value + Number.EPSILON) * 100) / 100 : '-'}
      </Text>
    ),
  },
  {
    title: 'Days Open',
    align: 'right',
    width: 125,
    dataIndex: nameof<SecurityTransactionResponse>('daysOpen'),
    sorter: (a, b) => (a.daysOpen && b.daysOpen ? a.daysOpen - b.daysOpen : 0),
  },
  {
    title: 'Actual Price',
    align: 'right',
    width: 125,
    dataIndex: nameof<SecurityTransactionResponse>('securityActualValue'),
    render: (value) => (value ? Math.round((value + Number.EPSILON) * 100) / 100 : '-'),
  },
  {
    title: 'Total Invested',
    align: 'right',
    width: 125,
    dataIndex: nameof<SecurityTransactionResponse>('totalInvested'),
    render: moneyFormatter,
  },
  {
    title: 'Total At Close',
    align: 'right',
    width: 125,
    dataIndex: nameof<SecurityTransactionResponse>('totalInvestmentClose'),
    render: (value, record) => (
      <Text type={value > record.totalInvested ? 'success' : 'danger'}>{moneyFormatter(value)}</Text>
    ),
  },
  {
    title: 'Δ amount',
    align: 'right',
    width: 100,
    dataIndex: nameof<SecurityTransactionResponse>('gain'),
    render: (value) => <Text type={value > 0 ? 'success' : 'danger'}>{moneyFormatter(value)}</Text>,
  },
  {
    title: 'Δ %',
    align: 'right',
    width: 100,
    dataIndex: nameof<SecurityTransactionResponse>('gainPercentage'),
    sorter: (a, b) => (a.gainPercentage && b.gainPercentage ? a.gainPercentage - b.gainPercentage : 0),
    render: (value) => (
      <Text type={value > 0 ? 'success' : 'danger'}>{value ? (value * 100).toPrecision(2) + '%' : ''}</Text>
    ),
  },
  {
    title: 'Action',
    key: 'actions',
    align: 'center',
    width: 125,
    render: (_, record) => <SecurityTransactionRowActions transaction={record} refresh={refresh} />,
  },
];

export default columns;
