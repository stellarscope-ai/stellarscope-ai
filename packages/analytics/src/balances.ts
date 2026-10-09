import type { StellarBalance } from "@stellarscope/shared";

export interface BalanceSummary {
  nativeBalance: string;
  assetCount: number;
  assets: AssetHolding[];
}

export interface AssetHolding {
  code: string;
  issuer?: string;
  balance: string;
}

export interface PortfolioValue {
  totalNative: string;
  totalUsd?: number;
  breakdown: AssetHolding[];
}

export function summarizeBalances(balances: StellarBalance[]): BalanceSummary {
  const native = balances.find((b) => b.assetType === "native");
  const assets = balances
    .filter((b) => b.assetType !== "native")
    .map((b) => ({
      code: b.assetCode ?? "unknown",
      issuer: b.assetIssuer,
      balance: b.balance,
    }));

  return {
    nativeBalance: native?.balance ?? "0",
    assetCount: assets.length,
    assets,
  };
}

export function calculatePortfolioValue(
  balances: StellarBalance[],
  prices: Map<string, number>
): PortfolioValue {
  let totalUsd = 0;

  const breakdown = balances
    .filter((b) => b.assetType !== "native")
    .map((b) => {
      const code = b.assetCode ?? "unknown";
      const price = prices.get(code) ?? 0;
      const value = parseFloat(b.balance) * price;
      totalUsd += value;
      return { code, issuer: b.assetIssuer, balance: b.balance };
    });

  const nativeBalance = balances.find((b) => b.assetType === "native");
  const nativePrice = prices.get("XLM") ?? 0;
  const nativeValue = parseFloat(nativeBalance?.balance ?? "0") * nativePrice;
  totalUsd += nativeValue;

  return {
    totalNative: nativeBalance?.balance ?? "0",
    totalUsd,
    breakdown,
  };
}
