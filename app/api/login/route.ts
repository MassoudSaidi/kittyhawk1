import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Step 1: Sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      return NextResponse.json(
        { error: error?.message || "Invalid credentials" },
        { status: 401 }
      );
    }

    // Step 2: Check admin role
    const { data: roleEntry, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('email', email)
      .maybeSingle();

    if (roleError || !roleEntry || roleEntry.role !== 'admin') {
      // Immediately sign the user out to invalidate the session
      await supabase.auth.signOut();

      return NextResponse.json(
        { error: "Access denied: Admins only" },
        { status: 403 }
      );
    }

    // Step 3: Allow access
    return NextResponse.json({
      user: data.user,
      //session: data.session,
    });

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
