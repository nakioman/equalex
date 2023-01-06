import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import saveAccount from '../../../modules/account/api/saveAccount';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = await getToken({ req });
  const userId = token?.sub as string;

  switch (req.method) {
    case 'POST':
      return await saveAccount(req.body, userId, res);
    default:
      return res.status(405).end();
  }
}
