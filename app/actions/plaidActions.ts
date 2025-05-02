"use server";

import { Configuration, PlaidApi, PlaidEnvironments, CountryCode, Products } from "plaid";
import moment from "moment";

// Load environment variables
const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;
const PLAID_ENV = process.env.PLAID_ENV || "sandbox";
const PLAID_PRODUCTS = (process.env.PLAID_PRODUCTS || "transactions").split(",");
const PLAID_COUNTRY_CODES = (process.env.PLAID_COUNTRY_CODES || "US").split(",") as CountryCode[];
const PLAID_REDIRECT_URI = process.env.PLAID_REDIRECT_URI || "";
const PLAID_ANDROID_PACKAGE_NAME = process.env.PLAID_ANDROID_PACKAGE_NAME || "";

// Initialize Plaid client
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

const client = new PlaidApi(configuration);

// Server Action to create a Link token
export async function createLinkToken() {
  try {
    interface LinkTokenCreateConfig {
      user: { client_user_id: string };
      client_name: string;
      products: Products[];
      country_codes: CountryCode[];
      language: string;
      redirect_uri?: string;
      android_package_name?: string;
      statements?: {
        start_date: string;
        end_date: string;
      };
    }

    const configs: LinkTokenCreateConfig = {
      user: {
        client_user_id: "user-id", // Replace with a dynamic user ID if needed
      },
      client_name: "Plaid Integrated",
      products: PLAID_PRODUCTS.map(product => product as Products),
      country_codes: PLAID_COUNTRY_CODES,
      language: "en",
    };

    if (PLAID_REDIRECT_URI !== "") {
      configs.redirect_uri = PLAID_REDIRECT_URI;
    }

    if (PLAID_ANDROID_PACKAGE_NAME !== "") {
      configs.android_package_name = PLAID_ANDROID_PACKAGE_NAME;
    }

    if (PLAID_PRODUCTS.includes("statements")) {
      const statementConfig = {
        end_date: moment().format("YYYY-MM-DD"),
        start_date: moment().subtract(30, "days").format("YYYY-MM-DD"),
      };
      configs.statements = statementConfig;
    }

    const createTokenResponse = await client.linkTokenCreate(configs);
    return createTokenResponse.data;
  } catch (error) {
    console.error("Error creating Link token:", error);
    throw new Error("Failed to create Link token");
  }
}
