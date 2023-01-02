import { NextApiResponse } from 'next';
import { getLogger } from '../../../lib/logging';
import prisma from '../../../lib/prisma';

const logger = getLogger('DELETE api/worker/security');

export default async function cleanSecurities(res: NextApiResponse) {
  logger.info('Starting cleaning unused securities...');
  const unUsedSecurities = await prisma.security.findMany({
    where: {
      WatchList: { none: {} },
    },
    select: {
      id: true,
      ticker: true,
    },
  });

  logger.info(`Found ${unUsedSecurities.length} securities to clean`);
  if (unUsedSecurities) {
    const tasks: Promise<any>[] = [];

    unUsedSecurities.forEach(async (security) => {
      logger.info(`Deleting security ${security.ticker}`);
      const task = prisma.security.delete({
        where: {
          id: security.id,
        },
      });
      tasks.push(task);
    });

    await Promise.all(tasks);
  }

  logger.info('Finished cleaning unused securities.');
  return res.status(200).end();
}
