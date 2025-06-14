"use client";

import { useState } from "react";
import { signUpAction } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormMessage, Message } from "@/components/form-message";
import Link from "next/link";


export function ValidatedSignupForm({ message }: { message: Message }) {
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showWarning, setShowWarning] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    if (!(firstName || middleName || lastName)) {
      e.preventDefault();
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }
  };

  return (
    <>
      <form
        className="flex flex-col min-w-64 max-w-md mx-auto px-4"
        action={signUpAction}
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-medium">Sign up</h1>
        <p className="text-sm text-foreground">
          Already have an account?{" "}
          <Link className="text-primary font-medium underline" href="/sign-in">
            Sign in
          </Link>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Left Column - Email/Password */}
          <div className="flex flex-col gap-2 [&>input]:mb-3">
            <Label htmlFor="email">Email</Label>
            <Input name="email" placeholder="you@example.com" required />
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              name="password"
              placeholder="Your password"
              minLength={6}
              required
            />
          </div>

          {/* Right Column - Name Fields */}
          <div className="flex flex-col gap-2 [&>input]:mb-3">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              name="firstName"
              placeholder="First name"
              onChange={(e) => setFirstName(e.target.value)}
            />
            <Label htmlFor="middleName">Middle Name</Label>
            <Input
              name="middleName"
              placeholder="Middle name"
              onChange={(e) => setMiddleName(e.target.value)}
            />
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              name="lastName"
              placeholder="Last name"
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>

        {/* Submit and message below */}
        <div className="mt-6">
          <SubmitButton formAction={signUpAction} pendingText="Signing up...">
            Sign up
          </SubmitButton>
          {showWarning && (
            <p className="text-sm text-red-500 mt-2">
              Please fill in at least one name field.
            </p>
          )}
          <FormMessage message={message} />
        </div>
      </form>
    </>

  );
}