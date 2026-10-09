import type { StellarTransaction } from "@stellarscope/shared";
import { getDefaultClient } from "./client";

interface TransactionOptions {
  limit?: number;
  order?: "asc" | "desc";
  cursor?: string;
}

interface TransactionPage {
  records: StellarTransaction[];
  nextCursor?: string;
}

export async function getTransactionHistory(
  accountId: string,
  options?: TransactionOptions
): Promise<TransactionPage> {
  const server = getDefaultClient();
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
}

export async function getTransactionDetails(txHash: string): Promise<StellarTransaction> {
  const server = getDefaultClient();
  const tx = (await server.transactions().transaction(txHash).call()) as unknown as Record<string, unknown>;
  return mapTransaction(tx);
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
