import { NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function deleteWatchlist(id: string | undefined, userId: string, res: NextApiResponse) {
  if (!id) return res.status(400).end();

  const deleted = await prisma.watchList.deleteMany({
    where: {
      AND: [{ id: id }, { userId: userId }],
    },
  });

  if (deleted) return res.status(200).end();
  return res.status(404).end();
}
