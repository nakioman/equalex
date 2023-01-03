import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import deleteWatchlist from '../../../modules/watchlist/api/deleteWatchlist';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = await getToken({ req });
  const userId = token?.sub as string;

  switch (req.method) {
    case 'DELETE':
      var id = req.query.id as string | undefined;
      return await deleteWatchlist(id, userId, res);
    default:
      return res.status(405).end();
  }
}
