import { NextApiRequest, NextApiResponse } from 'next';
import deleteWatchlist from '../../../modules/watchlist/api/deleteWatchlist';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'DELETE':
      return await deleteWatchlist(req.query.id as string | undefined, res);
    default:
      return res.status(405).end();
  }
}
