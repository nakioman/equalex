import { NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function deleteMoneyTransaction(id: string | undefined, userId: string, res: NextApiResponse) {
  if (!id) return res.status(400).end();

  const money = await prisma.moneyTransaction.findUnique({
    where: {
      id,
    },
  });
  if (!money) return res.status(400).end();

  const deleteTransaction = prisma.moneyTransaction.deleteMany({
    where: {
      AND: [{ id: id }, { userId: userId }],
    },
  });

  const updateCash = prisma.$queryRaw`UPDATE "public"."MoneyAccount" SET "cashAvailable"= COALESCE("cashAvailable", 0)- ${money.amount} WHERE id=${money.accountId}`;

  const t = await prisma.$transaction([deleteTransaction, updateCash]);
  if (t) return res.status(200).end();
  return res.status(404).end();
}
