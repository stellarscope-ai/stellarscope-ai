import { validateStellarAddress } from "./validation";

export interface SubscriptionInfo {
  tier: number;
  tierName: string;
  expiresAt: string;
  isActive: boolean;
}

const TIER_NAMES: Record<number, string> = {
  0: "Free",
  1: "Basic",
  2: "Premium",
};

export function getTierName(tier: number): string {
  return TIER_NAMES[tier] ?? "Unknown";
}

export function getTierPrice(tier: number): string {
  switch (tier) {
    case 1: return "1 XLM";
    case 2: return "5 XLM";
    default: return "Free";
  }
}

export function getTierFeatures(tier: number): string[] {
  switch (tier) {
    case 0: return ["5 watchlist items", "Basic account lookups"];
    case 1: return ["25 watchlist items", "Full analytics", "Email alerts"];
    case 2: return ["Unlimited watchlists", "Priority API access", "All alerts", "Advanced analytics"];
    default: return [];
  }
}

export function formatSubscription(sub: { tier: number; expires_at: number; created_at: number }): SubscriptionInfo {
  const now = Math.floor(Date.now() / 1000);
  return {
    tier: sub.tier,
    tierName: getTierName(sub.tier),
    expiresAt: new Date(sub.expires_at * 1000).toISOString(),
    isActive: sub.expires_at > now,
  };
}

export function getContractAddress(): string {
  return process.env.SOROBAN_CONTRACT_ADDRESS ?? "";
}

export function validateContractSetup(): void {
  const address = getContractAddress();
  if (!address) {
    throw new Error("SOROBAN_CONTRACT_ADDRESS environment variable is not set");
  }
  validateStellarAddress(address);
}