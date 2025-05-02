import { NextApiRequest, NextApiResponse } from 'next';
import { plaidClient, ACCESS_TOKEN } from '../../lib/plaidClient';
import { PlaidApi } from 'plaid';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!ACCESS_TOKEN) {
    return res.status(400).json({ error: 'Access token is not set' });
  }

  try {
    const daysRequested = 10;
    const options = {
      client_report_id: 'Custom Report ID #123',
      user: {
        client_user_id: 'Custom User ID #456',
        first_name: 'Alice',
        middle_name: 'Bobcat',
        last_name: 'Cranberry',
        ssn: '123-45-6789',
        phone_number: '555-123-4567',
        email: 'alice@example.com',
      },
    };
    const configs = {
      access_tokens: [ACCESS_TOKEN],
      days_requested: daysRequested,
      options,
    };

    const assetReportCreateResponse = await plaidClient.assetReportCreate(configs);
    const assetReportToken = assetReportCreateResponse.data.asset_report_token;
    const getResponse = await getAssetReportWithRetries(plaidClient, assetReportToken);
    const pdfRequest = {
      asset_report_token: assetReportToken,
    };

    const pdfResponse = await plaidClient.assetReportPdfGet(pdfRequest, {
      responseType: 'arraybuffer',
    });

    res.json({
      json: getResponse.data.report,
      pdf: pdfResponse.data.toString('base64'),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

async function getAssetReportWithRetries(client: PlaidApi, assetReportToken: string) {
  // Implement retry logic here
  // This is a placeholder function
  return await client.assetReportGet({ asset_report_token: assetReportToken });
}
