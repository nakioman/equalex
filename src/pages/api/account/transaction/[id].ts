import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import deleteMoneyTransaction from '../../../../modules/account/api/deleteMoneyTransaction';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = await getToken({ req });
  const userId = token?.sub as string;

  switch (req.method) {
    case 'DELETE':
      var id = req.query.id as string | undefined;
      return await deleteMoneyTransaction(id, userId, res);
    default:
      return res.status(405).end();
  }
}
