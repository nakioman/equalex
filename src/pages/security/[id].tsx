import { Alert, Card, Col, Radio, Row, Space, Table, Typography } from 'antd';
import { GetServerSidePropsContext, InferGetStaticPropsType } from 'next';
import { getToken } from 'next-auth/jwt';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { ReactElement, ReactNode, useEffect, useState } from 'react';
import EqualexTable from '../../common/components/EqualexTable';
import { SecurityChartTimeFrame, SecurityTransactionResponse } from '../../interfaces/security';
import DashboardLayout from '../../layout/dashboard';
import { moneyFormatter, nameof } from '../../lib/utils';
import { getSecurity } from '../../modules/security/api/getSecurity';
import { getSecurityTransactions } from '../../modules/security/api/getSecurityTransactions';
import SecurityChart from '../../modules/security/components/SecurityChart';
import SecurityChartColumns from '../../modules/security/components/SecurityChartColumns';
import SecurityPrices from '../../modules/security/components/SecurityPrices';
import { getSettings } from '../../modules/settings/api/getSettings';

type SecurityByIdPageProps = InferGetStaticPropsType<typeof getServerSideProps> & {
  parentPage: string;
};

export default function SecurityByIdPage({ security, timeframe, transactions }: SecurityByIdPageProps) {
  const [isUpdatingTimeframe, setIsUpdatingTimeframe] = useState<boolean>(false);
  const router = useRouter();
  const columns = SecurityChartColumns(() => {
    router.replace(router.asPath);
  });

  useEffect(() => {
    router.isReady && setIsUpdatingTimeframe(false);
  }, [router]);

  const updateTimeFrame = (value: SecurityChartTimeFrame) => {
    setIsUpdatingTimeframe(true);
    router.push(`/security/${security?.id}?timeframe=${value}`);
  };

  if (!security) return <Alert type="error" message="Missing security to show" />;
  return (
    <>
      <Card>
        <Row justify="end">
          <Radio.Group size="small" value={timeframe} onChange={(e) => updateTimeFrame(e.target.value)}>
            <Radio.Button value={SecurityChartTimeFrame.Month}>1M</Radio.Button>
            <Radio.Button value={SecurityChartTimeFrame.SixMonth}>6M</Radio.Button>
            <Radio.Button value={SecurityChartTimeFrame.YearToDate}>YTD</Radio.Button>
            <Radio.Button value={SecurityChartTimeFrame.Year}>1Y</Radio.Button>
            <Radio.Button value={SecurityChartTimeFrame.FiveYear}>5Y</Radio.Button>
            <Radio.Button value={SecurityChartTimeFrame.Max}>Max</Radio.Button>
          </Radio.Group>
        </Row>
        <Space direction="vertical" size="middle" />
        <SecurityPrices security={security} />
        <Space direction="vertical" size="middle" />
        <SecurityChart security={security} isUpdating={isUpdatingTimeframe} />
      </Card>
      <Row style={{ paddingTop: 10 }}>
        <Col span={24}>
          <EqualexTable
            columns={columns}
            title="Transactions"
            addLink={`/security/transaction/add?securityId=${security.id}`}
            dataSource={transactions}
            rowKey={nameof<SecurityTransactionResponse>('id')}
            expandable={{
              expandedRowRender: (record) => (
                <>
                  <p style={{ margin: 0 }}>Account: {record.moneyAccountName}</p>
                  {record.description && <p style={{ margin: 0 }}>Description: {record.description}</p>}
                </>
              ),
            }}
            summary={transactionsSummary}
          />
        </Col>
      </Row>
    </>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { id, timeframe } = ctx.query as ParsedUrlQuery;
  const token = await getToken(ctx);
  const userId = token?.sub as string;
  let actualTimeframe;

  if (timeframe) actualTimeframe = timeframe;
  else {
    const appSettings = await getSettings(userId);
    actualTimeframe = appSettings?.defaultTimeframe;
  }

  const transactions = await getSecurityTransactions(userId, id as string);
  const security = await getSecurity(id as string, actualTimeframe as SecurityChartTimeFrame);
  return {
    props: {
      security,
      timeframe: actualTimeframe,
      transactions,
    },
  };
};

SecurityByIdPage.getLayout = function getLayout(page: ReactElement<SecurityByIdPageProps>) {
  const { security, timeframe } = page.props;
  const breadcrumbTitle = (
    <Link className="ant-typograph" href={`/security/${security?.id}?timeframe=${timeframe}`}>
      {security?.ticker ?? 'Unknown'}
    </Link>
  );
  return (
    <DashboardLayout
      title={security?.name ?? 'Unknown security'}
      breadcrumbParent="/watchlist"
      breadcrumbTitle={breadcrumbTitle}
    >
      {page}
    </DashboardLayout>
  );
};

function transactionsSummary(pageData: readonly SecurityTransactionResponse[]): ReactNode {
  const totalInvested = pageData.map((s) => s.totalInvested).reduce((partialSum, a) => partialSum + a, 0);
  const totalGain = pageData.map((s) => s.gain).reduce((partialSum, a) => partialSum + a, 0);
  const totalGainPercent = totalGain / totalInvested;
  const { Text } = Typography;

  return (
    <Table.Summary.Row>
      <Table.Summary.Cell colSpan={8} index={0}>
        <Text strong>Summary</Text>
      </Table.Summary.Cell>
      <Table.Summary.Cell index={1} align="right">
        <Text strong>{moneyFormatter(totalInvested)}</Text>
      </Table.Summary.Cell>
      <Table.Summary.Cell index={2} align="right" />
      <Table.Summary.Cell index={3} align="right">
        <Text strong type={totalGain > 0 ? 'success' : 'danger'}>
          {moneyFormatter(totalGain)}
        </Text>
      </Table.Summary.Cell>
      <Table.Summary.Cell index={4} align="right">
        <Text strong type={totalGainPercent > 0 ? 'success' : 'danger'}>
          {(totalGainPercent * 100).toPrecision(2) + '%'}
        </Text>
      </Table.Summary.Cell>
      <Table.Summary.Cell index={5} align="right" />
    </Table.Summary.Row>
  );
}
