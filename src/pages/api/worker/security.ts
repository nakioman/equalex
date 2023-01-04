import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import cleanSecurities from '../../../modules/worker/api/cleanSecurities';
import updateSecurities from '../../../modules/worker/api/updateSecurities';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const desiredToken = process.env.WORKER_API_KEY;
  const token = await getToken({ req });
  if (!token && req.headers['api-key'] !== desiredToken) return res.status(401).end();

  switch (req.method) {
    case 'DELETE':
      return await cleanSecurities(res);
    case 'PUT':
      const { ticker } = req.query;
      return await updateSecurities(res, ticker as string | undefined);
    default:
      res.status(405).end();
  }
}
