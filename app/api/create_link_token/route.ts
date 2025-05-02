// app/api/create_link_token/route.ts
import { NextResponse } from "next/server";
import moment from "moment";
import { plaidClient, PLAID_PRODUCTS } from "../../lib/plaidClient";
import { LinkTokenCreateRequest, LinkTokenCreateResponse, Products, CountryCode } from "plaid";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  try {

    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    // Extract user email
    const userId = user.id;

    const configs: LinkTokenCreateRequest = {
      user: { client_user_id: userId }, // Required: Unique per user
      client_name: "Integrated Quickstart V1", // Required
      products: PLAID_PRODUCTS, // Required: Already typed as Products[] in plaidClient.ts
      country_codes: (process.env.PLAID_COUNTRY_CODES?.split(",").map((c) => c.trim() as CountryCode)) || [CountryCode.Us], // Required
      language: "en", // Required
      redirect_uri: process.env.PLAID_REDIRECT_URI || undefined, // Optional
      android_package_name: process.env.PLAID_ANDROID_PACKAGE_NAME || undefined, // Optional
    };

    // Add statements if "statements" is in products
    if (PLAID_PRODUCTS.includes(Products.Statements)) {
      configs.statements = {
        end_date: moment().format("YYYY-MM-DD"),
        start_date: moment().subtract(30, "days").format("YYYY-MM-DD"),
      };
    }

    const createTokenResponse = await plaidClient.linkTokenCreate(configs);
    return NextResponse.json({
      link_token: createTokenResponse.data.link_token,
      expiration: createTokenResponse.data.expiration,
      request_id: createTokenResponse.data.request_id,
    });
  } catch (error) {
    console.error("Error creating Link token:", error);
    return NextResponse.json({ error: "Failed to create Link token" }, { status: 500 });
  }
}