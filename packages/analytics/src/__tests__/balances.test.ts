import { describe, it, expect } from "vitest";
import { summarizeBalances } from "../balances";
import type { StellarBalance } from "@stellarscope/shared";

describe("summarizeBalances", () => {
  it("summarizes native balance", () => {
    const balances: StellarBalance[] = [
      { assetType: "native", balance: "100.0000000" },
    ];
    const result = summarizeBalances(balances);
    expect(result.nativeBalance).toBe("100.0000000");
    expect(result.assetCount).toBe(0);
  });

  it("summarizes mixed balances", () => {
    const balances: StellarBalance[] = [
      { assetType: "native", balance: "50.0000000" },
      { assetType: "credit_alphanum4", assetCode: "USDC", assetIssuer: "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5", balance: "25.00" },
    ];
    const result = summarizeBalances(balances);
    expect(result.nativeBalance).toBe("50.0000000");
    expect(result.assetCount).toBe(1);
    expect(result.assets[0].code).toBe("USDC");
  });
});
