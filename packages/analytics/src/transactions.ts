import type { StellarTransaction } from "@stellarscope/shared";

export interface DailyVolume {
  date: string;
  count: number;
  successful: number;
  failed: number;
}

export interface AccountActivity {
  account: string;
  transactionCount: number;
  firstSeen: string;
  lastSeen: string;
}

export interface TransferSummary {
  totalTransactions: number;
  successfulRate: number;
  dailyBreakdown: DailyVolume[];
  topAccounts: AccountActivity[];
  timeRange: { start: string; end: string } | null;
}

export function summarizeTransactions(transactions: StellarTransaction[]): TransferSummary {
  if (transactions.length === 0) {
    return {
      totalTransactions: 0,
      successfulRate: 0,
      dailyBreakdown: [],
      topAccounts: [],
      timeRange: null,
    };
  }

  const dailyMap: Record<string, { count: number; successful: number; failed: number }> = {};
  const accountMap: Record<string, { count: number; first: string; last: string }> = {};

  let successful = 0;

  for (const tx of transactions) {
    if (tx.successful) successful++;

    const day = tx.createdAt.slice(0, 10);
    if (!dailyMap[day]) dailyMap[day] = { count: 0, successful: 0, failed: 0 };
    dailyMap[day].count++;
    if (tx.successful) dailyMap[day].successful++;
    else dailyMap[day].failed++;

    const acct = tx.sourceAccount;
    if (!accountMap[acct]) accountMap[acct] = { count: 0, first: tx.createdAt, last: tx.createdAt };
    accountMap[acct].count++;
    if (tx.createdAt < accountMap[acct].first) accountMap[acct].first = tx.createdAt;
    if (tx.createdAt > accountMap[acct].last) accountMap[acct].last = tx.createdAt;
  }

  const dailyBreakdown = Object.entries(dailyMap)
    .map(([date, data]) => ({ date, ...data }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const topAccounts = Object.entries(accountMap)
    .map(([account, data]) => ({
      account,
      transactionCount: data.count,
      firstSeen: data.first,
      lastSeen: data.last,
    }))
    .sort((a, b) => b.transactionCount - a.transactionCount)
    .slice(0, 10);

  const sortedDates = dailyBreakdown.map((d) => d.date).sort();

  return {
    totalTransactions: transactions.length,
    successfulRate: transactions.length > 0 ? successful / transactions.length : 0,
    dailyBreakdown,
    topAccounts,
    timeRange: sortedDates.length > 0
      ? { start: sortedDates[0], end: sortedDates[sortedDates.length - 1] }
      : null,
  };
}

export function largestTransfers(transactions: StellarTransaction[], limit = 5): StellarTransaction[] {
  return [...transactions]
    .sort((a, b) => {
      const feeA = parseFloat(a.fee) || 0;
      const feeB = parseFloat(b.fee) || 0;
      return feeB - feeA;
    })
    .slice(0, limit);
}

export function transactionsByDay(transactions: StellarTransaction[]): Record<string, StellarTransaction[]> {
  const byDay: Record<string, StellarTransaction[]> = {};
  for (const tx of transactions) {
    const day = tx.createdAt.slice(0, 10);
    if (!byDay[day]) byDay[day] = [];
    byDay[day].push(tx);
  }
  return byDay;
}
