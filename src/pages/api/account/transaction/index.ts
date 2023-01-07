import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import saveMoneyTransaction from '../../../../modules/account/api/saveMoneyTransaction';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = await getToken({ req });
  const userId = token?.sub as string;

  switch (req.method) {
    case 'POST':
      return await saveMoneyTransaction(req.body, userId, res);
    default:
      return res.status(405).end();
  }
}
