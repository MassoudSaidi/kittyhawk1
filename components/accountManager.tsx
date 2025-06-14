"use client";

import { useState, useEffect, useContext, useCallback } from "react";
import { createClient } from "../utils/supabase/client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Context from "../app/Context"; // Adjust path if needed

interface Account {
    id: number;
    institution_name: string;
    account_details: string;
    item_id: string;    
    status: string;
}

export default function AccountManager() {
  const [isClient, setIsClient] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const { accountDataVersion } = useContext(Context);
  const supabase = createClient();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Effect 2: Fetch User ID (runs after mount)
  useEffect(() => {
    // Only run if already mounted on client
    if (!isClient) return;

    let isMounted = true;
    const fetchUser = async () => {
      console.log("AccountManager: Fetching user...");
      setLoadingUser(true); // Indicate user loading
      const { data: { user } , error } = await supabase.auth.getUser();
      if (isMounted) {
        if (error || !user) {
          console.error("Error fetching user:", error?.message);
          setUserId(null);
        } else {
          console.log("AccountManager: User ID obtained:", user.id);
          setUserId(user.id);
        }
        setLoadingUser(false); // Finish user loading
      }
    };

    fetchUser();

    return () => { isMounted = false; };
  }, [isClient, supabase]); // Depend on isClient to ensure it runs after mount

  // Callback: Fetch Account Data
  const fetchAccountData = useCallback(async () => {
    if (!userId) {
      console.log('AccountManager: Skipping account fetch, userId not available.');
      setAccounts([]); // Clear accounts if no user
      setLoadingAccounts(false); // Ensure account loading is false
      return;
    }

    console.log('AccountManager: Fetching account data for user:', userId);
    setLoadingAccounts(true); // Start loading accounts

    try {
      const { data, error } = await supabase
        .from("accounts")
        .select("id, institution_name, account_details, item_id, status")
        .eq("user_id", userId);

      if (error) {
        console.error("Error fetching accounts:", error.message);
        setAccounts([]);
      } else {
        console.log("AccountManager: Accounts fetched:", data);
        setAccounts(data ?? []);
      }
    } catch (e) {
        console.error("Unexpected error fetching accounts:", e);
        setAccounts([]);
    } finally {
      setLoadingAccounts(false); // Finish loading accounts
    }
  }, [supabase, userId]);

  // Effect 3: Fetch Accounts (runs after mount, when userId changes, or version changes)
  useEffect(() => {
    // Only run if already mounted on client
    if (!isClient) return;

    console.log("AccountManager: Account fetch effect triggered. userId:", userId, "accountDataVersion:", accountDataVersion);
    fetchAccountData();

  }, [userId, accountDataVersion, fetchAccountData, isClient]); // Depend on isClient


  const handleDisconnect = async (accountId: number) => {
    if (!userId) { /* ... guard ... */ return; }

    const account = accounts.find(a => a.id === accountId);
    const institutionName = account?.institution_name || 'this account';
  
    const confirmed = confirm(`Are you sure you want to disconnect the "${institutionName}" account?`);
    if (!confirmed) return;    
    //if (!confirm("Are you sure you want to delete this account?")) { return; }

    setLoadingAccounts(true); // Use account loading state for feedback

    try {
      const { error } = await supabase
        .from('accounts')
        .delete()
        .eq('id', accountId)
        .eq('user_id', userId);

      if (error) { /* ... error handling ... */ }
      else {
        setAccounts(currentAccounts => currentAccounts.filter(account => account.id !== accountId));
      }
    } catch (e) { /* ... error handling ... */ }
    finally { setLoadingAccounts(false); }
  };

  // --- Render Logic ---
  return (
    <>
      <div className="pt-8 pb-4 text-2xl font-bold text-center text-gray-900 dark:text-white">
        List of connected accounts.
      </div>
      <Table>
        <TableCaption>List of connected accounts.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Institution</TableHead>
            <TableHead className="text-left">Account Details</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Server-side and initial render */}
          {!isClient ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center h-24">
                Loading...
              </TableCell>
            </TableRow>
          ) : loadingUser || loadingAccounts ? (
            // Loading state after client-side hydration
            <TableRow>
              <TableCell colSpan={4} className="text-center h-24">
                Loading accounts...
              </TableCell>
            </TableRow>
          ) : accounts.length > 0 ? (
            // Render accounts if available
            accounts.map((account) => (
              <TableRow key={account.id}>
                <TableCell>{account.institution_name}</TableCell>
                <TableCell style={{ whiteSpace: 'pre-line' }}>{account.account_details}</TableCell>
                <TableCell className="text-right">
                  <Button variant="secondary" onClick={() => handleDisconnect(account.id)}>
                    Disconnect
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            // No accounts state
            <TableRow>
              <TableCell colSpan={4} className="text-center h-24">
                {userId ? 'No accounts connected' : 'Please sign in to view accounts'}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
