import { NextApiRequest, NextApiResponse } from 'next';
import { SecurityResponse } from '../../../interfaces/security';
import SecuritySearchStrategyManager from '../../../services/securitySearchStrategy';

export default async function handler(req: NextApiRequest, res: NextApiResponse<SecurityResponse | null>) {
  switch (req.method) {
    case 'GET':
      return await getSecurity(req.query, res);
    default:
      res.status(405).end();
  }
}

async function getSecurity(
  query: Partial<{ [key: string]: string | string[] }>,
  res: NextApiResponse<SecurityResponse | null>
) {
  if (!query.type || !query.ticker) return res.status(400).end();

  const security = await new SecuritySearchStrategyManager(query.type as string).search(query.ticker as string);

  if (security) return res.status(200).json(security);

  return res.status(404).end();
}
