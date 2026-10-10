"use client";

import { useRouter } from "next/navigation";

import { UsageLimitBanner } from "@/components/billing/usage/usage-limit-banner";
import { UsageSummaryCard } from "@/components/billing/usage/usage-summary-card";
import { UsageOverTimeChart } from "@/components/billing/usage/usage-over-time-chart";
import { UsageByFeatureChart } from "@/components/billing/usage/usage-by-feature-chart";
import { UsageByModelTable } from "@/components/billing/usage/usage-by-model-table";

export default function UsagePage() {
  const router = useRouter();

  const used = 2450;
  const limit = 5000;
  const percentage = Math.round((used / limit) * 100);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Usage</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track your credit consumption across models and features.
        </p>
      </div>

      <UsageLimitBanner
        percentage={percentage}
        onUpgrade={() => router.push("/billing/plans")}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <UsageSummaryCard
          used={used}
          limit={limit}
          cycleEnd="Aug 1, 2026"
          projectedUsage={4820}
        />

        <div className="lg:col-span-2">
          <UsageOverTimeChart />
        </div>
      </div>

      <UsageByFeatureChart />

      <div className="space-y-3">
        <h2 className="text-sm font-semibold">Usage by Model</h2>
        <UsageByModelTable />
      </div>
    </div>
  );
}