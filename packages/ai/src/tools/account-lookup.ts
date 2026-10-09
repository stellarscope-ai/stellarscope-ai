import type { ToolDefinition, ToolHandler } from "../types";

export const accountLookupDefinition: ToolDefinition = {
  name: "get_account_summary",
  description: "Look up a Stellar account and return its balances and details.",
  parameters: {
    type: "object",
    properties: {
      accountId: {
        type: "string",
        description: "The Stellar account address (starts with G, 56 characters)",
      },
    },
    required: ["accountId"],
  },
};

export const accountLookupHandler: ToolHandler = async (args) => {
  const { accountId } = args as { accountId: string };
  // Will call @stellarscope/stellar-data in Phase 4
  return JSON.stringify({ error: "Not yet implemented", accountId });
};
