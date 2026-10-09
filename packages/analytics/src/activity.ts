export interface ActivityWindow {
  start: string;
  end: string;
  transactionCount: number;
  uniqueAccounts: number;
  totalOperations: number;
}

export interface ActivityComparison {
  current: ActivityWindow;
  previous: ActivityWindow;
  change: {
    transactionCount: PercentChange;
    uniqueAccounts: PercentChange;
    totalOperations: PercentChange;
  };
  trend: "increasing" | "decreasing" | "stable" | "no_data";
}

export interface PercentChange {
  absolute: number;
  percent: number | null;
  direction: "up" | "down" | "flat" | "no_baseline";
}

export function compareActivity(
  currentTransactions: Array<{ createdAt: string; sourceAccount: string; operationCount: number; successful: boolean }>,
  previousTransactions: Array<{ createdAt: string; sourceAccount: string; operationCount: number; successful: boolean }>,
  currentWindow: { start: Date; end: Date },
  previousWindow: { start: Date; end: Date }
): ActivityComparison {
  const current = buildWindow(currentTransactions, currentWindow);
  const previous = buildWindow(previousTransactions, previousWindow);

  return {
    current,
    previous,
    change: {
      transactionCount: percentChange(previous.transactionCount, current.transactionCount),
      uniqueAccounts: percentChange(previous.uniqueAccounts, current.uniqueAccounts),
      totalOperations: percentChange(previous.totalOperations, current.totalOperations),
    },
    trend: detectTrend(previous.transactionCount, current.transactionCount),
  };
}

function buildWindow(
  transactions: Array<{ createdAt: string; sourceAccount: string; operationCount: number; successful: boolean }>,
  window: { start: Date; end: Date }
): ActivityWindow {
  const startMs = window.start.getTime();
  const endMs = window.end.getTime();

  const filtered = transactions.filter((tx) => {
    const t = new Date(tx.createdAt).getTime();
    return t >= startMs && t <= endMs && tx.successful;
  });

  const uniqueAccounts = new Set(filtered.map((tx) => tx.sourceAccount));
  const totalOperations = filtered.reduce((sum, tx) => sum + tx.operationCount, 0);

  return {
    start: window.start.toISOString(),
    end: window.end.toISOString(),
    transactionCount: filtered.length,
    uniqueAccounts: uniqueAccounts.size,
    totalOperations,
  };
}

export function percentChange(baseline: number, current: number): PercentChange {
  const absolute = current - baseline;

  if (baseline === 0 && current === 0) {
    return { absolute: 0, percent: null, direction: "flat" };
  }

  if (baseline === 0) {
    return { absolute, percent: null, direction: "up" };
  }

  const percent = ((current - baseline) / baseline) * 100;

  let direction: PercentChange["direction"];
  if (absolute > 0) direction = "up";
  else if (absolute < 0) direction = "down";
  else direction = "flat";

  return { absolute, percent, direction };
}

function detectTrend(baseline: number, current: number): ActivityComparison["trend"] {
  if (baseline === 0 && current === 0) return "no_data";
  const change = percentChange(baseline, current);
  if (change.direction === "up" && (change.percent ?? 0) >= 10) return "increasing";
  if (change.direction === "down" && (change.percent ?? 0) >= 10) return "decreasing";
  return "stable";
}

export function getSevenDayComparison(
  transactions: Array<{ createdAt: string; sourceAccount: string; operationCount: number; successful: boolean }>,
  referenceDate: Date = new Date()
): ActivityComparison {
  const end = new Date(referenceDate);
  const start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);
  const prevEnd = new Date(start.getTime());
  const prevStart = new Date(prevEnd.getTime() - 7 * 24 * 60 * 60 * 1000);

  return compareActivity(
    transactions,
    transactions,
    { start, end },
    { start: prevStart, end: prevEnd }
  );
}
