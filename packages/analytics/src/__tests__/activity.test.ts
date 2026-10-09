import { describe, it, expect } from "vitest";
import { compareActivity, percentChange, getSevenDayComparison } from "../activity";

function makeTx(overrides: Partial<{ createdAt: string; sourceAccount: string; operationCount: number; successful: boolean }> = {}) {
  return {
    createdAt: "2024-06-15T12:00:00Z",
    sourceAccount: "GACCOUNT1",
    operationCount: 1,
    successful: true,
    ...overrides,
  };
}

describe("percentChange", () => {
  it("computes positive change", () => {
    const result = percentChange(10, 15);
    expect(result.absolute).toBe(5);
    expect(result.percent).toBeCloseTo(50);
    expect(result.direction).toBe("up");
  });

  it("computes negative change", () => {
    const result = percentChange(20, 10);
    expect(result.absolute).toBe(-10);
    expect(result.percent).toBeCloseTo(-50);
    expect(result.direction).toBe("down");
  });

  it("handles flat (no change)", () => {
    const result = percentChange(10, 10);
    expect(result.absolute).toBe(0);
    expect(result.percent).toBe(0);
    expect(result.direction).toBe("flat");
  });

  it("handles zero baseline (no division by zero)", () => {
    const result = percentChange(0, 5);
    expect(result.absolute).toBe(5);
    expect(result.percent).toBeNull();
    expect(result.direction).toBe("up");
  });

  it("handles both zero", () => {
    const result = percentChange(0, 0);
    expect(result.absolute).toBe(0);
    expect(result.percent).toBeNull();
    expect(result.direction).toBe("flat");
  });
});

describe("compareActivity", () => {
  const currentWindow = {
    start: new Date("2024-06-15T00:00:00Z"),
    end: new Date("2024-06-22T00:00:00Z"),
  };
  const previousWindow = {
    start: new Date("2024-06-08T00:00:00Z"),
    end: new Date("2024-06-15T00:00:00Z"),
  };

  it("compares two windows", () => {
    const current = [
      makeTx({ createdAt: "2024-06-16T12:00:00Z" }),
      makeTx({ createdAt: "2024-06-17T12:00:00Z" }),
    ];
    const previous = [makeTx({ createdAt: "2024-06-10T12:00:00Z" })];

    const result = compareActivity(current, previous, currentWindow, previousWindow);
    expect(result.current.transactionCount).toBe(2);
    expect(result.previous.transactionCount).toBe(1);
    expect(result.change.transactionCount.percent).toBeCloseTo(100);
    expect(result.trend).toBe("increasing");
  });

  it("handles no data in either window", () => {
    const result = compareActivity([], [], currentWindow, previousWindow);
    expect(result.current.transactionCount).toBe(0);
    expect(result.previous.transactionCount).toBe(0);
    expect(result.change.transactionCount.percent).toBeNull();
    expect(result.trend).toBe("no_data");
  });

  it("handles zero baseline in previous window", () => {
    const current = [makeTx({ createdAt: "2024-06-16T12:00:00Z" })];
    const result = compareActivity(current, [], currentWindow, previousWindow);
    expect(result.change.transactionCount.direction).toBe("up");
    expect(result.change.transactionCount.percent).toBeNull();
  });

  it("excludes failed transactions", () => {
    const current = [
      makeTx({ createdAt: "2024-06-16T12:00:00Z", successful: true }),
      makeTx({ createdAt: "2024-06-16T13:00:00Z", successful: false }),
    ];
    const result = compareActivity(current, [], currentWindow, previousWindow);
    expect(result.current.transactionCount).toBe(1);
  });

  it("counts unique accounts", () => {
    const current = [
      makeTx({ createdAt: "2024-06-16T12:00:00Z", sourceAccount: "GA" }),
      makeTx({ createdAt: "2024-06-16T13:00:00Z", sourceAccount: "GA" }),
      makeTx({ createdAt: "2024-06-17T12:00:00Z", sourceAccount: "GB" }),
    ];
    const result = compareActivity(current, [], currentWindow, previousWindow);
    expect(result.current.uniqueAccounts).toBe(2);
  });

  it("sums operation counts", () => {
    const current = [
      makeTx({ createdAt: "2024-06-16T12:00:00Z", operationCount: 3 }),
      makeTx({ createdAt: "2024-06-16T13:00:00Z", operationCount: 2 }),
    ];
    const result = compareActivity(current, [], currentWindow, previousWindow);
    expect(result.current.totalOperations).toBe(5);
  });
});

describe("getSevenDayComparison", () => {
  it("returns 7-day windows", () => {
    const ref = new Date("2024-06-20T12:00:00Z");
    const result = getSevenDayComparison([], ref);
    expect(result.current.start).toBe("2024-06-13T12:00:00.000Z");
    expect(result.current.end).toBe("2024-06-20T12:00:00.000Z");
    expect(result.previous.start).toBe("2024-06-06T12:00:00.000Z");
    expect(result.previous.end).toBe("2024-06-13T12:00:00.000Z");
  });
});
