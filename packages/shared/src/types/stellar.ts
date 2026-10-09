export interface StellarAccount {
  accountId: string;
  balances: StellarBalance[];
  sequence: string;
  subentryCount: number;
  inflationDestination?: string;
  homeDomain?: string;
}

export interface StellarBalance {
  assetType: string;
  assetCode?: string;
  assetIssuer?: string;
  balance: string;
  limit?: string;
}

export interface StellarTransaction {
  id: string;
  hash: string;
  ledger: number;
  createdAt: string;
  sourceAccount: string;
  fee: string;
  memoType?: string;
  memo?: string;
  operationCount: number;
  successful: boolean;
  operationTypes?: string[];
  explorerUrl: string;
}

export interface AssetInfo {
  assetCode: string;
  assetIssuer: string;
  assetType: string;
  accounts: {
    authorized: number;
    authorizedToMaintainLiabilities: number;
    unauthorized: number;
  };
  numAccounts: number;
  payments24h: number;
  trades24h: number;
  supply: string;
  link: string;
}
