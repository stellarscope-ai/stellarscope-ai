import { describe, it, expect } from "vitest";
import { createHorizonClient } from "../client";

describe("createHorizonClient", () => {
  it("creates a client with default URL", () => {
    const client = createHorizonClient();
    expect(client).toBeDefined();
  });

  it("creates a client with custom URL", () => {
    const client = createHorizonClient("https://horizon.stellar.org");
    expect(client).toBeDefined();
  });
});
