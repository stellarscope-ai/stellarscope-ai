const STELLAR_ADDRESS_REGEX = /^G[A-Z2-7]{55}$/;

export function isValidStellarAddress(address: string): boolean {
  return STELLAR_ADDRESS_REGEX.test(address);
}

export function validateStellarAddress(address: string): void {
  if (!isValidStellarAddress(address)) {
    throw new Error(`Invalid Stellar address: ${address}`);
  }
}

export function validateAssetCode(code: string): void {
  if (!code || code.length === 0 || code.length > 12) {
    throw new Error(`Invalid asset code: ${code}`);
  }
}

export function validateDateRange(start: Date, end: Date): void {
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error("Invalid date range: dates must be valid");
  }
  if (start >= end) {
    throw new Error("Invalid date range: start must be before end");
  }
}

export function validatePaginationLimit(limit: number, max = 200): void {
  if (!Number.isInteger(limit) || limit < 1 || limit > max) {
    throw new Error(`Invalid limit: must be between 1 and ${max}`);
  }
}
