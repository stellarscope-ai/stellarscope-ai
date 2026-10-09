import { Horizon } from "@stellar/stellar-sdk";

const DEFAULT_HORIZON_URL = "https://horizon-testnet.stellar.org";

export function createHorizonClient(url?: string): Horizon.Server {
  return new Horizon.Server(url ?? process.env.STELLAR_HORIZON_URL ?? DEFAULT_HORIZON_URL);
}

let defaultClient: Horizon.Server | null = null;

export function getDefaultClient(): Horizon.Server {
  if (!defaultClient) {
    defaultClient = createHorizonClient();
  }
  return defaultClient;
}
