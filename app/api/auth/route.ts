// app/api/auth/route.ts
import { NextResponse } from "next/server";
import { plaidClient, ACCESS_TOKEN } from "../../lib/plaidClient";

export async function GET() {
  try {
    if (!ACCESS_TOKEN) {
      return NextResponse.json({ error: "Access token is not set" }, { status: 400 });
    }

    const authResponse = await plaidClient.authGet({
      access_token: ACCESS_TOKEN,
    });

    return NextResponse.json(authResponse.data);
  } catch (error) {
    console.error("Error fetching auth data:", error);
    return NextResponse.json({ error: "Failed to fetch auth data" }, { status: 500 });
  }
}
