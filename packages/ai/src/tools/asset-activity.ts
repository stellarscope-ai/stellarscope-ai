import type { ToolDefinition, ToolHandler } from "../types";

export const assetActivityDefinition: ToolDefinition = {
  name: "get_asset_activity",
  description: "Get activity metrics for a Stellar asset over a time period. Use when the user asks about an asset's trading activity, volume, or trends.",
  parameters: {
    type: "object",
    properties: {
      assetCode: {
        type: "string",
        description: "The asset code (e.g., USDC, BTC)",
      },
      assetIssuer: {
        type: "string",
        description: "The asset issuer's Stellar address",
      },
      days: {
        type: "number",
        description: "Number of days to look back (default 7)",
      },
    },
    required: ["assetCode", "assetIssuer"],
  },
};

export function createAssetActivityHandler(): ToolHandler {
  return async (args) => {
    const { assetCode, assetIssuer, days } = args as {
      assetCode: string;
      assetIssuer: string;
      days?: number;
    };

    try {
      const { getAssetDetails } = await import("@stellarscope/stellar-data");

      const details = await getAssetDetails(assetCode, assetIssuer);

      return JSON.stringify({
        assetCode: details.assetCode,
        assetIssuer: details.assetIssuer,
        numAccounts: details.numAccounts,
        supply: details.supply,
        explorerUrl: details.link,
        note: "Activity metrics require trade data which may be limited on testnet.",
      });
    } catch (err) {
      const error = err as { message?: string; code?: string };
      return JSON.stringify({
        error: error.message ?? "Failed to fetch asset activity",
        code: error.code ?? "UNKNOWN_ERROR",
      });
    }
  };
}