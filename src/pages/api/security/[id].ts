import { NextApiRequest, NextApiResponse } from 'next';
import { SecurityChartTimeFrame, SecurityResponse } from '../../../interfaces/security';
import { getSecurity } from '../../../modules/security/api/getSecurity';

export default async function handler(req: NextApiRequest, res: NextApiResponse<SecurityResponse | null>) {
  switch (req.method) {
    case 'GET':
      const { id, timeframe } = req.query;
      const security = await getSecurity(id as string, timeframe as SecurityChartTimeFrame);
      if (security) return res.status(200).json(security);
      return res.status(404).end();
    default:
      res.status(405).end();
  }
}
