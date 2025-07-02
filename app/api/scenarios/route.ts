import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import supabaseAdmin from '@/utils/supabase/admin'
import { cookies } from "next/headers";

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { userEmail, data} = body;

    if (!userEmail) {
      return NextResponse.json(
        { error: "User Email required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {      
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    } 

    // Step 2: Check role
    console.log("Check role: " + user.email);
    const { data: roleEntry, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('email', user.email)
      .maybeSingle();
    
    
    const allowedRoles = ['admin', 'accountant', 'advisor'];

    if (roleError || !roleEntry || !allowedRoles.includes(roleEntry?.role)) {
      // Immediately sign the user out to invalidate the session
      //await supabase.auth.signOut();

      return NextResponse.json(
        { error: "Access denied: Insufficient permissions" },
        { status: 403 }
      );
    }

    // Step 3: Check if userEmail matches authenticated user's email
    if (!allowedRoles.includes(roleEntry?.role) && userEmail.toLowerCase() !== user.email?.toLowerCase()) {
      //await supabase.auth.signOut();
      return NextResponse.json(
        { error: "Access denied: Email mismatch" },
        { status: 403 }
      );
    }
    
    // Step 4: Upsert JSON value into scenarios table
    const upsertPayload = {
      email: userEmail,
      excel_range_data: data, // actual JSON
    };

    const { error: upsertError } = await supabaseAdmin
      .from('scenarios')
      .upsert(upsertPayload, { onConflict: 'email' }); // ensure user_id is unique or primary key

    if (upsertError) {
      return NextResponse.json(
        { error: "Failed to upsert scenario" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Scenarios saved" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userEmail} = body;

    if (!userEmail) {
      return NextResponse.json(
        { error: "User Email required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {      
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    } 

    // Step 2: Check role
    console.log("Check role: " + user.email);
    const { data: roleEntry, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('email', user.email)
      .maybeSingle();
    
    
    const allowedRoles = ['admin', 'accountant', 'advisor'];

    // if (roleError || !roleEntry || !allowedRoles.includes(roleEntry?.role)) {
    //   return NextResponse.json(
    //     { error: "Access denied: Insufficient permissions" },
    //     { status: 403 }
    //   );
    // }

    // Step 3: Check if userEmail matches authenticated user's email
    if (!allowedRoles.includes(roleEntry?.role) && userEmail.toLowerCase() !== user.email?.toLowerCase()) {
      return NextResponse.json(
        { error: "Access denied: Email mismatch" },
        { status: 403 }
      );
    }
    
    // Step 4: Upsert JSON value into scenarios table

    const { data: scenarioData, error: scenarioError } = await supabaseAdmin
      .from('scenarios')
      .select('excel_range_data')
      .eq('email', userEmail)
      .single();
      //.maybeSingle();      

    if (scenarioError) {
      return NextResponse.json(
        { error: "Scenario not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: scenarioData },
      { status: 200 }
    );

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}