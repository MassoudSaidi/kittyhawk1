"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/client"; // Make sure you have a client-side Supabase client
import { User } from "@supabase/supabase-js";

export default function ClientAuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasEnvVars, setHasEnvVars] = useState(true); // Assume environment vars exist by default

  useEffect(() => {
    const supabase = createClient();
    
    // Check if we have a Supabase instance (can't directly check env vars client-side)
    if (!supabase) {
      setHasEnvVars(false);
      setLoading(false);
      return;
    }

    // Get the current user
    const getUser = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        setUser(data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null);

        // Handle navigation on sign out
        if (event === 'SIGNED_OUT') {
          window.location.href = '/';
        }        
      }
    );

    // Clean up the subscription
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Show loading state
  if (loading) {
    return <div className="flex items-center gap-2">Loading...</div>;
  }

  // Show environment variable warning
  if (!hasEnvVars) {
    return (
      <div className="flex gap-4 items-center">
        <div>
          <Badge
            variant={"default"}
            className="font-normal pointer-events-none"
          >
            Please update .env.local file with anon key and url
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button
            asChild
            size="sm"
            variant={"outline"}
            disabled
            className="opacity-75 cursor-none pointer-events-none"
          >
            <Link href="/sign-in">Sign in</Link>
          </Button>
          <Button
            asChild
            size="sm"
            variant={"default"}
            disabled
            className="opacity-75 cursor-none pointer-events-none"
          >
            <Link href="/sign-up">Sign up</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Show signed-in state
  if (user) {
    return (
      <div className="flex items-center gap-4">
        Hey, {user.email}!
        <Button 
          variant={"outline"} 
          onClick={async () => {
            const supabase = createClient();
            await supabase.auth.signOut();
            // Navigation will be handled by the auth state change listener
          }}
        >
          Sign out
        </Button>
      </div>
    );
  }

  // Show signed-out state
  return (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/sign-in">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}