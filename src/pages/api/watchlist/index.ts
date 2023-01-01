import { NextApiRequest, NextApiResponse } from 'next';
import getWatchlist from './services/getWatchlist';
import saveWatchlist from './services/saveWatchlist';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return await getWatchlist(res);
    case 'POST':
      return await saveWatchlist(req.body, res);
    default:
      return res.status(405).end();
  }
}
