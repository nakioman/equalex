import { Prisma } from '@prisma/client';
import { NextApiResponse } from 'next';
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
          const deleteOldPrices = prisma.priceData.deleteMany({
            where: {
              OR: prices.map(
                (price) =>
                  <Prisma.PriceDataWhereInput>{
                    date: price.date,
                    securityId: security.id,
                  }
              ),
            },
          });

          const pricesAdd = prisma.priceData.createMany({
            data: prices.map(
              (price) =>
                <Prisma.PriceDataCreateManyInput>{
                  close: price.close,
                  date: price.date,
                  high: price.high,
                  low: price.low,
                  open: price.open,
                  securityId: security.id,
                  volume: price.volume,
                }
            ),
          });

          const securityUpdate = prisma.security.update({
            where: { id: security.id },
            data: {
              dailyChange: prices.length > 2 ? prices[0].close - prices[1].close : null,
              dailyHistoricalPricesUpdatedAt: prices[0].date,
              lastPrice: prices[0].close,
            },
          });

          await prisma.$transaction([deleteOldPrices, pricesAdd, securityUpdate]);
        } else {
          logger.info(prices ? prices[0] : `No hay datos para ${security.ticker}`);
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
