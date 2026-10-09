import type { AIProvider } from "../types";
import { NoopProvider } from "./noop";

export function createProvider(name?: string): AIProvider {
  const providerName = name ?? "noop";

  switch (providerName) {
    case "google": {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { GoogleAIProvider } = require("./google");
      return new GoogleAIProvider();
    }
    case "noop":
    default:
      return new NoopProvider();
  }
}
