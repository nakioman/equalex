import { NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function deleteMoneyTransaction(id: string | undefined, userId: string, res: NextApiResponse) {
  if (!id) return res.status(400).end();

  const deleteTransaction = await prisma.moneyTransaction.deleteMany({
    where: {
      AND: [{ id: id }, { userId: userId }],
    },
  });

  if (deleteTransaction) return res.status(200).end();
  return res.status(404).end();
}
