import { Alert, Card, Radio, Row, Space } from "antd";
import { GetServerSidePropsContext, InferGetStaticPropsType } from "next";
import { getToken } from "next-auth/jwt";
import Link from 'next/link';
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { ReactElement, useEffect, useState } from "react";
import { SecurityChartTimeFrame } from "../../interfaces/security";
import DashboardLayout from "../../layout/dashboard";
import { getSecurity } from "../../modules/security/api/getSecurity";
import SecurityChart from "../../modules/security/components/SecurityChart";
import SecurityPrices from "../../modules/security/components/SecurityPrices";
import { getSettings } from "../../modules/settings/api/getSettings";

type SecurityByIdPageProps = InferGetStaticPropsType<typeof getServerSideProps> & {
  parentPage: string;
}

export default function SecurityByIdPage({ security, timeframe }: SecurityByIdPageProps) {
  const [isUpdatingTimeframe, setIsUpdatingTimeframe] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    router.isReady && setIsUpdatingTimeframe(false)
  }, [router]);

  const updateTimeFrame = (value: SecurityChartTimeFrame) => {
    setIsUpdatingTimeframe(true);
    router.push(`/security/${security?.id}?timeframe=${value}`)
  }

  if (!security) return <Alert type="error" message="Missing security to show" />
  return (
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
  )
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { id, timeframe } = ctx.query as ParsedUrlQuery;
  let actualTimeframe;

  if (timeframe) actualTimeframe = timeframe;
  else {
    const token = await getToken(ctx);
    const userId = token?.sub as string;
    const appSettings = await getSettings(userId);
    actualTimeframe = appSettings?.defaultTimeframe;
  }

  const security = await getSecurity(id as string, actualTimeframe as SecurityChartTimeFrame);
  return {
    props: {
      security,
      timeframe: actualTimeframe
    }
  }
}

SecurityByIdPage.getLayout = function getLayout(page: ReactElement<SecurityByIdPageProps>) {
  const { security, timeframe } = page.props;
  const breadcrumbTitle = <Link className="ant-typograph" href={`/security/${security?.id}?timeframe=${timeframe}`} >{security?.ticker ?? 'Unknown'}</Link>
  return <DashboardLayout title={security?.name ?? 'Unknown security'} breadcrumbParent="/watchlist" breadcrumbTitle={breadcrumbTitle} >{page}</DashboardLayout>;
};
