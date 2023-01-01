import { Prisma } from '@prisma/client';
import { NextApiResponse } from 'next';
import { SecuritySearchResponse } from '../../../interfaces/security';
import { WatchlistRequest } from '../../../interfaces/watchlist';
import prisma from '../../../lib/prisma';
import SecuritySearchStrategyManager from '../../../services/securitySearchStrategy';

export default async function saveWatchlist(body: WatchlistRequest, res: NextApiResponse) {
  const exists = await prisma.watchList.findFirst({
    where: {
      AND: [
        {
          userId: 'nacho',
          security: {
            ticker: body.ticker,
          },
        },
      ],
    },
  });

  if (exists) return res.status(409).end();

  const created = await prisma.watchList.create({
    data: {
      userId: 'nacho',
      security: {
        connectOrCreate: {
          where: {
            ticker: body.ticker,
          },
          create: await createSecurity(body),
        },
      },
    },
  });

  if (created) return res.status(201).end();
  return res.status(500).end();
}

async function createSecurity(body: WatchlistRequest): Promise<Prisma.SecurityCreateWithoutWatchListInput> {
  const security = (await new SecuritySearchStrategyManager(body.type).search(body.ticker)) as SecuritySearchResponse;

  return {
    ticker: security.ticker,
    name: body.name,
    sector: body.sector,
    type: body.type,
  };
}
