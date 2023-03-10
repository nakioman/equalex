import { Prisma } from '@prisma/client';
import { NextApiResponse } from 'next';
import { SecurityPriceData } from '../../../interfaces/security';
import { getLogger } from '../../../lib/logging';
import prisma from '../../../lib/prisma';
import SecuritySearchStrategyManager from '../../../services/securitySearchStrategy';

const logger = getLogger('PUT api/worker/security');

export default async function updateSecurities(res: NextApiResponse, ticker?: string) {
  logger.info('Starting updating securities...');
  const securities = await prisma.security.findMany({
    where: ticker ? { ticker: ticker } : {},
    select: {
      id: true,
      ticker: true,
      dailyHistoricalPricesUpdatedAt: true,
      searchEngine: true,
    },
  });

  logger.info(`Found ${securities.length} securities to update`);

  if (securities) {
    for (let i = 0; i < securities.length; i++) {
      try {
        const security = securities[i];
        logger.info(`Updating security ${security.ticker} from ${security.dailyHistoricalPricesUpdatedAt ?? 'ALL'}`);

        var prices = await new SecuritySearchStrategyManager(security.searchEngine).getDailyPrices(
          security.ticker,
          security.dailyHistoricalPricesUpdatedAt ?? undefined
        );

        if (prices && prices?.length > 0) {
          const oldPrices = deleteOldPrices(prices, security.id);
          const newPrices = addNewPrices(prices, security.id);

          const previousPrice = await getPreviousPrice(security.id, prices);
          const securityUpdate = updateSecurityPrices(security.id, prices, previousPrice);

          await prisma.$transaction([oldPrices, newPrices, securityUpdate]);
        } else {
          logger.info(prices ? prices[0] : `There is no data for ${security.ticker}`);
        }
      } catch (err) {
        logger.error(err, 'Error updating securities');
        return res.status(500).end();
      }
    }
  }

  logger.info('Finished updating securities.');
  return res.status(200).end();
}

async function getPreviousPrice(securityId: string, prices: SecurityPriceData[]) {
  let previousPrice: number;

  if (prices.length < 2) {
    const prevPriceData = await prisma.priceData.findFirst({
      where: { date: { lt: prices[0].date }, securityId: securityId },
      orderBy: { date: 'desc' },
      take: 1,
    });
    previousPrice = prevPriceData?.close.toNumber() as number;
  } else {
    previousPrice = prices[1].close;
  }

  return previousPrice;
}

function updateSecurityPrices(
  securityId: string,
  prices: SecurityPriceData[],
  previousPrice: number
): Prisma.PrismaPromise<any> {
  return prisma.security.update({
    where: { id: securityId },
    data: {
      dailyChange: previousPrice ? prices[0].close - previousPrice : null,
      dailyHistoricalPricesUpdatedAt: prices[0].date,
      lastPrice: prices[0].close,
    },
  });
}

function addNewPrices(prices: SecurityPriceData[], securityId: string): Prisma.PrismaPromise<any> {
  return prisma.priceData.createMany({
    data: prices.map(
      (price) =>
        <Prisma.PriceDataCreateManyInput>{
          close: price.close,
          date: price.date,
          high: price.high,
          low: price.low,
          open: price.open,
          securityId: securityId,
          volume: price.volume,
        }
    ),
  });
}

function deleteOldPrices(prices: SecurityPriceData[], securityId: string): Prisma.PrismaPromise<any> {
  return prisma.priceData.deleteMany({
    where: {
      OR: prices.map(
        (price) =>
          <Prisma.PriceDataWhereInput>{
            date: price.date,
            securityId: securityId,
          }
      ),
    },
  });
}
