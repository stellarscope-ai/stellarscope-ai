import { describe, it, expect } from "vitest";
import { isValidStellarAddress, validateStellarAddress, validateAssetCode, validateDateRange, validatePaginationLimit } from "../validation";

describe("isValidStellarAddress", () => {
  it("accepts valid testnet address", () => {
    expect(isValidStellarAddress("GHBRPOIGF3CBFNOBM2O4RAK3VRJNVGFYGWWQC5HYFSXMECOSFOGYR5XK")).toBe(true);
  });

  it("rejects addresses not starting with G", () => {
    expect(isValidStellarAddress("AXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")).toBe(false);
  });

  it("rejects short addresses", () => {
    expect(isValidStellarAddress("GBXV5")).toBe(false);
  });

  it("rejects lowercase addresses", () => {
    expect(isValidStellarAddress("g" + "a".repeat(55))).toBe(false);
  });

  it("rejects empty string", () => {
    expect(isValidStellarAddress("")).toBe(false);
  });
});

describe("validateStellarAddress", () => {
  it("throws on invalid address", () => {
    expect(() => validateStellarAddress("invalid")).toThrow("Invalid Stellar address");
  });

  it("does not throw on valid address", () => {
    expect(() => validateStellarAddress("GHBRPOIGF3CBFNOBM2O4RAK3VRJNVGFYGWWQC5HYFSXMECOSFOGYR5XK")).not.toThrow();
  });
});

describe("validateAssetCode", () => {
  it("throws on empty code", () => {
    expect(() => validateAssetCode("")).toThrow("Invalid asset code");
  });

  it("throws on code longer than 12 chars", () => {
    expect(() => validateAssetCode("A".repeat(13))).toThrow("Invalid asset code");
  });

  it("accepts valid codes", () => {
    expect(() => validateAssetCode("USDC")).not.toThrow();
    expect(() => validateAssetCode("XLM")).not.toThrow();
  });
});

describe("validateDateRange", () => {
  it("throws when start >= end", () => {
    const now = new Date();
    expect(() => validateDateRange(now, new Date(now.getTime() - 1000))).toThrow("start must be before end");
  });

  it("throws on invalid dates", () => {
    expect(() => validateDateRange(new Date("invalid"), new Date())).toThrow("dates must be valid");
  });

  it("accepts valid range", () => {
    const start = new Date("2024-01-01");
    const end = new Date("2024-01-02");
    expect(() => validateDateRange(start, end)).not.toThrow();
  });
});

describe("validatePaginationLimit", () => {
  it("throws on zero", () => {
    expect(() => validatePaginationLimit(0)).toThrow("must be between");
  });

  it("throws on negative", () => {
    expect(() => validatePaginationLimit(-1)).toThrow("must be between");
  });

  it("throws above max", () => {
    expect(() => validatePaginationLimit(201)).toThrow("must be between");
  });

  it("accepts valid limits", () => {
    expect(() => validatePaginationLimit(10)).not.toThrow();
    expect(() => validatePaginationLimit(200)).not.toThrow();
  });
});
