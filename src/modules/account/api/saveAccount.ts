import { NextApiResponse } from 'next';
import { AccountRequest } from '../../../interfaces/account';
import prisma from '../../../lib/prisma';

export default async function saveAccount(body: AccountRequest, userId: string, res: NextApiResponse) {
  const add = await prisma.moneyAccount.create({
    data: {
      userId: userId,
      name: body.name,
      type: body.type,
    },
  });

  if (add) return res.status(201).end();
  else return res.status(500).end();
}
