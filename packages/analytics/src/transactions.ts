import type { StellarTransaction } from "@stellarscope/shared";

export interface TransactionSummary {
  total: number;
  successful: number;
  failed: number;
  byType: Record<string, number>;
  byDay: Record<string, number>;
  largestTransfers: StellarTransaction[];
}

export interface Pattern {
  type: "recurring_payment" | "large_transfer" | "new_account";
  description: string;
  transactions: string[];
}

export function summarizeTransactions(transactions: StellarTransaction[]): TransactionSummary {
  const byType: Record<string, number> = {};
  const byDay: Record<string, number> = {};

  let successful = 0;
  let failed = 0;

  for (const tx of transactions) {
    if (tx.successful) successful++;
    else failed++;

    const day = tx.createdAt.slice(0, 10);
    byDay[day] = (byDay[day] ?? 0) + 1;

    for (const opType of tx.operationTypes ?? []) {
      byType[opType] = (byType[opType] ?? 0) + 1;
    }
  }

  return {
    total: transactions.length,
    successful,
    failed,
    byType,
    byDay,
    largestTransfers: transactions.slice(0, 5),
  };
}

export function detectPatterns(transactions: StellarTransaction[]): Pattern[] {
  const patterns: Pattern[] = [];

  const byAccount: Record<string, string[]> = {};
  for (const tx of transactions) {
    byAccount[tx.sourceAccount] ??= [];
    byAccount[tx.sourceAccount].push(tx.hash);
  }

  for (const [account, hashes] of Object.entries(byAccount)) {
    if (hashes.length >= 3) {
      patterns.push({
        type: "recurring_payment",
        description: `Account ${account.slice(0, 8)}... has ${hashes.length} transactions in this period`,
        transactions: hashes,
      });
    }
  }

  return patterns;
}
