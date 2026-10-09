export class StellarDataError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500
  ) {
    super(message);
    this.name = "StellarDataError";
  }
}

export class AccountNotFoundError extends StellarDataError {
  constructor(accountId: string) {
    super(`Account not found: ${accountId}`, "ACCOUNT_NOT_FOUND", 404);
    this.name = "AccountNotFoundError";
  }
}

export class AssetNotFoundError extends StellarDataError {
  constructor(assetCode: string, assetIssuer: string) {
    super(`Asset not found: ${assetCode}:${assetIssuer}`, "ASSET_NOT_FOUND", 404);
    this.name = "AssetNotFoundError";
  }
}

export class InvalidAddressError extends StellarDataError {
  constructor(address: string) {
    super(`Invalid Stellar address: ${address}`, "INVALID_ADDRESS", 400);
    this.name = "InvalidAddressError";
  }
}

export class HorizonApiError extends StellarDataError {
  constructor(message: string, public readonly horizonStatus?: number) {
    super(message, "HORIZON_API_ERROR", 502);
    this.name = "HorizonApiError";
  }
}
