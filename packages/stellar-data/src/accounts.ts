import type { StellarAccount, StellarBalance } from "@stellarscope/shared";
import { getDefaultClient } from "./client";
import { validateStellarAddress } from "./validation";
import { AccountNotFoundError, HorizonApiError } from "./errors";

export async function getAccount(accountId: string): Promise<StellarAccount> {
  validateStellarAddress(accountId);

  const server = getDefaultClient();

  try {
    const account = await server.accounts().accountId(accountId).call();

    return {
      accountId: account.account_id,
      balances: account.balances.map(mapBalance),
      sequence: account.sequence,
      subentryCount: account.subentry_count,
      inflationDestination: account.inflation_destination ?? undefined,
      homeDomain: account.home_domain ?? undefined,
    };
  } catch (err: unknown) {
    const error = err as { response?: { status?: number }; message?: string };
    if (error.response?.status === 404) {
      throw new AccountNotFoundError(accountId);
    }
    throw new HorizonApiError(
      `Failed to fetch account: ${error.message ?? "unknown error"}`,
      error.response?.status
    );
  }
}

export async function getAccountBalances(accountId: string): Promise<StellarBalance[]> {
  const account = await getAccount(accountId);
  return account.balances;
}

interface HorizonBalance {
  asset_type: string;
  asset_code?: string;
  asset_issuer?: string;
  balance: string;
  limit?: string;
}

function mapBalance(b: HorizonBalance): StellarBalance {
  if (b.asset_type === "native") {
    return {
      assetType: "native",
      balance: b.balance,
    };
  }

  return {
    assetType: b.asset_type,
    assetCode: b.asset_code,
    assetIssuer: b.asset_issuer,
    balance: b.balance,
    limit: b.limit,
  };
}
