import dayjs from 'dayjs';
import { NextApiResponse } from 'next';
import { SecurityTransactionRequest } from '../../../interfaces/security';
import prisma from '../../../lib/prisma';

export default async function saveMoneyTransaction(
  body: SecurityTransactionRequest,
  userId: string,
  res: NextApiResponse
) {
  const data = {
    userId: userId,
    openAt: dayjs(body.openAt).toDate(),
    quantity: body.quantity,
    type: body.type,
    buyPrice: body.buyPrice,
    closeAt: body.closeAt ? dayjs(body.closeAt).toDate() : null,
    closePrice: body.closePrice,
    description: body.description,
    account: {
      connect: {
        id: body.accountId,
      },
    },
    security: {
      connect: {
        id: body.securityId,
      },
    },
  };

  let save;
  if (body.id) {
    save = await prisma.securityTransaction.update({
      where: {
        id: body.id,
      },
      data,
    });
  } else {
    save = await prisma.securityTransaction.create({
      data,
    });
  }

  if (save) return res.status(201).end();
  else return res.status(500).end();
}
