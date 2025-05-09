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