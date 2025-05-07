// app/api/transactions/route.ts
import { NextResponse } from "next/server";
import { plaidClient, ACCESS_TOKEN } from "../../lib/plaidClient";
import { Transaction, RemovedTransaction, TransactionsSyncResponse } from "plaid"; // Import Plaid types

export async function GET() {
  try {
    if (!ACCESS_TOKEN) {
      return NextResponse.json({ error: "Access token not found" }, { status: 401 });
    }

    let cursor: string = '';
    let added: Transaction[] = []; // Explicitly type as Transaction[]
    let modified: Transaction[] = []; // Explicitly type as Transaction[]
    let removed: RemovedTransaction[] = []; // Explicitly type as RemovedTransaction[]
    let hasMore: boolean = true;

    while (hasMore) {
      const request = {
        access_token: ACCESS_TOKEN,
        cursor: cursor,
      };
      const response = await plaidClient.transactionsSync(request);
      const data = response.data;

      cursor = data.next_cursor;
      if (cursor === "") {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        continue;
      }

      added = added.concat(data.added);
      modified = modified.concat(data.modified);
      removed = removed.concat(data.removed);
      hasMore = data.has_more;
    }

    const compareTxnsByDateAscending = (a: Transaction, b: Transaction): number => Number(a.date > b.date) - Number(a.date < b.date);
    const recently_added = [...added].sort(compareTxnsByDateAscending).slice(-8);
    return NextResponse.json({ latest_transactions: recently_added });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
  }
}
