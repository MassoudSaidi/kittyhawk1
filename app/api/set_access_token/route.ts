import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server"; 
import { plaidClient } from "../../lib/plaidClient";
import { encrypt } from '@/lib/encryption';

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
    const userEmail = user.email;

    // Extract public token from the request body
    const body = await request.text();
    const params = new URLSearchParams(body);
    const public_token = params.get("public_token");

    if (!public_token) {
      return NextResponse.json(
        { error: "Missing public_token" },
        { status: 400 }
      );
    }

    // Exchange public token for access token
    const tokenResponse = await plaidClient.itemPublicTokenExchange({
      public_token,
    });

    const accessToken = tokenResponse.data.access_token;
    const itemId = tokenResponse.data.item_id;

    //console.log("Token Exchange Data:", JSON.stringify(tokenResponse.data, null, 2));

    // // Fetch institution details
    const itemResponse = await plaidClient.itemGet({
      access_token: accessToken,            
    });

    const institutionName = itemResponse.data.item?.institution_name || "Unknown Institution";

    // ecrypted access token
    const { encryptedToken, iv, tag } = encrypt(accessToken);

    // Insert into Supabase accounts table
    const { error: insertError } = await supabase
      .from("accounts")
      .insert([
        {
          email: userEmail, // Store user email
          user_id: user.id, // Store authenticated user ID
          item_id: itemId,
          //access_token: accessToken,
          encrypted_access_token: encryptedToken,
          iv: iv,
          tag: tag,
          institution_name: institutionName, // Store institution name
          status: "active",
        },
      ]);

    if (insertError) {
      console.error("Error inserting into accounts:", insertError.message);
      return NextResponse.json(
        { error: "Failed to store account data" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      //access_token: accessToken,
      access_token: "set",
      item_id: itemId,
      institution_name: institutionName,
      user_email: userEmail,
      message: "Account added successfully",
    });
  } catch (error) {
    console.error("Error exchanging public token:", error);
    return NextResponse.json(
      { error: "Failed to exchange public token" },
      { status: 500 }
    );
  }
}
