import dayjs from 'dayjs';
import { SecurityChartTimeFrame, SecurityPriceData, SecurityResponse } from '../../../interfaces/security';
import prisma from '../../../lib/prisma';

export async function getSecurity(id: string, timeFrame: SecurityChartTimeFrame): Promise<SecurityResponse | null> {
  const security = await prisma.security.findUnique({
    where: {
      id: id,
    },
  });

  if (!security) return null;

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
    lastPriceUpdatedAt: security?.dailyHistoricalPricesUpdatedAt,
  };

  return response;
}

function getStartDate(timeFrame: SecurityChartTimeFrame): Date | undefined {
  switch (timeFrame) {
    case SecurityChartTimeFrame.Month:
      return dayjs().subtract(1, 'month').toDate();
    case SecurityChartTimeFrame.SixMonth:
      return dayjs().subtract(6, 'month').toDate();
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
