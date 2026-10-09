import { z } from "zod";

export const balanceSchema = z.object({
  assetType: z.string(),
  assetCode: z.string().optional(),
  assetIssuer: z.string().optional(),
  balance: z.string(),
  limit: z.string().optional(),
});

export const accountSchema = z.object({
  accountId: z.string().startsWith("G").length(56),
  balances: z.array(balanceSchema),
  sequence: z.string(),
  subentryCount: z.number(),
  inflationDestination: z.string().optional(),
  homeDomain: z.string().optional(),
});

export const stellarAddressSchema = z.string().startsWith("G").length(56);

export const assetIdentifierSchema = z.object({
  code: z.string().min(1).max(12),
  issuer: z.string().startsWith("G").length(56),
});
