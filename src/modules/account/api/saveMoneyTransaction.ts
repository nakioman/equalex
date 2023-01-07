import dayjs from 'dayjs';
import { NextApiResponse } from 'next';
import { MoneyTransactionRequest } from '../../../interfaces/account';
import prisma from '../../../lib/prisma';

export default async function saveMoneyTransaction(
  body: MoneyTransactionRequest,
  userId: string,
  res: NextApiResponse
) {
  const add = prisma.moneyTransaction.create({
    data: {
      userId: userId,
      amount: body.amount,
      account: {
        connect: {
          id: body.accountId,
        },
      },
      createdAt: dayjs(body.createdAt).toDate(),
      description: body.description,
    },
  });

  const updateCash = prisma.$queryRaw`UPDATE "public"."MoneyAccount" SET "cashAvailable"= COALESCE("cashAvailable", 0)+ ${body.amount} WHERE id=${body.accountId}`;

  const t = await prisma.$transaction([add, updateCash]);

  if (t) return res.status(201).end();
  else return res.status(500).end();
}
