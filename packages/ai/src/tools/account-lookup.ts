import type { ToolDefinition, ToolHandler } from "../types";

export const accountLookupDefinition: ToolDefinition = {
  name: "get_account_summary",
  description: "Look up a Stellar account and return its balances and details. Use this when the user asks about a specific account.",
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

export function createAccountLookupHandler(): ToolHandler {
  return async (args) => {
    const { accountId } = args as { accountId: string };

    try {
      const { getAccount } = await import("@stellarscope/stellar-data");
      const { summarizeBalances } = await import("@stellarscope/analytics");

      const account = await getAccount(accountId);
      const summary = summarizeBalances(account.balances);

      return JSON.stringify({
        accountId: account.accountId,
        nativeBalance: summary.nativeBalance,
        assetCount: summary.assetCount,
        assets: summary.assets,
        sequence: account.sequence,
        subentryCount: account.subentryCount,
        homeDomain: account.homeDomain,
        explorerUrl: `https://stellar.expert/explorer/public/account/${accountId}`,
      });
    } catch (err) {
      const error = err as { message?: string; code?: string };
      return JSON.stringify({
        error: error.message ?? "Failed to fetch account",
        code: error.code ?? "UNKNOWN_ERROR",
      });
    }
  };
}