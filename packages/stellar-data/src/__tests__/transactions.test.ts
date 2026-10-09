import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../client", () => ({
  getDefaultClient: vi.fn(),
}));

import { getDefaultClient } from "../client";
import { getTransactionHistory, getTransactionDetails } from "../transactions";
import { HorizonApiError } from "../errors";

const mockCall = vi.fn();

function mockServer() {
  const server = {
    transactions: () => ({
      forAccount: () => ({
        order: () => ({ limit: () => ({ cursor: () => ({ call: mockCall }), call: mockCall }), call: mockCall }),
        limit: () => ({ call: mockCall }),
        call: mockCall,
      }),
      transaction: () => ({ call: mockCall }),
    }),
  };
  vi.mocked(getDefaultClient).mockReturnValue(server as unknown as ReturnType<typeof getDefaultClient>);
}

describe("getTransactionHistory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockServer();
  });

  it("returns mapped transactions", async () => {
    mockCall.mockResolvedValue({
      records: [
        {
          id: "tx-1",
          hash: "abc123",
          ledger: 100,
          created_at: "2024-01-01T00:00:00Z",
          source_account: "GBXV5TEST",
          fee_charged: "100",
          operation_count: 1,
          successful: true,
          paging_token: "cursor-1",
        },
      ],
    });

    const result = await getTransactionHistory("GHBRPOIGF3CBFNOBM2O4RAK3VRJNVGFYGWWQC5HYFSXMECOSFOGYR5XK");
    expect(result.records).toHaveLength(1);
    expect(result.records[0].hash).toBe("abc123");
    expect(result.records[0].successful).toBe(true);
    expect(result.records[0].explorerUrl).toContain("abc123");
    expect(result.nextCursor).toBe("cursor-1");
  });

  it("handles empty results", async () => {
    mockCall.mockResolvedValue({ records: [] });

    const result = await getTransactionHistory("GHBRPOIGF3CBFNOBM2O4RAK3VRJNVGFYGWWQC5HYFSXMECOSFOGYR5XK");
    expect(result.records).toHaveLength(0);
    expect(result.nextCursor).toBeUndefined();
  });

  it("rejects invalid address", async () => {
    await expect(getTransactionHistory("invalid")).rejects.toThrow("Invalid Stellar address");
  });

  it("rejects invalid limit", async () => {
    await expect(getTransactionHistory("GHBRPOIGF3CBFNOBM2O4RAK3VRJNVGFYGWWQC5HYFSXMECOSFOGYR5XK", { limit: 0 }))
      .rejects.toThrow("must be between");
  });

  it("throws HorizonApiError on failure", async () => {
    mockCall.mockRejectedValue({ response: { status: 500 }, message: "error" });

    await expect(getTransactionHistory("GHBRPOIGF3CBFNOBM2O4RAK3VRJNVGFYGWWQC5HYFSXMECOSFOGYR5XK"))
      .rejects.toThrow(HorizonApiError);
  });
});

describe("getTransactionDetails", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockServer();
  });

  it("returns transaction details", async () => {
    mockCall.mockResolvedValue({
      id: "tx-1",
      hash: "a".repeat(64),
      ledger: 42,
      created_at: "2024-01-01T00:00:00Z",
      source_account: "GBXV5TEST",
      fee_charged: "100",
      operation_count: 2,
      successful: true,
    });

    const tx = await getTransactionDetails("a".repeat(64));
    expect(tx.hash).toBe("a".repeat(64));
    expect(tx.ledger).toBe(42);
    expect(tx.operationCount).toBe(2);
  });

  it("rejects invalid hash length", async () => {
    await expect(getTransactionDetails("short")).rejects.toThrow("Invalid transaction hash");
  });
});
