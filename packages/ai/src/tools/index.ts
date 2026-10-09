import type { RegisteredTool, ToolDefinition, ToolHandler } from "../types";

const registry: RegisteredTool[] = [];

export function registerTool(definition: ToolDefinition, handler: ToolHandler): void {
  registry.push({ definition, handler });
}

export function getRegisteredTools(): RegisteredTool[] {
  return [...registry];
}
