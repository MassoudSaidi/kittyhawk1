"use client";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { SupabaseClient } from "@supabase/supabase-js";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
//import Script from "next/script";

export default function DialogLogin() {
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Dynamically load Office.js if not already loaded
    const loadOfficeJs = () => {
      if (typeof Office === "undefined") {
        const script = document.createElement("script");
        script.src = "https://appsforoffice.microsoft.com/lib/1/hosted/office.js";
        script.onload = () => {
          console.log("Office.js loaded");
        };
        document.head.appendChild(script);
      } else {
        console.log("Office.js already available");
      }
    };

    loadOfficeJs();
  }, []);

  // Initialize Supabase client
  // useEffect(() => {
  //   console.log("office script loaded");
  //   const client = createClientComponentClient();
  //   setSupabase(client);
  // }, []);

  // Check for existing session when Office is ready
  const handleOfficeReady = () => {
    // if (!supabase || typeof Office === "undefined") return;
    
    // supabase.auth.getSession().then(({ data }) => {
    //   if (data.session && Office.context?.ui?.messageParent) {
    //     Office.context.ui.messageParent(
    //       JSON.stringify({ type: "auth-success", token: data.session.access_token })
    //     );
    //   }
    // });
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //if (!supabase) return;
    //if (typeof Office === "undefined") return;
    
    setIsLoading(true);
    setError(null);

    console.log("office script loaded");
    
    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      // Office.context.ui.messageParent(
      //   JSON.stringify({ type: "auth-success", token: "data.session.access_token" })
      // );      

      // const client = createClientComponentClient();
      // setSupabase(client);


      // const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      // if (error) {
      //   setError(error.message);
      //   return;
      // }

      // if (data?.session && Office.context?.ui?.messageParent) {
      //   Office.context.ui.messageParent(
      //     JSON.stringify({ type: "auth-success", token: data.session.access_token })
      //   );
      // }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="w-full h-full overflow-y-auto px-4 py-6">
        <form
          className="flex flex-col max-w-xs mx-auto"
          onSubmit={handleSignIn}
        >
          <h1 className="text-xl font-semibold mb-2">Sign in</h1>

          <div className="flex flex-col gap-2 mt-4">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" placeholder="you@example.com" required />

            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              name="password"
              placeholder="Your password"
              required
            />

            <button 
              type="submit" 
              className="bg-primary text-primary-foreground px-4 py-2 rounded"
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign in"}
            </button>

            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        </form>
      </div>
    </>
  );
}