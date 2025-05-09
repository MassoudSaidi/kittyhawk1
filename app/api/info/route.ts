// app/api/info/route.ts
import { NextResponse } from "next/server";
import { PLAID_PRODUCTS } from "../../lib/plaidClient";

type ResponseData = {
  item_id: string | null;
  access_token: string | null;
  products: string[];
};

export async function POST(request: Request) {
  return NextResponse.json({
    products: PLAID_PRODUCTS,
  });
}

// Optionally, handle other methods (e.g., GET) with an error
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}