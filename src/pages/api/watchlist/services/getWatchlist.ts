import { NextApiResponse } from 'next';
import { WatchlistResponse } from '../../../../interfaces/watchlist';
import prisma from '../../../../lib/prisma';

export default async function getWatchlist(res: NextApiResponse<WatchlistResponse[]>) {
  const securities = await prisma.watchList.findMany({
    where: { userId: 'nacho' },
    select: {
      id: true,
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
      <WatchlistResponse>{
        id: w.id,
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
