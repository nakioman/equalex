import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import getWatchlist from '../../../modules/watchlist/api/getWatchlist';
import saveWatchlist from '../../../modules/watchlist/api/saveWatchlist';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = await getToken({ req });
  const userId = token?.sub as string;

  switch (req.method) {
    case 'GET':
      return await getWatchlist(userId, res);
    case 'POST':
      return await saveWatchlist(req.body, userId, res);
    default:
      return res.status(405).end();
  }
}
