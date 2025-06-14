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

    if (roleError) {
      return NextResponse.json(
        { error: "Failed to fetch user role" },
        { status: 500 }
      );
    }      

    // if (roleError || !roleEntry || roleEntry.role !== 'admin') {
    //   return NextResponse.json({ message: 'Forbidden: Admins only' }, { status: 403 });
    // }
    
    // If no role, return only the user's email
    if (!roleEntry) {
      return NextResponse.json({ emails: [{ email: user.email, id: user.id }] });
    }    

    // Handle based on role
    if (roleEntry.role === 'admin') {
      // For admins, fetch all unique emails
      const { data, error } = await supabase
        .from('accounts')
        .select('email, id, profiles(full_name)', { count: 'exact', head: false });

      if (error) {
        return NextResponse.json(
          { error: "Failed to fetch accounts" },
          { status: 500 }
        );
      }

      const uniqueEmails = Array.from(
        new Map(data.map(item => [item.email, item])).values()
      );

      return NextResponse.json({ emails: uniqueEmails });
    } else if (roleEntry.role === 'advisor' || roleEntry.role === 'accountant') {
      // For advisors/accountants, fetch users with this advisor or accountant email in their advisor/accountant field
      const { data, error } = await supabase
        .from('accounts')
        .select('email, id, profiles(full_name)')
        .or(`advisor.eq.${user.email},accountant.eq.${user.email},email.eq.${user.email}`);

      if (error) {
        return NextResponse.json(
          { error: "Failed to fetch advised users" },
          { status: 500 }
        );
      }

      const uniqueEmails = Array.from(
        new Map(data.map(item => [item.email, item])).values()
      );
      console.log(uniqueEmails);
      return NextResponse.json({ emails: uniqueEmails });
    } else {
      // For any other role, return only the user's email
      return NextResponse.json({ emails: [{ email: user.email, id: user.id, profiles: { full_name: 'Mass 222' } }] });
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}