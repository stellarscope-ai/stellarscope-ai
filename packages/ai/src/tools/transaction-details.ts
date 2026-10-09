import type { ToolDefinition, ToolHandler } from "../types";

export const transactionDetailsDefinition: ToolDefinition = {
  name: "get_transaction_details",
  description: "Get detailed information about a specific Stellar transaction by its hash.",
  parameters: {
    type: "object",
    properties: {
      transactionHash: {
        type: "string",
        description: "The 64-character transaction hash",
      },
    },
    required: ["transactionHash"],
  },
};

export function createTransactionDetailsHandler(): ToolHandler {
  return async (args) => {
    const { transactionHash } = args as { transactionHash: string };

    try {
      const { getTransactionDetails } = await import("@stellarscope/stellar-data");
      const tx = await getTransactionDetails(transactionHash);

      return JSON.stringify({
        hash: tx.hash,
        ledger: tx.ledger,
        createdAt: tx.createdAt,
        sourceAccount: tx.sourceAccount,
        fee: tx.fee,
        memoType: tx.memoType,
        memo: tx.memo,
        operationCount: tx.operationCount,
        successful: tx.successful,
        explorerUrl: tx.explorerUrl,
      });
    } catch (err) {
      const error = err as { message?: string; code?: string };
      return JSON.stringify({
        error: error.message ?? "Failed to fetch transaction",
        code: error.code ?? "UNKNOWN_ERROR",
      });
    }
  };
}