// lib/plaidClient.ts
import { Configuration, PlaidApi, PlaidEnvironments, Products, CountryCode } from "plaid";

const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;
const PLAID_ENV = process.env.PLAID_ENV || "sandbox";

export const PLAID_PRODUCTS = (process.env.PLAID_PRODUCTS || Products.Transactions)
  .split(",")
  .map((p) => p.trim() as Products); // Ensure it’s typed as Products[]



export const PLAID_COUNTRY_CODES: CountryCode[] = (process.env.PLAID_COUNTRY_CODES || 'US')
  .split(',')
  .map((code) => code.trim() as CountryCode);

const configuration = new Configuration({
  basePath: PlaidEnvironments[PLAID_ENV],
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": PLAID_CLIENT_ID,
      "PLAID-SECRET": PLAID_SECRET,
      "Plaid-Version": "2020-09-14",
    },
  },
});

export const plaidClient = new PlaidApi(configuration);

export let ACCESS_TOKEN: string | null = 'access-sandbox-c394079a-c425-4577-baa7-a94ab3995c22';
export let ITEM_ID: string | null = 'nK3g33AmpPtJwxqJPEVeulV5Kgj199F6gaMWd';

export function setAccessToken(token: string | null) {
  ACCESS_TOKEN = token;
}

export function setItemId(id: string | null) {
  ITEM_ID = id;
}
