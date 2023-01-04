import dayjs from 'dayjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { SecurityChartTimeFrame, SecurityPriceData, SecurityResponse } from '../../../interfaces/security';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse<SecurityResponse | null>) {
  switch (req.method) {
    case 'GET':
      const { id, timeframe } = req.query;
      return await getSecurity(id as string, timeframe as SecurityChartTimeFrame, res);
    default:
      res.status(405).end();
  }
}

async function getSecurity(
  id: string,
  timeFrame: SecurityChartTimeFrame,
  res: NextApiResponse<SecurityResponse | null>
) {
  const security = await prisma.security.findUnique({
    where: {
      id: id,
    },
  });

  if (!security) return res.status(404).end();

  const startDate = getStartDate(timeFrame);
  const prices = await prisma.priceData.findMany({
    where: {
      securityId: id,
      date: {
        gte: startDate,
      },
    },
    orderBy: {
      date: 'asc',
    },
  });

  const response = <SecurityResponse>{
    name: security?.name,
    id: security?.id,
    searchEngine: security?.searchEngine,
    prices: prices.map(
      (price) =>
        <SecurityPriceData>{
          date: price.date,
          open: price.open.toNumber(),
          high: price.high.toNumber(),
          low: price.low.toNumber(),
          close: price.close.toNumber(),
          volume: Number(price.volume),
        }
    ),
    ticker: security?.ticker,
    dailyChange: security?.dailyChange?.toNumber(),
    lastPrice: security?.lastPrice?.toNumber(),
    sector: security?.sector,
    type: security?.type,
    dailyChangePercentage:
      security?.dailyChange && security?.lastPrice
        ? security.dailyChange.dividedBy(security.lastPrice).toNumber()
        : null,
  };

  return res.status(200).json(response);
}

function getStartDate(timeFrame: SecurityChartTimeFrame): Date | undefined {
  switch (timeFrame) {
    case SecurityChartTimeFrame.Month:
      return dayjs().subtract(1, 'month').toDate();
    case SecurityChartTimeFrame.SixMonth:
      return dayjs().subtract(1, 'month').toDate();
    case SecurityChartTimeFrame.YearToDate:
      return dayjs().startOf('year').toDate();
    case SecurityChartTimeFrame.Year:
      return dayjs().subtract(1, 'year').toDate();
    case SecurityChartTimeFrame.FiveYear:
      return dayjs().subtract(5, 'year').toDate();
    default:
      return undefined;
  }
}
