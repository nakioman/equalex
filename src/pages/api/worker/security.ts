import { NextApiRequest, NextApiResponse } from 'next';
import cleanSecurities from '../../../modules/worker/api/cleanSecurities';
import updateSecurities from '../../../modules/worker/api/updateSecurities';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const desiredToken = process.env.WORKER_API_KEY;
  if (req.headers['api-key'] !== desiredToken) return res.status(401).end();

  switch (req.method) {
    case 'DELETE':
      return await cleanSecurities(res);
    case 'PUT':
      return await updateSecurities(res);
    default:
      res.status(405).end();
  }
}
