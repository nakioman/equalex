import dayjs from 'dayjs';
import { NextApiResponse } from 'next';
import { MoneyTransactionRequest } from '../../../interfaces/account';
import prisma from '../../../lib/prisma';

export default async function saveMoneyTransaction(
  body: MoneyTransactionRequest,
  userId: string,
  res: NextApiResponse
) {
  const add = await prisma.moneyTransaction.create({
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

  if (add) return res.status(201).end();
  else return res.status(500).end();
}
