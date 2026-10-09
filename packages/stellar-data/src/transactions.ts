import type { StellarTransaction } from "@stellarscope/shared";
import { getDefaultClient } from "./client";
import { validateStellarAddress, validatePaginationLimit } from "./validation";
import { HorizonApiError } from "./errors";

export interface TransactionOptions {
  limit?: number;
  order?: "asc" | "desc";
  cursor?: string;
}

export interface TransactionPage {
  records: StellarTransaction[];
  nextCursor?: string;
}

export async function getTransactionHistory(
  accountId: string,
  options?: TransactionOptions
): Promise<TransactionPage> {
  validateStellarAddress(accountId);
  if (options?.limit !== undefined) {
    validatePaginationLimit(options.limit);
  }

  const server = getDefaultClient();

  try {
    let builder = server.transactions().forAccount(accountId);

    if (options?.order) {
      builder = builder.order(options.order);
    }
    if (options?.limit) {
      builder = builder.limit(options.limit);
    }
    if (options?.cursor) {
      builder = builder.cursor(options.cursor);
    }

    const page = await builder.call();
    const records = page.records as unknown as Record<string, unknown>[];

    return {
      records: records.map(mapTransaction),
      nextCursor: records.length > 0 ? (records[records.length - 1].paging_token as string) : undefined,
    };
  } catch (err: unknown) {
    const error = err as { response?: { status?: number }; message?: string };
    throw new HorizonApiError(
      `Failed to fetch transactions: ${error.message ?? "unknown error"}`,
      error.response?.status
    );
  }
}

export async function getTransactionDetails(txHash: string): Promise<StellarTransaction> {
  if (!txHash || txHash.length !== 64) {
    throw new Error(`Invalid transaction hash: ${txHash}`);
  }

  const server = getDefaultClient();

  try {
    const tx = (await server.transactions().transaction(txHash).call()) as unknown as Record<string, unknown>;
    return mapTransaction(tx);
  } catch (err: unknown) {
    const error = err as { response?: { status?: number }; message?: string };
    throw new HorizonApiError(
      `Failed to fetch transaction: ${error.message ?? "unknown error"}`,
      error.response?.status
    );
  }
}

function mapTransaction(tx: Record<string, unknown>): StellarTransaction {
  return {
    id: tx.id as string,
    hash: tx.hash as string,
    ledger: typeof tx.ledger === "number" ? tx.ledger : parseInt(tx.ledger as string, 10),
    createdAt: tx.created_at as string,
    sourceAccount: tx.source_account as string,
    fee: tx.fee_charged as string,
    memoType: (tx.memo_type as string) ?? undefined,
    memo: (tx.memo as string) ?? undefined,
    operationCount: tx.operation_count as number,
    successful: tx.successful as boolean,
    explorerUrl: `https://stellar.expert/explorer/public/tx/${tx.hash}`,
  };
}
