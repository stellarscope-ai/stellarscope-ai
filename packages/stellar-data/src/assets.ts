import { Asset } from "@stellar/stellar-sdk";
import type { AssetInfo } from "@stellarscope/shared";
import { getDefaultClient } from "./client";
import { validateAssetCode, validateStellarAddress, validateDateRange } from "./validation";
import { AssetNotFoundError, HorizonApiError } from "./errors";

export async function getAssetDetails(assetCode: string, assetIssuer: string): Promise<AssetInfo> {
  validateAssetCode(assetCode);
  validateStellarAddress(assetIssuer);

  const server = getDefaultClient();

  try {
    const assets = await server.assets().forCode(assetCode).forIssuer(assetIssuer).call();

    if (assets.records.length === 0) {
      throw new AssetNotFoundError(assetCode, assetIssuer);
    }

    const asset = assets.records[0] as unknown as Record<string, unknown>;
    const accounts = (asset.accounts ?? {}) as Record<string, number>;

    return {
      assetCode: (asset.asset_code as string) ?? assetCode,
      assetIssuer: (asset.asset_issuer as string) ?? assetIssuer,
      assetType: (asset.asset_type as string) ?? "credit_alphanum4",
      accounts: {
        authorized: (accounts.authorized ?? 0) as number,
        authorizedToMaintainLiabilities: (accounts.authorized_to_maintain_liabilities ?? 0) as number,
        unauthorized: (accounts.unauthorized ?? 0) as number,
      },
      numAccounts: (accounts.authorized ?? 0) as number,
      payments24h: (asset.payments24h as number) ?? 0,
      trades24h: (asset.trades24h as number) ?? 0,
      supply: (asset.amount as string) ?? "0",
      link: `https://stellar.expert/explorer/public/asset/${assetCode}-${assetIssuer}`,
    };
  } catch (err) {
    if (err instanceof AssetNotFoundError) throw err;
    const error = err as { response?: { status?: number }; message?: string };
    throw new HorizonApiError(
      `Failed to fetch asset details: ${error.message ?? "unknown error"}`,
      error.response?.status
    );
  }
}

export async function getAssetActivity(
  assetCode: string,
  assetIssuer: string,
  startTime: Date,
  endTime: Date
) {
  validateAssetCode(assetCode);
  validateStellarAddress(assetIssuer);
  validateDateRange(startTime, endTime);

  const server = getDefaultClient();
  const startMs = startTime.getTime();
  const endMs = endTime.getTime();

  try {
    const trades = await server
      .trades()
      .forAssetPair(
        new Asset(assetCode, assetIssuer),
        Asset.native()
      )
      .order("desc")
      .limit(200)
      .call();

    const records = trades.records as unknown as Record<string, unknown>[];

    const filtered = records.filter((r) => {
      const created = new Date(r.ledger_close_time as string).getTime();
      return created >= startMs && created <= endMs;
    });

    const uniqueAccounts = new Set<string>();
    for (const r of filtered) {
      if (r.base_account) uniqueAccounts.add(r.base_account as string);
      if (r.counter_account) uniqueAccounts.add(r.counter_account as string);
    }

    return {
      assetCode,
      assetIssuer,
      period: { start: startTime.toISOString(), end: endTime.toISOString() },
      tradeCount: filtered.length,
      uniqueAccounts: uniqueAccounts.size,
      trades: filtered.slice(0, 50).map((r) => ({
        id: r.id as string,
        baseAmount: (r.base_amount as string) ?? "0",
        counterAmount: (r.counter_amount as string) ?? "0",
        baseAccount: (r.base_account as string) ?? undefined,
        counterAccount: (r.counter_account as string) ?? undefined,
        price: (r.price as Record<string, string>)?.n
          ? `${(r.price as Record<string, string>).n}/${(r.price as Record<string, string>).d}`
          : undefined,
        createdAt: r.ledger_close_time as string,
      })),
    };
  } catch (err) {
    if (err instanceof Error && err.message.includes("Invalid")) throw err;
    const error = err as { response?: { status?: number }; message?: string };
    throw new HorizonApiError(
      `Failed to fetch asset activity: ${error.message ?? "unknown error"}`,
      error.response?.status
    );
  }
}
