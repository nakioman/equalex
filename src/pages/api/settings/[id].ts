import { NextApiRequest, NextApiResponse } from 'next';
import { saveSettings } from '../../../modules/settings/api/saveSettings';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'PUT':
      const { id } = req.query;
      await saveSettings(id as string, req.body);
      return res.status(200).end();
    default:
      res.status(405).end();
  }
}
