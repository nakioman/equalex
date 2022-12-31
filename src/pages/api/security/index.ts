import { NextApiRequest, NextApiResponse } from 'next';
import { SecurityResponse } from '../../../interfaces/security';
import prisma from '../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SecurityResponse[] | undefined>
) {
  switch (req.method) {
    case 'GET':
      return await getSecurities(res);
    default:
      return res.status(405).end();
  }
}

async function getSecurities(res: NextApiResponse<SecurityResponse[]>) {
  const securities = await prisma.watchList.findMany({
    where: { userId: 'nacho' },
    select: {
      security: {
        select: {
          name: true,
          ticker: true,
          sector: true,
          type: true,
          lastPrice: true,
          dailyChange: true,
          updatedAt: true,
        },
      },
    },
  });

  var response = securities.map(
    (w) =>
      <SecurityResponse>{
        name: w.security.name,
        ticker: w.security.ticker,
        sector: w.security.sector,
        type: w.security.type,
        lastPrice: w.security.lastPrice?.toNumber(),
        dailyChange: w.security.dailyChange?.toNumber(),
        dailyChangePercentage:
          w.security.dailyChange && w.security.lastPrice
            ? w.security.dailyChange.dividedBy(w.security.lastPrice).toNumber()
            : null,
        updatedAt: w.security.updatedAt,
      }
  );

  return res.status(200).json(response);
}
