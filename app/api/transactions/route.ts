import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { plaidClient } from '../../lib/plaidClient';
import { PlaidApi } from 'plaid';
import { decrypt } from '@/lib/encryption';

interface Account {
  institution_name: string;
  encrypted_access_token: string;
  iv: string;
  tag: string;
}

interface ReducedTransaction {
  date: string;
  name: string;
  amount: number;
  primaryCategory: string;
  detailedCategory: string;
}

interface CategorySummary {
  primaryCategory: string;
  amount: number;
}

interface RequestBody {
  userId: string;
  userEmail: string;
  start_date: string;
  end_date: string;
}

// Function to fetch and aggregate transactions for all accounts
async function getAllTransactions(
  start_date: string,
  end_date: string,
  accounts: Account[],
  plaidClient: PlaidApi
): Promise<{ categorySummaries: CategorySummary[], rawTransactions: ReducedTransaction[], allNormalizedReducedTransactions: { primaryCategory: string, monthlyAmount: number }[] }> {
  // Map each account to a promise
  const allTransactionPromises = accounts.map(async (account) => {
    
    
    const decryptedAccessToken = decrypt({
      encryptedToken: account.encrypted_access_token,
      iv: account.iv,
      tag: account.tag,
    });

    
    const transactionsResponse = await plaidClient.transactionsGet({
      access_token: decryptedAccessToken,
      start_date: start_date,
      end_date: end_date
    });
    
    
    const accountsById = Object.fromEntries(
      transactionsResponse.data.accounts.map(account => [account.account_id, account])
    );
    
    // Reduce transactions for this account
    return transactionsResponse.data.transactions.map(transaction => {
      const account = accountsById[transaction.account_id];

      return {
        bank: transactionsResponse.data.item.institution_name + `   ${account.name} — ${account.subtype} ••••${account.mask}`,
        date: transaction.date,
        name: transaction.name,
        amount: transaction.amount,
        primaryCategory: transaction.personal_finance_category?.primary ?? 'UNCATEGORIZED',
        detailedCategory: transaction.personal_finance_category?.detailed ?? 'UNCATEGORIZED',
        //accountDetails: `${account.name} — ${account.subtype} ••••${account.mask}`
      };
    });
  });

  
  // Wait for all promises to resolve and flatten the arrays into one
  const allReducedTransactions = (await Promise.all(allTransactionPromises)).flat();
  //return allReducedTransactions;

  // // Aggregate amounts by detailedCategory
  // const categoryMap: { [key: string]: number } = {};

  // allReducedTransactions.forEach(transaction => {
  //   const category = transaction.detailedCategory;
  //   const amount = transaction.amount;

  //   if (!categoryMap[category]) {
  //     categoryMap[category] = 0;
  //   }
  //   categoryMap[category] += amount;
  // });

  const categoryMap: { [key: string]: number } = {};

  allReducedTransactions.forEach(transaction => {
    const category = transaction.detailedCategory;
    // Convert amount to number and ensure it's finite
    const amount = Number(transaction.amount) || 0;
    
    if (!categoryMap.hasOwnProperty(category)) {
      categoryMap[category] = 0;
    }
    categoryMap[category] += amount;
  });

  // For better precision, you could multiply by 100 and work with cents
  // Then divide by 100 when displaying  

  // Normalize to monthly values (30-day)
  const delta = Math.ceil((new Date(end_date).getTime() - new Date(start_date).getTime()) / (1000 * 60 * 60 * 24));
  const allNormalizedReducedTransactions = Object.entries(categoryMap).map(
    ([category, total]) => ({
      primaryCategory: category,
      monthlyAmount: +(total * 30 / delta).toFixed(2) // Normalize from delta days → 30 days
    })
  );  

  // Convert the map to an array of CategorySummary objects
  const categorySummaries: CategorySummary[] = Object.entries(categoryMap).map(([primaryCategory, amount]) => ({
    primaryCategory,
    amount
  }));

  return { 
    allNormalizedReducedTransactions,
    categorySummaries,
    rawTransactions: allReducedTransactions    
    };
}

// Define the API route
export async function POST(req: NextRequest) {
  try {
    
    const supabase = await createClient();
    
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }    

    // Check user's role in the user_roles table
    const { data: roleEntry, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('email', user.email)
      .maybeSingle();

    // if (roleError || !roleEntry || roleEntry.role !== 'admin') {
    //   return NextResponse.json({ message: 'Forbidden: Admins only' }, { status: 403 });
    // }    
    
    // Get data from request body
    const body: RequestBody = await req.json();
    const { userId, userEmail,start_date, end_date } = body;

    // Get all access_tokens from the account table for the user email
    const { data: accounts, error: dbError } = await supabase
      .from('accounts')
      .select('encrypted_access_token, institution_name, iv, tag')
      .eq('email', userEmail);

    if (dbError) {
      return NextResponse.json(
        { error: "Failed to fetch access tokens" },
        { status: 500 }
      );
    }
    
    
    // Fetch and aggregate transactions for all accounts
    const reducedTransactions = await getAllTransactions(start_date, end_date, accounts, plaidClient);    

    return NextResponse.json(
      { 
        success: "success",
        userId: userId,
        userEmail: userEmail,
        //accounts: accounts,
        accounts: [],
        transactions: reducedTransactions,        
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while fetching item data." },
      { status: 500 }
    );
  }
}