// app/api/identity/route.ts
import { NextResponse } from "next/server";
import { plaidClient, ACCESS_TOKEN } from "../../lib/plaidClient";

export async function GET() {
  try {
    if (!ACCESS_TOKEN) {
      return NextResponse.json({ error: "Access token not found" }, { status: 401 });
    }

    const identityResponse = await plaidClient.identityGet({
      access_token: ACCESS_TOKEN,
    });
    return NextResponse.json({ identity: identityResponse.data.accounts });
  } catch (error) {
    console.error("Error fetching identity data:", error);
    return NextResponse.json({ error: "Failed to fetch identity data" }, { status: 500 });
  }
}
