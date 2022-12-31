import { Prisma } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  SecurityResponse,
  WatchlistRequest,
} from '../../../interfaces/security';
import prisma from '../../../lib/prisma';
import SecurityTypeSearch from '../../../services/securityType';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'POST':
      return await saveWatchlist(req.body, res);
    default:
      return res.status(405).end();
  }
}

async function saveWatchlist(body: WatchlistRequest, res: NextApiResponse) {
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

async function createSecurity(
  body: WatchlistRequest
): Promise<Prisma.SecurityCreateWithoutWatchListInput> {
  const security = (await new SecurityTypeSearch(body.type).search(
    body.ticker
  )) as SecurityResponse;

  return {
    ticker: security.ticker,
    name: security.name,
    sector: body.sector,
    type: body.type,
  };
}
