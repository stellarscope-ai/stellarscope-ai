import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../client", () => ({
  getDefaultClient: vi.fn(),
}));

import { getDefaultClient } from "../client";
import { getAccount, getAccountBalances } from "../accounts";
import { AccountNotFoundError, HorizonApiError } from "../errors";

const mockGetAccount = vi.fn();

function mockServer() {
  const server = { accounts: () => ({ accountId: () => ({ call: mockGetAccount }) }) };
  vi.mocked(getDefaultClient).mockReturnValue(server as unknown as ReturnType<typeof getDefaultClient>);
}

describe("getAccount", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockServer();
  });

  it("returns mapped account data", async () => {
    mockGetAccount.mockResolvedValue({
      account_id: "GBXV5TEST",
      balances: [{ asset_type: "native", balance: "100.0000000" }],
      sequence: "12345",
      subentry_count: 2,
      inflation_destination: null,
      home_domain: "test.com",
    });

    const account = await getAccount("GHBRPOIGF3CBFNOBM2O4RAK3VRJNVGFYGWWQC5HYFSXMECOSFOGYR5XK");
    expect(account.accountId).toBe("GBXV5TEST");
    expect(account.balances).toHaveLength(1);
    expect(account.balances[0].assetType).toBe("native");
    expect(account.balances[0].balance).toBe("100.0000000");
    expect(account.sequence).toBe("12345");
    expect(account.homeDomain).toBe("test.com");
  });

  it("maps credit balances correctly", async () => {
    mockGetAccount.mockResolvedValue({
      account_id: "GBXV5TEST",
      balances: [
        { asset_type: "credit_alphanum4", asset_code: "USDC", asset_issuer: "GBBDTEST", balance: "50.00", limit: "1000.00" },
      ],
      sequence: "1",
      subentry_count: 0,
    });

    const account = await getAccount("GHBRPOIGF3CBFNOBM2O4RAK3VRJNVGFYGWWQC5HYFSXMECOSFOGYR5XK");
    expect(account.balances[0].assetCode).toBe("USDC");
    expect(account.balances[0].assetIssuer).toBe("GBBDTEST");
    expect(account.balances[0].limit).toBe("1000.00");
  });

  it("throws AccountNotFoundError on 404", async () => {
    mockGetAccount.mockRejectedValue({ response: { status: 404 } });

    await expect(getAccount("GHBRPOIGF3CBFNOBM2O4RAK3VRJNVGFYGWWQC5HYFSXMECOSFOGYR5XK"))
      .rejects.toThrow(AccountNotFoundError);
  });

  it("throws HorizonApiError on other failures", async () => {
    mockGetAccount.mockRejectedValue({ response: { status: 500 }, message: "server error" });

    await expect(getAccount("GHBRPOIGF3CBFNOBM2O4RAK3VRJNVGFYGWWQC5HYFSXMECOSFOGYR5XK"))
      .rejects.toThrow(HorizonApiError);
  });

  it("rejects invalid address", async () => {
    await expect(getAccount("invalid")).rejects.toThrow("Invalid Stellar address");
  });
});

describe("getAccountBalances", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockServer();
  });

  it("returns balances array", async () => {
    mockGetAccount.mockResolvedValue({
      account_id: "GBXV5TEST",
      balances: [{ asset_type: "native", balance: "100.0000000" }],
      sequence: "1",
      subentry_count: 0,
    });

    const balances = await getAccountBalances("GHBRPOIGF3CBFNOBM2O4RAK3VRJNVGFYGWWQC5HYFSXMECOSFOGYR5XK");
    expect(balances).toHaveLength(1);
    expect(balances[0].balance).toBe("100.0000000");
  });
});
