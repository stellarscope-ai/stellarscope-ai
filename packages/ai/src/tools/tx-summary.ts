import type { ToolDefinition, ToolHandler } from "../types";

export const txSummaryDefinition: ToolDefinition = {
  name: "get_recent_transactions",
  description: "Fetch and summarize recent transactions for a Stellar account. Use when the user asks about transaction history or recent activity.",
  parameters: {
    type: "object",
    properties: {
      accountId: {
        type: "string",
        description: "The Stellar account address",
      },
      limit: {
        type: "number",
        description: "Number of transactions to fetch (default 10, max 50)",
      },
    },
    required: ["accountId"],
  },
};

export function createTxSummaryHandler(): ToolHandler {
  return async (args) => {
    const { accountId, limit } = args as { accountId: string; limit?: number };

    try {
      const { getTransactionHistory } = await import("@stellarscope/stellar-data");
      const { summarizeTransactions } = await import("@stellarscope/analytics");

      const result = await getTransactionHistory(accountId, {
        limit: Math.min(limit ?? 10, 50),
        order: "desc",
      });

      const summary = summarizeTransactions(result.records);

      return JSON.stringify({
        accountId,
        totalTransactions: summary.totalTransactions,
        successfulRate: summary.successfulRate,
        timeRange: summary.timeRange,
        dailyBreakdown: summary.dailyBreakdown,
        topAccounts: summary.topAccounts.slice(0, 5),
        recentTransactions: result.records.slice(0, 5).map((tx: { hash: string; createdAt: string; successful: boolean; operationCount: number; explorerUrl: string }) => ({
          hash: tx.hash,
          createdAt: tx.createdAt,
          successful: tx.successful,
          operationCount: tx.operationCount,
          explorerUrl: tx.explorerUrl,
        })),
      });
    } catch (err) {
      const error = err as { message?: string; code?: string };
      return JSON.stringify({
        error: error.message ?? "Failed to fetch transactions",
        code: error.code ?? "UNKNOWN_ERROR",
      });
    }
  };
}