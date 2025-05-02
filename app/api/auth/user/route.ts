import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();    

    if (error) {
      return NextResponse.json(
        { 
          isLoggedIn: false,
          email: null 
        },
        { status: 200 }
      );
    }

    return NextResponse.json({
      isLoggedIn: !!user,
      email: user?.email || null
    });
    
  } catch (error) {
    console.error("Session error:", error);
    return NextResponse.json(
      { 
        isLoggedIn: false,
        email: null 
      },
      { status: 200 }
    );
  }
}