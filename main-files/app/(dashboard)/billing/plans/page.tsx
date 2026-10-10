"use client";

import { useState } from "react";

import { pricingPlans } from "@/components/billing/mock-data";

import PricingHeader from "@/components/billing/plans/pricing-header";
import PricingToggle from "@/components/billing/plans/pricing-toggle";
import PricingCard from "@/components/billing/plans/pricing-card";
import ComparisonTable from "@/components/billing/plans/comparison-table";
import FAQ from "@/components/billing/plans/faq";

export default function PlansPage() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  return (
    <div className="space-y-12">
      <PricingHeader />

      <PricingToggle
        billing={billing}
        setBilling={setBilling}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {pricingPlans.map((plan) => (
          <PricingCard
            key={plan.id}
            name={plan.name}
            description={plan.description}
            price={
              billing === "monthly"
                ? plan.priceMonthly
                : plan.priceYearly
            }
            features={plan.features}
            current={plan.current}
            popular={plan.name === "Pro"}
          />
        ))}
      </div>

      <section className="space-y-6">
  <div>
    <h2 className="text-3xl font-bold tracking-tight">
      Compare Plans
    </h2>

    <p className="text-muted-foreground">
      Compare features across all pricing plans.
    </p>
  </div>

  <ComparisonTable />
</section>

<section className="space-y-6">
  <FAQ />
</section>
    </div>
  );
}