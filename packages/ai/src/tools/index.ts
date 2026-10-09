import type { RegisteredTool, ToolDefinition, ToolHandler } from "../types";

const registry: RegisteredTool[] = [];

export function registerTool(definition: ToolDefinition, handler: ToolHandler): void {
  registry.push({ definition, handler });
}

export function getRegisteredTools(): RegisteredTool[] {
  return [...registry];
}

export function clearRegistry(): void {
  registry.length = 0;
}

export function createDefaultTools(): RegisteredTool[] {
  const { accountLookupDefinition, createAccountLookupHandler } = require("./account-lookup") as typeof import("./account-lookup");
  const { txSummaryDefinition, createTxSummaryHandler } = require("./tx-summary") as typeof import("./tx-summary");
  const { transactionDetailsDefinition, createTransactionDetailsHandler } = require("./transaction-details") as typeof import("./transaction-details");
  const { assetActivityDefinition, createAssetActivityHandler } = require("./asset-activity") as typeof import("./asset-activity");

  return [
    { definition: accountLookupDefinition, handler: createAccountLookupHandler() },
    { definition: txSummaryDefinition, handler: createTxSummaryHandler() },
    { definition: transactionDetailsDefinition, handler: createTransactionDetailsHandler() },
    { definition: assetActivityDefinition, handler: createAssetActivityHandler() },
  ];
}