import { NextApiRequest, NextApiResponse } from 'next';
import { plaidClient, ACCESS_TOKEN } from '../../lib/plaidClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!ACCESS_TOKEN) {
    return res.status(400).json({ error: 'Access token is not set' });
  }

  try {
    const balanceResponse = await plaidClient.accountsBalanceGet({
      access_token: ACCESS_TOKEN,
    });
    res.status(200).json(balanceResponse.data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching balance' });
  }
}
