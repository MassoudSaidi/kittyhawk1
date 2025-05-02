import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  try {
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    // Define public routes that don't need authentication
    const publicRoutes = [
      '/api/login',
      '/api/create_link_token',
      '/api/auth/callback'
    ];

    // Check if the current route is an API route
    if (request.nextUrl.pathname.startsWith('/api/')) {
      // Allow public routes to pass through
      if (publicRoutes.includes(request.nextUrl.pathname)) {
        return response;
      }

      // For all other API routes, check authentication
      if (userError || !user) {
        return NextResponse.json(
          { error: "Unauthorized - Please sign in" },
          { status: 401 }
        );
      }
    }

    // Existing protected routes logic
    if (request.nextUrl.pathname.startsWith("/protected") && userError) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    if (request.nextUrl.pathname === "/" && !userError) {
      return NextResponse.redirect(new URL("/protected", request.url));
    }

    return response;
  } catch (e) {
    console.error("Middleware error:", e);
    // For API routes, return JSON error
    if (request.nextUrl.pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
    // For other routes, continue
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};

