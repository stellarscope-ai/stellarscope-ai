import { describe, it, expect } from "vitest";
import { summarizeTransactions, largestTransfers, transactionsByDay } from "../transactions";
import type { StellarTransaction } from "@stellarscope/shared";

function makeTx(overrides: Partial<StellarTransaction> = {}): StellarTransaction {
  return {
    id: "tx-1",
    hash: "abc123",
    ledger: 100,
    createdAt: "2024-01-15T10:00:00Z",
    sourceAccount: "GACCOUNT1",
    fee: "100",
    operationCount: 1,
    successful: true,
    explorerUrl: "https://stellar.expert/explorer/public/tx/abc123",
    ...overrides,
  };
}

describe("summarizeTransactions", () => {
  it("handles empty transactions", () => {
    const result = summarizeTransactions([]);
    expect(result.totalTransactions).toBe(0);
    expect(result.successfulRate).toBe(0);
    expect(result.dailyBreakdown).toHaveLength(0);
    expect(result.topAccounts).toHaveLength(0);
    expect(result.timeRange).toBeNull();
  });

  it("counts transactions and success rate", () => {
    const txs = [
      makeTx({ id: "1", hash: "h1", successful: true }),
      makeTx({ id: "2", hash: "h2", successful: true }),
      makeTx({ id: "3", hash: "h3", successful: false }),
    ];
    const result = summarizeTransactions(txs);
    expect(result.totalTransactions).toBe(3);
    expect(result.successfulRate).toBeCloseTo(2 / 3);
  });

  it("breaks down by day", () => {
    const txs = [
      makeTx({ id: "1", hash: "h1", createdAt: "2024-01-15T10:00:00Z" }),
      makeTx({ id: "2", hash: "h2", createdAt: "2024-01-15T11:00:00Z" }),
      makeTx({ id: "3", hash: "h3", createdAt: "2024-01-16T10:00:00Z" }),
    ];
    const result = summarizeTransactions(txs);
    expect(result.dailyBreakdown).toHaveLength(2);
    expect(result.dailyBreakdown[0].date).toBe("2024-01-15");
    expect(result.dailyBreakdown[0].count).toBe(2);
    expect(result.dailyBreakdown[1].date).toBe("2024-01-16");
    expect(result.dailyBreakdown[1].count).toBe(1);
  });

  it("tracks top accounts", () => {
    const txs = [
      makeTx({ id: "1", hash: "h1", sourceAccount: "GACCOUNT1" }),
      makeTx({ id: "2", hash: "h2", sourceAccount: "GACCOUNT1" }),
      makeTx({ id: "3", hash: "h3", sourceAccount: "GACCOUNT2" }),
    ];
    const result = summarizeTransactions(txs);
    expect(result.topAccounts).toHaveLength(2);
    expect(result.topAccounts[0].account).toBe("GACCOUNT1");
    expect(result.topAccounts[0].transactionCount).toBe(2);
    expect(result.topAccounts[1].account).toBe("GACCOUNT2");
    expect(result.topAccounts[1].transactionCount).toBe(1);
  });

  it("computes time range", () => {
    const txs = [
      makeTx({ id: "1", hash: "h1", createdAt: "2024-01-15T10:00:00Z" }),
      makeTx({ id: "2", hash: "h2", createdAt: "2024-01-20T10:00:00Z" }),
    ];
    const result = summarizeTransactions(txs);
    expect(result.timeRange).toEqual({ start: "2024-01-15", end: "2024-01-20" });
  });
});

describe("largestTransfers", () => {
  it("sorts by fee descending", () => {
    const txs = [
      makeTx({ id: "1", hash: "h1", fee: "100" }),
      makeTx({ id: "2", hash: "h2", fee: "500" }),
      makeTx({ id: "3", hash: "h3", fee: "300" }),
    ];
    const result = largestTransfers(txs, 2);
    expect(result).toHaveLength(2);
    expect(result[0].fee).toBe("500");
    expect(result[1].fee).toBe("300");
  });

  it("handles empty array", () => {
    expect(largestTransfers([])).toHaveLength(0);
  });
});

describe("transactionsByDay", () => {
  it("groups transactions by day", () => {
    const txs = [
      makeTx({ id: "1", hash: "h1", createdAt: "2024-01-15T10:00:00Z" }),
      makeTx({ id: "2", hash: "h2", createdAt: "2024-01-15T11:00:00Z" }),
      makeTx({ id: "3", hash: "h3", createdAt: "2024-01-16T10:00:00Z" }),
    ];
    const result = transactionsByDay(txs);
    expect(Object.keys(result)).toHaveLength(2);
    expect(result["2024-01-15"]).toHaveLength(2);
    expect(result["2024-01-16"]).toHaveLength(1);
  });
});
