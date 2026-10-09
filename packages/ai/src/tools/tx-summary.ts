import type { ToolDefinition, ToolHandler } from "../types";

export const txSummaryDefinition: ToolDefinition = {
  name: "get_recent_transactions",
  description: "Fetch and summarize recent transactions for a Stellar account.",
  parameters: {
    type: "object",
    properties: {
      accountId: {
        type: "string",
        description: "The Stellar account address",
      },
      limit: {
        type: "number",
        description: "Number of transactions to fetch (default 10)",
      },
    },
    required: ["accountId"],
  },
};

export const txSummaryHandler: ToolHandler = async (args) => {
  const { accountId, limit } = args as { accountId: string; limit?: number };
  // Will call @stellarscope/stellar-data in Phase 4
  return JSON.stringify({ error: "Not yet implemented", accountId, limit });
};
