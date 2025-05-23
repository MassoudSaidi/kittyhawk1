import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    // Check if user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }

    // Check user's role in the user_roles table
    const { data: roleEntry, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('email', user.email)
      .maybeSingle();

    if (roleError || !roleEntry || roleEntry.role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden: Admins only' }, { status: 403 });
    }

    const { data, error } = await supabase
      .from('accounts')
      //.select('email, institution_name, access_token, id', { count: 'exact', head: false });
      .select('email, id', { count: 'exact', head: false });

      const uniqueEmails = data ? Array.from(
        new Map(data.map(item => [item.email, item])).values()
      ) : [];
      
    if (error) {
      //console.error("Error fetching distinct emails:", error.message);
      return NextResponse.json(
        { error: "Failed to fetch distinct emails" },
        { status: 500 }
      );
    }    
    
    // // --- Call the RPC function ---
    // const { data, error } = await supabase.rpc('get_distinct_account_emails'); // Call the function by its name

    // if (error) {
    //   console.error("Error calling get_distinct_account_emails RPC:", error.message);
    //   return NextResponse.json(
    //     // Provide a slightly more specific error if possible
    //     { error: `Failed to fetch distinct emails: ${error.message}` },
    //     { status: 500 }
    //   );
    // }    

    //return NextResponse.json({ emails: data });
    return NextResponse.json({ emails: uniqueEmails});
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}